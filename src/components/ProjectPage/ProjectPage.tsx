import { MouseEventHandler, useCallback, useEffect } from 'react';
import { ListView, nullable } from '@taskany/bricks';

import { Page } from '../Page/Page';
import { GoalByIdReturnType } from '../../../trpc/inferredTypes';
import { refreshInterval } from '../../utils/config';
import { ExternalPageProps } from '../../utils/declareSsrProps';
import { useUrlFilterParams } from '../../hooks/useUrlFilterParams';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useWillUnmount } from '../../hooks/useWillUnmount';
import { trpc } from '../../utils/trpcClient';
import { useFiltersPreset } from '../../hooks/useFiltersPreset';
import { ProjectListItemConnected } from '../ProjectListItemConnected';
import { PageTitlePreset } from '../PageTitlePreset/PageTitlePreset';
import { useGoalPreview } from '../GoalPreview/GoalPreviewProvider';
import { CommonHeader } from '../CommonHeader';
import { useProjectResource } from '../../hooks/useProjectResource';
import { WatchButton } from '../WatchButton/WatchButton';
import { StarButton } from '../StarButton/StarButton';
import { ProjectPageTabs } from '../ProjectPageTabs/ProjectPageTabs';
import { safeGetUserName } from '../../utils/getUserName';
import { FilteredPage } from '../FilteredPage/FilteredPage';
import { IssueParent } from '../IssueParent';

import { tr } from './ProjectPage.i18n';

export const projectsSize = 20;

export const ProjectPage = ({ user, ssrTime, params: { id }, defaultPresetFallback }: ExternalPageProps) => {
    const [, setCurrentProjectCache] = useLocalStorage('currentProjectCache', null);

    const utils = trpc.useContext();

    const { preset, shadowPreset, userFilters } = useFiltersPreset({ defaultPresetFallback });

    const { currentPreset, queryState, setTagsFilterOutside, setPreset } = useUrlFilterParams({
        preset,
    });

    const { data: project } = trpc.project.getById.useQuery(
        {
            id,
            goalsQuery: queryState,
        },
        { enabled: Boolean(id) },
    );

    const { data: projectDeepInfo, isLoading: isLoadingDeepInfoProject } = trpc.project.getDeepInfo.useQuery(
        {
            id,
            goalsQuery: queryState,
        },
        {
            keepPreviousData: true,
            staleTime: refreshInterval,
            enabled: Boolean(id),
        },
    );

    const { setPreview, on } = useGoalPreview();

    useEffect(() => {
        const unsubUpdate = on('on:goal:update', () => {
            utils.project.getById.invalidate();
            utils.project.getDeepInfo.invalidate();
        });
        const unsubDelete = on('on:goal:delete', () => {
            utils.project.getById.invalidate();
            utils.project.getDeepInfo.invalidate();
        });

        return () => {
            unsubUpdate();
            unsubDelete();
        };
    }, [on, utils.project.getDeepInfo, utils.project.getById]);

    const onGoalPreviewShow = useCallback(
        (goal: Parameters<typeof setPreview>[1]): MouseEventHandler<HTMLAnchorElement> =>
            (e) => {
                if (e.metaKey || e.ctrlKey || !goal?._shortId) return;

                e.preventDefault();
                setPreview(goal._shortId, goal);
            },
        [setPreview],
    );

    useEffect(() => {
        if (!project || project.personal) return;

        setCurrentProjectCache({
            id: project.id,
            title: project.title,
            description: project.description ?? undefined,
            flowId: project.flowId,
        });
    }, [project, setCurrentProjectCache]);

    useWillUnmount(() => {
        setCurrentProjectCache(null);
    });

    const onFilterStar = useCallback(async () => {
        await utils.filter.getById.invalidate();
    }, [utils]);

    const title = (
        <PageTitlePreset
            activityId={user.activityId}
            currentPresetActivityId={currentPreset?.activityId}
            currentPresetActivityUserName={safeGetUserName(currentPreset?.activity)}
            currentPresetTitle={currentPreset?.title}
            shadowPresetActivityId={shadowPreset?.activityId}
            shadowPresetActivityUserName={safeGetUserName(shadowPreset?.activity)}
            shadowPresetId={shadowPreset?.id}
            shadowPresetTitle={shadowPreset?.title}
            title={project?.title || tr('Projects')}
            setPreset={setPreset}
        />
    );
    const description = currentPreset && currentPreset.description ? currentPreset.description : project?.description;

    const { toggleProjectWatching, toggleProjectStar } = useProjectResource(id);

    const handleItemEnter = useCallback(
        (goal: NonNullable<GoalByIdReturnType>) => {
            setPreview(goal._shortId, goal);
        },
        [setPreview],
    );

    return (
        <Page
            user={user}
            ssrTime={ssrTime}
            title={tr
                .raw('title', {
                    project: project?.title,
                })
                .join('')}
        >
            <CommonHeader
                title={title}
                description={description}
                preTitle={nullable(project?.parent, (parent) => (
                    <IssueParent parent={parent} mode="compact" />
                ))}
                actions={nullable(id, () => (
                    <>
                        <WatchButton watcher={project?._isWatching} onToggle={toggleProjectWatching} />
                        <StarButton
                            stargizer={project?._isStarred}
                            count={project?._count.stargizers}
                            onToggle={toggleProjectStar}
                        />
                    </>
                ))}
            >
                <ProjectPageTabs id={id} editable={project?._isEditable} />
            </CommonHeader>
            <FilteredPage
                total={projectDeepInfo?.meta?.count}
                counter={projectDeepInfo?.goals?.length}
                filterPreset={currentPreset}
                userFilters={userFilters}
                onFilterStar={onFilterStar}
                isLoading={isLoadingDeepInfoProject}
            >
                <ListView onKeyboardClick={handleItemEnter}>
                    {nullable(project, (p) => (
                        <ProjectListItemConnected
                            key={p.id}
                            visible
                            project={p}
                            onTagClick={setTagsFilterOutside}
                            onClickProvider={onGoalPreviewShow}
                            queryState={queryState}
                        />
                    ))}
                </ListView>
            </FilteredPage>
        </Page>
    );
};
