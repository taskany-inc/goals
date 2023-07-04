import { FC, ReactNode, useState } from 'react';
import {
    FiltersAction,
    FiltersCounter,
    FiltersCounterContainer,
    FiltersMenuContainer,
    FiltersPanelContainer,
    FiltersPanelContent,
    FiltersSearchContainer,
    StarFilledIcon,
    StarIcon,
    nullable,
} from '@taskany/bricks';

import { QueryState } from '../../hooks/useUrlFilterParams';
import { SearchFilter } from '../SearchFilter';
import { ProjectFilter } from '../ProjectFilter';
import { TagFilter } from '../TagFilter';
import { EstimateFilter } from '../EstimateFilter';
import { PresetDropdown } from '../PresetDropdown';
import { LimitDropdown } from '../LimitDropdown';
import { UserFilter } from '../UserFilter/UserFilter';
import { PriorityFilter } from '../PriorityFilter';
import { StateFilter } from '../StateFilter';
import { FiltersPanelApplied } from '../FiltersPanelApplied/FiltersPanelApplied';
import { FilterById } from '../../../trpc/inferredTypes';
import { trpc } from '../../utils/trpcClient';
import { SortFilter } from '../SortFilter/SortFilter';
import { StarredFilter } from '../StarredFilter/StarredFilter';
import { WatchingFilter } from '../WatchingFilter/WatchingFilter';

import { tr } from './FiltersPanel.i18n';

const take = 5;
const queryParams = {
    keepPreviousData: true,
};

export const FiltersPanel: FC<{
    children?: ReactNode;
    loading?: boolean;
    total?: number;
    counter?: number;
    queryState: QueryState;
    queryString?: string;

    preset?: FilterById;
    estimates?: React.ComponentProps<typeof EstimateFilter>['estimates'];
    presets?: React.ComponentProps<typeof PresetDropdown>['presets'];

    onSearchChange: (search: string) => void;
    onPriorityChange: React.ComponentProps<typeof PriorityFilter>['onChange'];
    onStateChange: React.ComponentProps<typeof StateFilter>['onChange'];
    onIssuerChange: React.ComponentProps<typeof UserFilter>['onChange'];
    onOwnerChange: React.ComponentProps<typeof UserFilter>['onChange'];
    onParticipantChange: React.ComponentProps<typeof UserFilter>['onChange'];
    onProjectChange: React.ComponentProps<typeof ProjectFilter>['onChange'];
    onTagChange: React.ComponentProps<typeof TagFilter>['onChange'];
    onEstimateChange: React.ComponentProps<typeof EstimateFilter>['onChange'];
    onPresetChange: React.ComponentProps<typeof PresetDropdown>['onChange'];
    onStarredChange: React.ComponentProps<typeof StarredFilter>['onChange'];
    onWatchingChange: React.ComponentProps<typeof WatchingFilter>['onChange'];
    onSortChange: React.ComponentProps<typeof SortFilter>['onChange'];
    onLimitChange?: React.ComponentProps<typeof LimitDropdown>['onChange'];
    onFilterStar?: () => void;
}> = ({
    children,
    loading,
    total = 0,
    counter = 0,
    queryState,
    queryString,
    preset,
    estimates = [],
    presets = [],
    onPriorityChange,
    onStateChange,
    onIssuerChange,
    onOwnerChange,
    onParticipantChange,
    onSearchChange,
    onProjectChange,
    onEstimateChange,
    onPresetChange,
    onTagChange,
    onLimitChange,
    onFilterStar,
    onSortChange,
    onStarredChange,
    onWatchingChange,
}) => {
    const [ownersQuery, setOwnersQuery] = useState('');

    const { data: owners = [] } = trpc.user.suggestions.useQuery(
        {
            query: ownersQuery,
            include: queryState.owner,
            take,
        },
        queryParams,
    );

    const [issuersQuery, setIssuersQuery] = useState('');

    const { data: issuers = [] } = trpc.user.suggestions.useQuery(
        {
            query: issuersQuery,
            include: queryState.issuer,
            take,
        },
        queryParams,
    );

    const [participantsQuery, setParticipantsQuery] = useState('');

    const { data: participants = [] } = trpc.user.suggestions.useQuery(
        {
            query: participantsQuery,
            include: queryState.issuer,
            take,
        },
        queryParams,
    );

    const [projectsQuery, setProjectsQuery] = useState('');

    const { data: projects = [] } = trpc.project.suggestions.useQuery(
        {
            query: projectsQuery,
            include: queryState.project,
            take,
        },
        queryParams,
    );

    const [tagsQuery, setTagsQuery] = useState('');

    const { data: tags = [] } = trpc.tag.suggestions.useQuery(
        {
            query: tagsQuery,
            include: queryState.tag,
            take,
        },
        queryParams,
    );

    const { data: states = [] } = trpc.state.all.useQuery();

    return (
        <>
            <FiltersPanelContainer loading={loading}>
                <FiltersPanelContent>
                    <FiltersSearchContainer>
                        <SearchFilter
                            placeholder={tr('Search')}
                            defaultValue={queryState.query}
                            onChange={onSearchChange}
                        />
                    </FiltersSearchContainer>
                    <FiltersCounterContainer>
                        <FiltersCounter total={total} counter={counter} />
                    </FiltersCounterContainer>
                    <FiltersMenuContainer>
                        <StateFilter
                            text={tr('State')}
                            value={queryState.state}
                            states={states}
                            onChange={onStateChange}
                        />

                        <PriorityFilter text={tr('Priority')} value={queryState.priority} onChange={onPriorityChange} />

                        <ProjectFilter
                            text={tr('Project')}
                            value={queryState.project}
                            projects={projects}
                            onChange={onProjectChange}
                            onSearchChange={setProjectsQuery}
                        />

                        <UserFilter
                            users={issuers}
                            text={tr('Issuer')}
                            value={queryState.issuer}
                            onChange={onIssuerChange}
                            onSearchChange={setIssuersQuery}
                        />

                        <UserFilter
                            users={owners}
                            text={tr('Owner')}
                            value={queryState.owner}
                            onChange={onOwnerChange}
                            onSearchChange={setOwnersQuery}
                        />

                        {Boolean(estimates.length) && (
                            <EstimateFilter
                                text={tr('Estimate')}
                                value={queryState.estimate}
                                estimates={estimates}
                                onChange={onEstimateChange}
                            />
                        )}

                        <TagFilter
                            text={tr('Tags')}
                            value={queryState.tag}
                            tags={tags}
                            onChange={onTagChange}
                            onSearchChange={setTagsQuery}
                        />

                        <UserFilter
                            users={participants}
                            text={tr('Participant')}
                            value={queryState.participant}
                            onChange={onParticipantChange}
                            onSearchChange={setParticipantsQuery}
                        />

                        <StarredFilter value={queryState.starred} onChange={onStarredChange} />

                        <WatchingFilter value={queryState.watching} onChange={onWatchingChange} />

                        <SortFilter text={tr('Sort')} value={queryState.sort} onChange={onSortChange} />

                        {Boolean(presets.length) && (
                            <PresetDropdown
                                text={tr('Preset')}
                                value={preset}
                                presets={presets}
                                onChange={onPresetChange}
                            />
                        )}

                        {onLimitChange &&
                            nullable(queryState.limit, (lf) => (
                                <LimitDropdown text={tr('Limit')} value={[String(lf)]} onChange={onLimitChange} />
                            ))}

                        {((Boolean(queryString) && !preset) || (preset && !preset._isOwner && !preset._isStarred)) && (
                            <FiltersAction onClick={onFilterStar}>
                                <StarIcon size="s" noWrap />
                            </FiltersAction>
                        )}

                        {preset && (preset._isOwner || preset._isStarred) && (
                            <FiltersAction onClick={onFilterStar}>
                                <StarFilledIcon size="s" noWrap />
                            </FiltersAction>
                        )}
                    </FiltersMenuContainer>
                    {children}
                </FiltersPanelContent>
            </FiltersPanelContainer>
            <FiltersPanelApplied
                queryState={queryState}
                states={states}
                issuers={issuers}
                owners={owners}
                participants={participants}
                projects={projects}
                tags={tags}
                estimates={estimates}
            />
        </>
    );
};
