import { useCallback, useEffect, useMemo, useState } from 'react';
import { nullable } from '@taskany/bricks';
import { ListView } from '@taskany/bricks/harmony';

import { useUrlFilterParams } from '../hooks/useUrlFilterParams';
import { trpc } from '../utils/trpcClient';
import { refreshInterval } from '../utils/config';
import { useFMPMetric } from '../utils/telemetry';
import { FilterById, GoalByIdReturnType } from '../../trpc/inferredTypes';

import { GoalTableList } from './GoalTableList/GoalTableList';
import { useGoalPreview } from './GoalPreview/GoalPreviewProvider';
import { LoadMoreButton } from './LoadMoreButton/LoadMoreButton';

interface GoalListProps {
    filterPreset?: FilterById;
}

const pageSize = 20;

export const FlatGoalList: React.FC<GoalListProps> = ({ filterPreset }) => {
    const utils = trpc.useContext();
    const { setPreview, on } = useGoalPreview();
    const { queryState, setTagsFilterOutside } = useUrlFilterParams({
        preset: filterPreset,
    });

    const [, setPage] = useState(0);
    const { data, fetchNextPage, hasNextPage } = trpc.goal.getBatch.useInfiniteQuery(
        {
            limit: pageSize,
            query: queryState,
        },
        {
            getNextPageParam: (p) => p.nextCursor,
            keepPreviousData: true,
            staleTime: refreshInterval,
        },
    );

    useEffect(() => {
        const unsubUpdate = on('on:goal:update', () => {
            utils.goal.getBatch.invalidate();
        });
        const unsubDelete = on('on:goal:delete', () => {
            utils.goal.getBatch.invalidate();
        });

        return () => {
            unsubUpdate();
            unsubDelete();
        };
    }, [on, utils.goal.getBatch]);

    useFMPMetric(!!data);

    const pages = data?.pages;
    const goalsOnScreen = useMemo(() => pages?.flatMap((p) => p.items), [pages]);

    const onFetchNextPage = useCallback(() => {
        fetchNextPage();
        setPage((prev) => prev++);
    }, [fetchNextPage]);

    const handleItemEnter = useCallback(
        (goal: NonNullable<GoalByIdReturnType>) => {
            setPreview(goal._shortId, goal);
        },
        [setPreview],
    );

    return (
        <ListView onKeyboardClick={handleItemEnter}>
            {nullable(goalsOnScreen, (goals) => (
                <GoalTableList goals={goals} onTagClick={setTagsFilterOutside} />
            ))}

            {nullable(hasNextPage, () => (
                <LoadMoreButton onClick={onFetchNextPage} />
            ))}
        </ListView>
    );
};
