import { ExternalTask, Prisma } from '@prisma/client';
import assert from 'assert';

import type { JiraIssue } from '../integration/jira';
import { jiraService } from '../integration/jira';
import { prisma } from '../prisma';
import { recalculateCriteriaScore } from '../recalculateCriteriaScore';
import { safelyParseJson } from '../safelyParseJson';

import { getSheep } from './sheep';
import {
    castJobData,
    createCriteriaListToUpdate,
    createCriteriaToUpdate,
    JobDataMap,
    jobKind,
    jobState,
} from './create';

export const dayDuration = 24 * 60 * 60 * 1000;

const createSQLValues = (sources: JiraIssue[]) =>
    Prisma.join(
        sources.map(({ key, id, status, summary, issuetype, reporter, project, resolution, creator, assignee }) =>
            Prisma.join(
                [
                    id,
                    key,
                    summary,
                    status.name,
                    status.statusCategory.id,
                    status?.statusCategory.name,
                    status.statusCategory?.id ? status.statusCategory?.id : Number(status.id),
                    status.statusCategory?.colorName ?? null,
                    status.iconUrl,
                    project.name,
                    project.key,
                    issuetype.name,
                    issuetype.iconUrl,
                    issuetype.id,
                    reporter?.emailAddress,
                    reporter?.key,
                    reporter?.displayName || reporter?.name || null,
                    creator?.emailAddress,
                    creator?.key,
                    creator?.displayName || creator?.name || null,
                    assignee?.emailAddress,
                    assignee?.key,
                    assignee?.displayName || assignee?.name || null,
                    resolution?.name || null,
                    resolution?.id || null,
                ],
                ',',
                '(',
                ')',
            ),
        ),
    );

const getResolvedJiraTasks = async (ids: string[]) => {
    if (ids.length) {
        const results = await jiraService.instance.searchJira(
            `key in (${ids.map((id) => `"${id}"`).join(',')}) and resolution is not EMPTY`,
        );

        return results.issues.map((issue: { fields: { [key: string]: unknown } }) => ({
            ...issue,
            ...issue.fields,
        })) as Array<JiraIssue>;
    }

    return null;
};

export const updateAssociatedGoalsByCriteriaIds = (_criteriaIds: string[]) => {};

const getSheepOrThrow = async () => {
    const { activityId } = (await getSheep()) || {};

    assert(activityId, 'No avaliable sheeps');

    return activityId;
};

// get all incompleted criteria with associated jira tasks
const getCriteriaWithTasks = async (from: Date) =>
    prisma.goalAchieveCriteria.findMany({
        where: {
            externalTaskId: { not: null },
            isDone: false,
            updatedAt: { lte: from },
            AND: [
                {
                    OR: [{ deleted: false }, { deleted: null }],
                },
            ],
        },
        select: {
            id: true,
            goalId: true,
            externalTask: true,
        },
    });

const updateExternalTasks = (tasks: JiraIssue[]) => {
    // update external tasks
    const values = createSQLValues(tasks); // (val1-1, val1-2, ...), (val2-1, val2-2, ...), ...

    const valuesToUpdate = Prisma.sql`(
        VALUES${values}
    ) AS task(
        "externalId", "key", "title",
        "state", "stateId", "stateCategoryName", "stateCategoryId", "stateColor", "stateIcon",
        "project", "projectKey",
        "type", "typeIcon", "typeId",
        "ownerEmail", "ownerKey", "ownerName",
        "creatorEmail", "creatorKey", "creatorName",
        "assigneeEmail", "assigneeKey", "assigneeName",
        "resolution", "resolutionId"
    )`;

    const rawSql = Prisma.sql`
        UPDATE "ExternalTask"
        SET 
            "title" = task."title",
            "externalId" = task."externalId",
            "externalKey" = task."key",
            "type" = task."type",
            "typeIconUrl" = task."typeIcon",
            "typeId" = task."typeId",
            "state" = task."state",
            "stateId" = task."stateId",
            "stateColor" = task."stateColor",
            "stateIconUrl" = task."stateIcon",
            "stateCategoryId" = cast(task."stateCategoryId" as int),
            "stateCategoryName" = task."stateCategoryName",
            "project" = task."project",
            "projectId" = task."projectKey",
            "ownerName" = task."ownerName",
            "ownerEmail" = task."ownerEmail",
            "ownerId" = task."ownerKey",
            "creatorName" = task."creatorName",
            "creatorEmail" = task."creatorEmail",
            "creatorId" = task."creatorKey",
            "assigneeName" = task."assigneeName",
            "assigneeEmail" = task."assigneeEmail",
            "assigneeId" = task."assigneeKey",
            "resolution" = task."resolution",
            "resolutionId" = task."resolutionId"
        FROM ${valuesToUpdate}
        WHERE "ExternalTask"."externalKey" = task."key"
        RETURNING *
    `;

    return prisma.$queryRaw`${rawSql}` as unknown as Promise<ExternalTask[]>;
};

export const externalTasksJob = async (criteriaId: string) => {
    const sheepActivityId = await getSheepOrThrow();

    const actualCriteria = await prisma.goalAchieveCriteria.findUniqueOrThrow({
        where: { id: criteriaId },
        select: {
            id: true,
            goalId: true,
        },
    });

    const recalcScore = recalculateCriteriaScore(actualCriteria.goalId).makeChain(
        'recalcCurrentGoalScore',
        'recalcLinkedGoalsScores',
        'recalcAverageProjectScore',
    );

    await prisma
        .$transaction(async (ctx) => {
            await Promise.all([
                ctx.goalAchieveCriteria.update({
                    where: { id: criteriaId },
                    data: {
                        isDone: true,
                    },
                }),
                ctx.goalHistory.create({
                    data: {
                        goalId: actualCriteria.goalId,
                        subject: 'criteria',
                        action: 'complete',
                        previousValue: null,
                        nextValue: criteriaId,
                        activityId: sheepActivityId,
                    },
                }),
            ]);
        })
        .then(() => recalcScore.run());
};

const updateMinInterval = 300;
const tasksPeriod = 1000 * 60; // every minute

export const externalTaskCheckJob = async () => {
    const atYesterday = new Date();
    atYesterday.setDate(atYesterday.getDate() - 1);

    // getting all criteria which updated at last week or earlier
    const criteriaListPromise = getCriteriaWithTasks(atYesterday);
    const notCompetedJobsPromise = prisma.job.findMany({
        where: {
            kind: jobKind.criteriaToUpdate,
            state: jobState.scheduled,
        },
    });

    const [criteriaList, jobs] = await Promise.all([criteriaListPromise, notCompetedJobsPromise]);

    if (!criteriaList.length) {
        return;
    }

    const externalTaskKeys = criteriaList.reduce((acc, c) => {
        if (c.externalTask != null) {
            acc.add(c.externalTask.externalKey);
        }

        return acc;
    }, new Set<string>());

    const externalTasks = await getResolvedJiraTasks(Array.from(externalTaskKeys));

    if (!externalTasks?.length) {
        return;
    }

    const updatedTasks = await updateExternalTasks(externalTasks);

    const updatedExternalTaskKeys = updatedTasks.reduce<Record<string, true>>((acc, { id }) => {
        acc[id] = true;
        return acc;
    }, {});

    const criteriaIdsToUpdate = criteriaList.filter(({ externalTask }) => {
        if (externalTask) {
            return externalTask.id in updatedExternalTaskKeys;
        }

        return false;
    });

    const interval = Math.max(Math.floor(tasksPeriod / criteriaList.length), updateMinInterval);

    const plannedCriteriaIds = jobs.reduce((acc, { data }) => {
        if (castJobData(jobKind.criteriaToUpdate, data)) {
            acc.add(data.id);
        }
        return acc;
    }, new Set<string>());

    criteriaIdsToUpdate.forEach(async ({ id }, index) => {
        if (!plannedCriteriaIds.has(id)) {
            await createCriteriaToUpdate({ id }, index * interval);
        }
    });
};

export const makeCriteriaQueue = async () => {
    const currentJob = await prisma.job.findFirst({
        where: {
            kind: 'makeCriteriaQueue',
        },
    });

    const exstingQueueJob = await prisma.job.findFirst({
        where: {
            kind: jobKind.criteriaListToUpdate,
            state: jobState.scheduled,
        },
    });

    assert(currentJob, 'Job doesnt exists');
    assert(jiraService.config.finishedCategory, 'Jira config is undefined');

    const atYesterday = new Date();
    atYesterday.setDate(atYesterday.getDate() - 1);

    // get all incompleted exterla tasks
    const incompletedTasks = await prisma.externalTask.findMany({
        where: {
            createdAt: {
                lte: atYesterday,
            },
            stateCategoryId: {
                not: jiraService.config.finishedCategory.id,
            },
            criteria: { some: { externalTaskId: { not: null } } },
        },
        select: {
            id: true,
            externalKey: true,
            criteria: {
                select: { id: true },
            },
        },
    });

    // check tasks status outside
    const tasksToUpdate = await getResolvedJiraTasks(incompletedTasks.map(({ externalKey }) => externalKey));

    if (tasksToUpdate == null || tasksToUpdate.length === 0) {
        return;
    }

    const updatedTasks = await updateExternalTasks(tasksToUpdate);

    if (updatedTasks.length === 0) {
        return;
    }

    // pick criteria to update by completedTasks
    const updatedkeys = new Set(updatedTasks.map(({ externalKey }) => externalKey));

    const toUpdateCriteriaByTasks = incompletedTasks
        .filter(({ externalKey }) => updatedkeys.has(externalKey))
        .reduce((set, current) => {
            for (const { id } of current.criteria) {
                set.add(id);
            }
            return set;
        }, new Set<string>());

    if (exstingQueueJob == null) {
        await createCriteriaListToUpdate({ ids: Array.from(toUpdateCriteriaByTasks) });

        return;
    }

    const jobData = safelyParseJson<JobDataMap['criteriaListToUpdate']>(String(exstingQueueJob.data)) ?? { ids: [] };

    prisma.job.update({
        where: { id: exstingQueueJob.id },
        data: {
            state: jobState.scheduled,
            data: { ids: jobData.ids.concat(Array.from(toUpdateCriteriaByTasks)) },
        },
    });
};

export const shiftCriteriaFromQueue = async ([current, ...queue]: string[]) => {
    if (!current) return;

    const sheep = await getSheepOrThrow();

    const currentCriteria = await prisma.goalAchieveCriteria.findUnique({
        where: { id: current },
        select: {
            id: true,
            goalId: true,
            externalTaskId: true,
        },
    });

    assert(currentCriteria, 'Criteria doesnt exist');
    assert(currentCriteria.externalTaskId, 'This criteria without linked external task');

    const externalTask = await prisma.externalTask.findUnique({
        where: { id: currentCriteria.externalTaskId },
    });

    assert(externalTask, 'This criteria without linked external task');

    const isTaskComplete = jiraService.checkCompletedStatus({
        statusName: externalTask.state,
        statusCategory: externalTask.stateCategoryId,
        resolutionName: externalTask.resolution,
    });

    assert(!isTaskComplete, 'External task have complete status');

    await prisma.goalAchieveCriteria.update({
        where: { id: currentCriteria.id },
        data: { isDone: true },
    });

    await prisma.goalHistory.create({
        data: {
            goalId: currentCriteria.goalId,
            subject: 'criteria',
            action: 'complete',
            previousValue: null,
            nextValue: current,
            activityId: sheep,
        },
    });

    await recalculateCriteriaScore(currentCriteria.goalId)
        .recalcCurrentGoalScore()
        .recalcLinkedGoalsScores()
        .recalcAverageProjectScore()
        .run();

    if (queue.length) {
        prisma.job.create({
            data: {
                kind: jobKind.criteriaListToUpdate,
                state: jobState.scheduled,
                data: {
                    ids: queue,
                },
            },
        });
    }
};
