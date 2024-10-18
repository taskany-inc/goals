import { sql } from 'kysely';

import { Activity as ActivityDTO, User, Ghost } from '../../generated/kysely/types';
import { db } from '../connection/kysely';
import { ExtractTypeFromGenerated } from '../utils';

export interface Activity extends ExtractTypeFromGenerated<ActivityDTO> {
    user: ExtractTypeFromGenerated<User>;
    ghost: ExtractTypeFromGenerated<Ghost> | null;
}

export const getUserActivity = () => {
    return db
        .selectFrom('Activity')
        .innerJoin('User', 'User.activityId', 'Activity.id')
        .leftJoin('Ghost', 'Ghost.id', 'Activity.ghostId')
        .selectAll('Activity')
        .select([sql`"User"`.as('user'), sql`"Ghost"`.as('ghost')])
        .$castTo<Activity>();
};

export const getAccessUsersByProjectId = ({ projectId }: { projectId: string }) => {
    return db
        .selectFrom('_projectAccess')
        .innerJoinLateral(
            () => getUserActivity().as('activity'),
            (join) => join.onRef('activity.id', '=', '_projectAccess.A'),
        )
        .selectAll('activity')
        .where('_projectAccess.B', '=', projectId);
};
