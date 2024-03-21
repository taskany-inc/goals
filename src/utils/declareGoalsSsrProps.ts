import { QueryState } from '../hooks/useUrlFilterParams';

import { declareSsrProps } from './declareSsrProps';
import { filtersPanelSsrInit } from './filters';

const pageSize = 20;

export const declareGoalsSsrProps = (baseQueryState: Partial<QueryState> = {}) =>
    declareSsrProps(
        async (props) => {
            const { ssrHelpers } = props;
            const { queryState: urlQueryState, defaultPresetFallback } = await filtersPanelSsrInit(props);

            const queryState = {
                ...urlQueryState,
                ...baseQueryState,
            };

            if (queryState.groupBy === 'project') {
                await ssrHelpers.project.getAll.fetchInfinite({
                    limit: pageSize,
                    goalsQuery: queryState,
                    firstLevel: !!queryState.project?.length,
                });
            } else {
                await ssrHelpers.goal.getBatch.fetchInfinite({
                    limit: pageSize,
                    query: queryState,
                });
            }

            await ssrHelpers.goal.getGoalsCount.fetch({
                query: queryState,
            });

            return {
                defaultPresetFallback,
                baseQueryState,
            };
        },
        {
            private: true,
        },
    );
