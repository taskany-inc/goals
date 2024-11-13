import { z } from 'zod';
import { Role } from '@prisma/client';
import { TRPCError } from '@trpc/server';

import { router, protectedProcedure } from '../trpcBackend';
import { projectsChildrenIdsSchema, projectSuggestionsSchema, userProjectsSchema } from '../../src/schema/project';
import {
    getProjectsByIds,
    getStarredProjectsIds,
    getProjectSuggestions,
    getUserProjectsQuery,
    getUserDashboardProjects,
    getWholeGoalCountByProjectIds,
    getDeepChildrenProjectsId,
    getAllProjectsQuery,
    getProjectChildrenTreeQuery,
    getProjectById,
    getChildrenProjectByParentProjectId,
} from '../queries/projectV2';
import { queryWithFiltersSchema, sortableProjectsPropertiesArraySchema } from '../../src/schema/common';
import {
    Project,
    User,
    Goal,
    Tag,
    State,
    GoalAchieveCriteria,
    Ghost,
    Activity,
    Priority,
    Team,
} from '../../generated/kysely/types';
import { ExtractTypeFromGenerated, pickUniqueValues } from '../utils';
import { baseCalcCriteriaWeight } from '../../src/utils/recalculateCriteriaScore';
import { getGoalsQuery } from '../queries/goalV2';
import { projectAccessMiddleware } from '../access/accessMiddlewares';
import { getAccessUsersByProjectId } from '../queries/activity';
import { recalculateGoalRanksIfNeeded } from '../queries/ranking';

type ProjectActivity = ExtractTypeFromGenerated<Activity> & {
    user: ExtractTypeFromGenerated<User> | null;
    ghost: ExtractTypeFromGenerated<Ghost> | null;
};

type ProjectResponse = ExtractTypeFromGenerated<Project> & {
    _isWatching: boolean;
    _isStarred: boolean;
    _isOwner: boolean;
    _isEditable: boolean;
    _isGoalWatching: boolean;
    _isGoalStarred: boolean;
    _onlySubsGoals: boolean;
    activity: ProjectActivity;
    participants: ProjectActivity[] | null;
    goals?: any[]; // this prop is overrides below
    children: ExtractTypeFromGenerated<Project>[] | null;
};

interface DashboardProject extends Pick<ProjectResponse, 'id'> {
    partnerProjectIds?: string[];
    _count: {
        children: number;
        stargizers: number;
        watchers: number;
        participants: number;
        goals: number;
    };
}

type ProjectGoal = ExtractTypeFromGenerated<Goal> & {
    _shortId: string;
    participants: ProjectActivity[];
    tags: ExtractTypeFromGenerated<Tag>[];
    owner: ProjectActivity;
    _achivedCriteriaWeight: number | null;
    state: ExtractTypeFromGenerated<State>;
    priority: ExtractTypeFromGenerated<Priority>;
    project: ExtractTypeFromGenerated<Project> & { parent: ExtractTypeFromGenerated<Project>[] };
    partnershipProjects: Array<ExtractTypeFromGenerated<Project>>;
    criteria?: Array<
        ExtractTypeFromGenerated<
            GoalAchieveCriteria & {
                criteriaGoal: ExtractTypeFromGenerated<Goal> & { state: ExtractTypeFromGenerated<State> | null };
            }
        >
    >;
    _count: {
        comments: number;
        stargizers: number;
        watchers: number;
        participants: number;
    };
    _isWatching: boolean;
    _isStarred: boolean;
    _isOwner: boolean;
    _isEditable: boolean;
    _isIssuer: boolean;
    _isParticipant: boolean;
    _isParentParticipant: boolean;
    _isParentOwner: boolean;
    _hasAchievementCriteria: boolean;
};

export interface ProjectTree {
    [key: string]: {
        project: (ProjectResponse & Pick<DashboardProject, '_count'>) | null;
        count?: number;
        children: ProjectTree | null;
    };
}

export interface ProjectTreeRow {
    id: string;
    title: string;
    goal_count: number;
    chain: string[];
    deep: number;
}

type ProjectById = Omit<ProjectResponse, 'goals'> &
    Pick<DashboardProject, '_count'> & {
        parent: Array<{ id: string; title: string }>;
        accessUsers: Array<ProjectActivity>;
        teams: Array<Team> | null;
        children?: Array<{ id: string; title: string }>;
    };

export const project = router({
    suggestions: protectedProcedure
        .input(projectSuggestionsSchema)
        .query(async ({ input: { query, take = 5, filter }, ctx }) => {
            const { activityId, role } = ctx.session.user;

            try {
                const sql = getProjectSuggestions({
                    role,
                    query,
                    filter,
                    limit: take,
                    activityId,
                });

                const res = await sql.execute();

                return res;
            } catch (error) {
                console.error(error);

                return Promise.reject(error);
            }
        }),
    userProjects: protectedProcedure.input(userProjectsSchema).query(async ({ ctx, input: { take, filter } }) => {
        const { activityId, role } = ctx.session.user;
        try {
            const query = getUserProjectsQuery({
                activityId,
                role,
                limit: take,
                filter,
            });

            const res = await query.$castTo<ProjectResponse>().execute();

            return res;
        } catch (error) {
            console.error(error);

            return Promise.reject();
        }
    }),

    starred: protectedProcedure.query(async ({ ctx }) => {
        const { activityId, role } = ctx.session.user;
        try {
            const projectIds = await getStarredProjectsIds(activityId).execute();

            if (!projectIds?.length) {
                return [];
            }

            return getProjectsByIds({ activityId, in: projectIds, role })
                .$castTo<ProjectResponse & Pick<DashboardProject, '_count'>>()
                .execute();
        } catch (e) {
            console.log(e);
        }
    }),

    deepChildrenIds: protectedProcedure.input(projectsChildrenIdsSchema).query(async ({ input }) => {
        return getDeepChildrenProjectsId(input).execute();
    }),

    getUserDashboardProjects: protectedProcedure
        .input(
            z.object({
                limit: z.number().optional(),
                goalsQuery: queryWithFiltersSchema.optional(),
                cursor: z.number().optional(),
                projectsSort: sortableProjectsPropertiesArraySchema.optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const { limit = 5, cursor: offset = 0, goalsQuery, projectsSort } = input;
            const {
                session: { user },
            } = ctx;

            const dashboardProjects = await getUserDashboardProjects({
                ...user,
                goalsQuery,
                projectsSort,
                limit: limit + 1,
                offset,
            })
                .$castTo<DashboardProject>()
                .execute();

            const projectIds = dashboardProjects.map(({ id }) => ({ id }));

            const [extendedProjects, goalsCountsByProjects] = await Promise.all([
                getProjectsByIds({
                    ...user,
                    in: projectIds,
                })
                    .$castTo<ProjectResponse>()
                    .execute(),
                getWholeGoalCountByProjectIds({ in: projectIds }).execute(),
            ]);

            const projectsExtendedDataMap = new Map(extendedProjects.map((project) => [project.id, project]));

            const resultProjects: (ProjectResponse & Pick<DashboardProject, '_count' | 'partnerProjectIds'>)[] = [];

            for (const { id, _count, partnerProjectIds } of dashboardProjects.slice(0, limit)) {
                const currentProject = projectsExtendedDataMap.get(id) as
                    | (ProjectResponse & Pick<DashboardProject, '_count' | 'partnerProjectIds'>)
                    | undefined;

                if (currentProject == null) {
                    throw new Error(`Missing project by id: ${id}`);
                }

                const { _isEditable, _isGoalStarred, _isGoalWatching, _isOwner, _isStarred, _isWatching, ...project } =
                    currentProject;

                const flags = {
                    _isEditable,
                    _isOwner,
                    _isStarred,
                    _isWatching,
                    _isGoalStarred,
                    _isGoalWatching,
                    _onlySubsGoals:
                        !(_isEditable || _isOwner || _isStarred || _isWatching) && (_isGoalStarred || _isGoalWatching),
                };

                resultProjects.push({ ...project, ...flags, _count, partnerProjectIds });
            }

            return {
                groups: resultProjects,
                pagination: {
                    limit,
                    offset: dashboardProjects.length < limit + 1 ? undefined : offset + (limit ?? 0),
                },
                totalGoalsCount: (goalsCountsByProjects || []).reduce(
                    (acc, count) => acc + (count?.wholeGoalsCount ?? 0),
                    0,
                ),
            };
        }),

    getAll: protectedProcedure
        .input(
            z.object({
                limit: z.number().optional(),
                goalsQuery: queryWithFiltersSchema.optional(),
                projectsSort: sortableProjectsPropertiesArraySchema.optional(),
                firstLevel: z.boolean(),
                cursor: z.number().optional(),
            }),
        )
        .query(async ({ input, ctx }) => {
            const { limit = 20, cursor = 0, goalsQuery, projectsSort, firstLevel: _ = true } = input;

            const projects = await getAllProjectsQuery({
                ...ctx.session.user,
                firstLevel: goalsQuery?.project == null,
                limit: limit + 1,
                cursor,
                ids: goalsQuery?.project,
                projectsSort,
            })
                .$castTo<Omit<ProjectResponse, 'children'> & Pick<DashboardProject, '_count'>>()
                .execute();

            return {
                projects: projects.slice(0, limit),
                pagination: {
                    limit,
                    offset: projects.length < limit + 1 ? undefined : cursor + (limit ?? 0),
                },
            };
        }),

    getProjectChildrenTree: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                goalsQuery: queryWithFiltersSchema.optional(),
            }),
        )
        .query(
            async ({
                input,
                ctx: {
                    session: { user },
                },
            }) => {
                const rows = await getProjectChildrenTreeQuery(input).$castTo<ProjectTreeRow>().execute();
                const projects = await getProjectsByIds({
                    in: rows.map(({ id }) => ({ id })),
                    ...user,
                })
                    .$if(user.role === Role.USER, (qb) =>
                        qb.where(({ or, eb, not, exists }) =>
                            or([
                                eb('Project.id', 'in', ({ selectFrom }) =>
                                    selectFrom('_projectAccess').select('B').where('A', '=', user.activityId),
                                ),
                                not(
                                    exists(({ selectFrom }) =>
                                        selectFrom('_projectAccess').select('B').whereRef('B', '=', 'Project.id'),
                                    ),
                                ),
                            ]),
                        ),
                    )
                    .$castTo<ProjectResponse & Pick<DashboardProject, '_count'>>()
                    .execute();

                const projectMap = new Map<string, ProjectTree[string]['project']>(
                    projects.map((project) => [project.id, project]),
                );

                const map: ProjectTree = {};

                rows.forEach(({ id, chain, goal_count: count, deep }) => {
                    const path = Array.from(chain);

                    path.reduce((acc, key, i) => {
                        if (!acc[key]) {
                            acc[key] = {
                                project: projectMap.get(key) || null,
                                children: {
                                    [id]: {
                                        project: projectMap.get(id) || null,
                                        count,
                                        children: null,
                                    },
                                },
                            };
                        } else if (i + 1 === deep) {
                            acc[key].children = {
                                ...acc[key].children,
                                [id]: {
                                    project: projectMap.get(id) || null,
                                    count,
                                    children: null,
                                },
                            };
                        }

                        return acc[key].children as ProjectTree;
                    }, map);
                });

                return map;
            },
        ),

    getById: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                includeChildren: z.boolean().optional(),
                goalsQuery: queryWithFiltersSchema.optional(),
            }),
        )
        .use(projectAccessMiddleware)
        .query(async ({ input, ctx }) => {
            const { id } = input;

            const [project, accessUsers, children = null] = await Promise.all([
                getProjectById({
                    ...ctx.session.user,
                    id,
                })
                    .$castTo<ProjectById>()
                    .executeTakeFirst(),
                getAccessUsersByProjectId({ projectId: id }).execute(),
                input.includeChildren ? getChildrenProjectByParentProjectId({ id }).execute() : Promise.resolve(null),
            ]);

            if (project == null) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return {
                ...project,
                ...(children != null ? { children } : undefined),
                parent: pickUniqueValues(project.parent, 'id'),
                participants: pickUniqueValues(project.participants, 'id'),
                accessUsers,
            };
        }),

    getProjectGoalsById: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                isOnlySubsGoals: z.boolean().optional(),
                limit: z.number().optional(),
                cursor: z.number().optional(),
                goalsQuery: queryWithFiltersSchema.optional(),
            }),
        )
        .query(async ({ input, ctx }) => {
            const { limit = 10, cursor: offset = 0, goalsQuery, id, isOnlySubsGoals } = input;
            if (input.goalsQuery?.sort?.some(({ key }) => key === 'rank')) {
                await recalculateGoalRanksIfNeeded(id, ctx.session.user.activityId);
            }
            const goalsByProjectQuery = getGoalsQuery({
                ...ctx.session.user,
                isOnlySubsGoals,
                projectId: id,
                limit: limit + 1,
                offset,
                goalsQuery,
            });

            const goals = await goalsByProjectQuery.$castTo<ProjectGoal>().execute();

            for (const goal of goals) {
                goal._achivedCriteriaWeight = goal.completedCriteriaWeight;

                if (goal.criteria != null) {
                    const uniqCriteria = pickUniqueValues(goal.criteria, 'id') as NonNullable<ProjectGoal['criteria']>;
                    goal._achivedCriteriaWeight = baseCalcCriteriaWeight(uniqCriteria);
                    goal.criteria = uniqCriteria;
                }
            }

            return {
                goals: goals.slice(0, limit),
                pagination: {
                    limit,
                    offset: goals.length < limit + 1 ? undefined : offset + (limit ?? 0),
                },
            };
        }),
});
