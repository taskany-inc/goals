/* eslint-disable react-hooks/rules-of-hooks */
import React, { MouseEventHandler, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { nullable, Button } from '@taskany/bricks';
import { gapSm } from '@taskany/colors';
import { IconPlusCircleOutline } from '@taskany/icons';

import { refreshInterval } from '../../utils/config';
import { ExternalPageProps } from '../../utils/declareSsrProps';
import { ModalEvent, dispatchModalEvent } from '../../utils/dispatchModal';
import { createFilterKeys } from '../../utils/hotkeys';
import { useUrlFilterParams } from '../../hooks/useUrlFilterParams';
import { useFilterResource } from '../../hooks/useFilterResource';
import { routes } from '../../hooks/router';
import { Page, PageContent } from '../Page';
import { CommonHeader } from '../CommonHeader';
import { FiltersPanel } from '../FiltersPanel/FiltersPanel';
import { GoalsGroup } from '../GoalsGroup';
import { GoalsListContainer } from '../GoalListItem';
import { Nullish } from '../../types/void';
import { trpc } from '../../utils/trpcClient';
import { FilterById, GoalByIdReturnType } from '../../../trpc/inferredTypes';
import { ProjectListContainer, ProjectListItem } from '../ProjectListItem';
import { PageTitlePreset } from '../PageTitlePreset/PageTitlePreset';
import { useGoalPreview } from '../GoalPreview/GoalPreviewProvider';
import { InlineTrigger } from '../InlineTrigger';

import { tr } from './DashboardPage.i18n';

const ModalOnEvent = dynamic(() => import('../ModalOnEvent'));
const FilterCreateForm = dynamic(() => import('../FilterCreateForm/FilterCreateForm'));
const FilterDeleteForm = dynamic(() => import('../FilterDeleteForm/FilterDeleteForm'));

const StyledInlineTriggerWrapper = styled.div`
    padding-left: ${gapSm};
`;

export const DashboardPage = ({ user, ssrTime }: ExternalPageProps) => {
    const router = useRouter();
    const { toggleFilterStar } = useFilterResource();

    const utils = trpc.useContext();

    const presetData = trpc.filter.getById.useQuery(router.query.filter as string, { enabled: !!router.query.filter });

    const {
        currentPreset,
        queryState,
        queryString,
        setPriorityFilter,
        setStateFilter,
        setTagsFilter,
        setTagsFilterOutside,
        setEstimateFilter,
        setIssuerFilter,
        setOwnerFilter,
        setParticipantFilter,
        setProjectFilter,
        setStarredFilter,
        setWatchingFilter,
        setSortFilter,
        setFulltextFilter,
        resetQueryState,
        setPreset,
    } = useUrlFilterParams({
        preset: presetData?.data,
    });

    const { data, isLoading } = trpc.project.getUserProjectsWithGoals.useQuery(queryState, {
        keepPreviousData: true,
        staleTime: refreshInterval,
    });

    const userFilters = trpc.filter.getUserFilters.useQuery();
    const shadowPreset = userFilters.data?.filter((f) => f.params === queryString)[0];

    const groups = data?.groups;
    const goals = groups?.flatMap((group) => group.goals);

    const { setPreview, preview } = useGoalPreview();

    useEffect(() => {
        const isGoalDeletedAlready = preview && !goals?.some((g) => g.id === preview.id);

        if (isGoalDeletedAlready) setPreview(null);
    }, [goals, preview, setPreview]);

    const onGoalPrewiewShow = useCallback(
        (goal: GoalByIdReturnType): MouseEventHandler<HTMLAnchorElement> =>
            (e) => {
                if (e.metaKey || e.ctrlKey || !goal?._shortId) return;

                e.preventDefault();
                setPreview(goal._shortId, goal);
            },
        [setPreview],
    );

    const selectedGoalResolver = useCallback((id: string) => id === preview?.id, [preview]);

    const onFilterStar = useCallback(async () => {
        if (currentPreset) {
            if (currentPreset._isOwner) {
                dispatchModalEvent(ModalEvent.FilterDeleteModal)();
            } else {
                await toggleFilterStar({
                    id: currentPreset.id,
                    direction: !currentPreset._isStarred,
                });
                await utils.filter.getById.invalidate();
            }
        } else {
            dispatchModalEvent(ModalEvent.FilterCreateModal)();
        }
    }, [currentPreset, toggleFilterStar, utils]);

    const onFilterCreated = useCallback(
        (data: Nullish<FilterById>) => {
            dispatchModalEvent(ModalEvent.FilterCreateModal)();
            setPreset(data.id);
        },
        [setPreset],
    );

    const onFilterDeleteCanceled = useCallback(() => {
        dispatchModalEvent(ModalEvent.FilterDeleteModal)();
    }, []);

    const onFilterDeleted = useCallback(
        (filter: FilterById) => {
            router.push(`${router.route}?${filter.params}`);
        },
        [router],
    );

    const title = (
        <PageTitlePreset
            activityId={user.activityId}
            currentPresetActivityId={currentPreset?.activityId}
            currentPresetActivityUserName={currentPreset?.activity.user?.name}
            currentPresetTitle={currentPreset?.title}
            shadowPresetActivityId={shadowPreset?.activityId}
            shadowPresetActivityUserName={shadowPreset?.activity.user?.name}
            shadowPresetId={shadowPreset?.id}
            shadowPresetTitle={shadowPreset?.title}
            title={tr('Dashboard')}
            setPreset={setPreset}
        />
    );

    const description =
        currentPreset && currentPreset.description
            ? currentPreset.description
            : tr('This is your personal goals bundle');

    return (
        <Page user={user} ssrTime={ssrTime} title={tr('title')}>
            <CommonHeader title={title} description={description} />

            <FiltersPanel
                loading={isLoading}
                total={data?.totalGoalsCount}
                counter={goals?.length}
                queryState={queryState}
                queryString={queryString}
                preset={currentPreset}
                presets={userFilters.data}
                onSearchChange={setFulltextFilter}
                onIssuerChange={setIssuerFilter}
                onOwnerChange={setOwnerFilter}
                onParticipantChange={setParticipantFilter}
                onProjectChange={setProjectFilter}
                onStateChange={setStateFilter}
                onTagChange={setTagsFilter}
                onEstimateChange={setEstimateFilter}
                onPriorityChange={setPriorityFilter}
                onStarredChange={setStarredFilter}
                onWatchingChange={setWatchingFilter}
                onPresetChange={setPreset}
                onFilterStar={onFilterStar}
                onSortChange={setSortFilter}
            >
                {Boolean(queryString) && <Button text={tr('Reset')} onClick={resetQueryState} />}
            </FiltersPanel>

            <PageContent>
                <GoalsListContainer>
                    {groups?.map(
                        (group) =>
                            (queryString ? Boolean(group.goals.length) : true) && (
                                <React.Fragment key={group.project.id}>
                                    <GoalsGroup
                                        goals={group.goals as NonNullable<GoalByIdReturnType>[]}
                                        selectedResolver={selectedGoalResolver}
                                        onClickProvider={onGoalPrewiewShow}
                                        onTagClick={setTagsFilterOutside}
                                    >
                                        <ProjectListContainer>
                                            <NextLink href={routes.project(group.project.id)} passHref legacyBehavior>
                                                <ProjectListItem
                                                    key={group.project.id}
                                                    as="a"
                                                    title={group.project.title}
                                                    owner={group.project?.activity}
                                                    participants={group.project?.participants}
                                                    starred={group.project?._isStarred}
                                                    watching={group.project?._isWatching}
                                                    averageScore={group.project?.averageScore}
                                                />
                                            </NextLink>
                                        </ProjectListContainer>
                                    </GoalsGroup>

                                    {!group.goals.length && (
                                        <StyledInlineTriggerWrapper>
                                            <InlineTrigger
                                                text={tr('Create goal')}
                                                onClick={dispatchModalEvent(ModalEvent.GoalCreateModal, {
                                                    id: group.project.id,
                                                })}
                                                icon={<IconPlusCircleOutline noWrap size="s" />}
                                            />
                                        </StyledInlineTriggerWrapper>
                                    )}
                                </React.Fragment>
                            ),
                    )}
                </GoalsListContainer>
            </PageContent>

            {nullable(queryString, (params) => (
                <ModalOnEvent event={ModalEvent.FilterCreateModal} hotkeys={createFilterKeys}>
                    <FilterCreateForm mode="User" params={params} onSubmit={onFilterCreated} />
                </ModalOnEvent>
            ))}

            {nullable(currentPreset, (cP) => (
                <ModalOnEvent view="warn" event={ModalEvent.FilterDeleteModal}>
                    <FilterDeleteForm preset={cP} onSubmit={onFilterDeleted} onCancel={onFilterDeleteCanceled} />
                </ModalOnEvent>
            ))}
        </Page>
    );
};
