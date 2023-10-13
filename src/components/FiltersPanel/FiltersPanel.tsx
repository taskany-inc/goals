import { FC, ReactNode, useCallback, memo, useRef, useState, useEffect, useMemo } from 'react';
import {
    FiltersCounter,
    FiltersCounterContainer,
    FiltersMenuContainer,
    FiltersMenuItem,
    FiltersPanelContainer,
    FiltersPanelContent,
    FiltersSearchContainer,
} from '@taskany/bricks';
import styled from 'styled-components';

import { filtersTakeCount } from '../../utils/filters';
import { FilterQueryState, QueryState, buildURLSearchParams } from '../../hooks/useUrlFilterParams';
import { SearchFilter } from '../SearchFilter';
import { ProjectFilter } from '../ProjectFilter';
import { TagFilter } from '../TagFilter';
import { EstimateFilter } from '../EstimateFilter';
import { UserFilter } from '../UserFilter/UserFilter';
import { PriorityFilter } from '../PriorityFilter';
import { StateFilter } from '../StateFilter';
import { FiltersPanelApplied } from '../FiltersPanelApplied/FiltersPanelApplied';
import { ActivityByIdReturnType } from '../../../trpc/inferredTypes';
import { trpc } from '../../utils/trpcClient';
import { SortFilter } from '../SortFilter/SortFilter';
import { FilterPopup } from '../FilterPopup/FilterPopup';
import { getUserName, prepareUserDataFromActivity } from '../../utils/getUserName';
import { filtersPanel } from '../../utils/domObjects';

import { tr } from './FiltersPanel.i18n';

type Users = React.ComponentProps<typeof UserFilter>['users'];

const StyledFiltersMenuContainer = styled(FiltersMenuContainer)`
    display: flex;
    align-items: center;
`;

function mapUserToView(list: ActivityByIdReturnType[]): Users {
    return list.reduce<Users>((acc, activity) => {
        const data = prepareUserDataFromActivity(activity);
        if (data && data.activityId) {
            acc.push({
                id: data.activityId,
                name: getUserName(data),
                email: data.email,
                image: data.image,
            });
        }

        return acc;
    }, []);
}

const useQueryOptions = {
    keepPreviousData: true,
};

export const FiltersPanel: FC<{
    children?: ReactNode;
    loading?: boolean;
    total?: number;
    counter?: number;
    queryState?: QueryState;
    queryFilterState?: FilterQueryState;
    queryString?: string;
    onSearchChange: (search: string) => void;
    onFilterApply?: (state: Partial<QueryState>) => void;
}> = memo(
    ({ children, loading, total = 0, counter = 0, queryState, queryFilterState, onSearchChange, onFilterApply }) => {
        const filterNodeRef = useRef<HTMLSpanElement>(null);
        const [ownersQuery, setOwnersQuery] = useState('');
        const [issuersQuery, setIssuersQuery] = useState('');
        const [participantsQuery, setParticipantsQuery] = useState('');
        const [projectsQuery, setProjectsQuery] = useState('');
        const [tagsQuery, setTagsQuery] = useState('');
        const [filterVisible, setFilterVisible] = useState(false);
        const [filterQuery, setFilterQuery] = useState<Partial<FilterQueryState> | undefined>(queryFilterState);

        useEffect(() => {
            setFilterQuery(queryState);
        }, [queryState]);

        const { data: owners = [] } = trpc.user.suggestions.useQuery(
            {
                query: ownersQuery,
                include: queryState?.owner,
                take: filtersTakeCount,
            },
            useQueryOptions,
        );

        const { data: issuers = [] } = trpc.user.suggestions.useQuery(
            {
                query: issuersQuery,
                include: queryState?.issuer,
                take: filtersTakeCount,
            },
            useQueryOptions,
        );

        const { data: participants = [] } = trpc.user.suggestions.useQuery(
            {
                query: participantsQuery,
                include: queryState?.participant,
                take: filtersTakeCount,
            },
            useQueryOptions,
        );

        const { data: projects = [] } = trpc.project.suggestions.useQuery(
            {
                query: projectsQuery,
                include: queryState?.project,
                take: filtersTakeCount,
            },
            useQueryOptions,
        );

        const { data: tags = [] } = trpc.tag.suggestions.useQuery(
            {
                query: tagsQuery,
                include: queryState?.tag,
                take: filtersTakeCount,
            },
            useQueryOptions,
        );
        const { data: states = [] } = trpc.state.all.useQuery();
        const { data: priorities = [] } = trpc.priority.getAll.useQuery();

        const setPartialQueryByKey = useCallback(<K extends keyof QueryState>(key: K) => {
            return (value: QueryState[K]) => {
                setFilterQuery((prev) => {
                    return {
                        ...prev,
                        [key]: value,
                    };
                });
            };
        }, []);

        const onApplyClick = useCallback(() => {
            setFilterVisible(false);
            onFilterApply?.({ ...filterQuery });
        }, [filterQuery, onFilterApply]);

        const isFiltersEmpty = useMemo(
            () => !queryFilterState || !Array.from(buildURLSearchParams(queryFilterState)).length,
            [queryFilterState],
        );

        return (
            <>
                <FiltersPanelContainer loading={loading} {...filtersPanel.attr}>
                    <FiltersPanelContent>
                        <FiltersSearchContainer>
                            <SearchFilter
                                placeholder={tr('Search')}
                                defaultValue={queryState?.query}
                                onChange={onSearchChange}
                            />
                        </FiltersSearchContainer>
                        <FiltersCounterContainer>
                            <FiltersCounter total={total} counter={counter} />
                        </FiltersCounterContainer>
                        <StyledFiltersMenuContainer>
                            <FiltersMenuItem
                                ref={filterNodeRef}
                                active={!isFiltersEmpty}
                                onClick={() => setFilterVisible((p) => !p)}
                            >
                                {tr('Filter')}
                            </FiltersMenuItem>

                            {children}
                        </StyledFiltersMenuContainer>
                    </FiltersPanelContent>
                </FiltersPanelContainer>
                <FiltersPanelApplied
                    queryState={queryState}
                    states={states}
                    issuers={mapUserToView(issuers)}
                    owners={mapUserToView(owners)}
                    participants={mapUserToView(participants)}
                    projects={projects}
                    tags={tags}
                />
                <FilterPopup
                    visible={filterVisible}
                    onApplyClick={onApplyClick}
                    filterRef={filterNodeRef}
                    switchVisible={setFilterVisible}
                    activeTab="state"
                >
                    <StateFilter
                        text={tr('State')}
                        value={filterQuery?.state}
                        stateTypes={filterQuery?.stateType}
                        states={states}
                        onStateChange={setPartialQueryByKey('state')}
                        onStateTypeChange={setPartialQueryByKey('stateType')}
                    />
                    <PriorityFilter
                        text={tr('Priority')}
                        value={filterQuery?.priority}
                        priorities={priorities}
                        onChange={setPartialQueryByKey('priority')}
                    />

                    <EstimateFilter
                        text={tr('Estimate')}
                        value={filterQuery?.estimate}
                        onChange={setPartialQueryByKey('estimate')}
                    />

                    <ProjectFilter
                        text={tr('Project')}
                        value={filterQuery?.project}
                        projects={projects}
                        onChange={setPartialQueryByKey('project')}
                        onSearchChange={setProjectsQuery}
                    />
                    <UserFilter
                        tabName="issuer"
                        text={tr('Issuer')}
                        users={mapUserToView(issuers)}
                        value={filterQuery?.issuer}
                        onChange={setPartialQueryByKey('issuer')}
                        onSearchChange={setIssuersQuery}
                    />
                    <UserFilter
                        tabName="owner"
                        text={tr('Owner')}
                        users={mapUserToView(owners)}
                        value={filterQuery?.owner}
                        onChange={setPartialQueryByKey('owner')}
                        onSearchChange={setOwnersQuery}
                    />
                    <TagFilter
                        text={tr('Tags')}
                        value={filterQuery?.tag}
                        tags={tags}
                        onChange={setPartialQueryByKey('tag')}
                        onSearchChange={setTagsQuery}
                    />
                    <UserFilter
                        tabName="participant"
                        text={tr('Participant')}
                        users={mapUserToView(participants)}
                        value={filterQuery?.participant}
                        onChange={setPartialQueryByKey('participant')}
                        onSearchChange={setParticipantsQuery}
                    />
                    <SortFilter text={tr('Sort')} value={filterQuery?.sort} onChange={setPartialQueryByKey('sort')} />
                </FilterPopup>
            </>
        );
    },
);
