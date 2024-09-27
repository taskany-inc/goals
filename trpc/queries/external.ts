import { searchIssue } from '../../src/utils/integration/jira';
import { db } from '../connection/kysely';
import { ExternalTask } from '../../generated/kysely/types';
import { ExtractTypeFromGenerated } from '../utils';

type ExtractedTask = ExtractTypeFromGenerated<ExternalTask>;

export const getExternalTask = (params: { externalTaskId: string }) => {
    return db
        .selectFrom('ExternalTask')
        .selectAll()
        .where(({ eb, or }) => {
            return or([
                eb('ExternalTask.externalId', '=', params.externalTaskId),
                eb('ExternalTask.externalKey', '=', params.externalTaskId),
            ]);
        });
};

export const insertExternalTask = (value: Omit<ExternalTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    return db.insertInto('ExternalTask').values(value).returningAll();
};

export const getOrCreateExternalTask = async ({ id }: { id: string }) => {
    const task = await getExternalTask({ externalTaskId: id }).executeTakeFirst();

    if (task != null) {
        return task;
    }

    const [externalIssue] = await searchIssue({ value: id, limit: 1 });

    const {
        summary: title,
        id: externalId,
        key,
        issuetype,
        status: state,
        project,
        reporter,
        resolution,
    } = externalIssue;

    return insertExternalTask({
        title,
        externalId,
        externalKey: key,
        type: issuetype.name,
        typeIconUrl: issuetype.iconUrl,
        typeId: issuetype.id,
        state: state.name,
        stateId: state.id,
        stateColor: state.statusCategory.colorName,
        stateIconUrl: state.iconUrl,
        stateCategoryId: state.statusCategory.id,
        stateCategoryName: state.statusCategory.name,
        project: project.name,
        projectId: project.key,
        ownerName: reporter.displayName,
        ownerEmail: reporter.emailAddress,
        ownerId: reporter.key,
        resolution: resolution?.name ?? null,
        resolutionId: resolution?.id ?? null,
    }).executeTakeFirstOrThrow();
};

export const updateExternalTask = ({ id, ...data }: Omit<ExtractedTask, 'createdAt' | 'updatedAt'>) =>
    db.updateTable('ExternalTask').set(data).where('ExternalTask.id', '=', id).returningAll();
