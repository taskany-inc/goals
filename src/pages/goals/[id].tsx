/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import styled, { css } from 'styled-components';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

import {
    Goal,
    State,
    Activity,
    EstimateInput,
    GoalUpdateInput,
    GoalDependencyToggleInput,
    Priority,
} from '../../../graphql/@generated/genql';
import { gql } from '../../utils/gql';
import { createFetcher } from '../../utils/createFetcher';
import { declareSsrProps, ExternalPageProps } from '../../utils/declareSsrProps';
import { estimatedMeta } from '../../utils/dateTime';
import { nullable } from '../../utils/nullable';
import { ModalEvent, dispatchModalEvent } from '../../utils/dispatchModal';
import { useMounted } from '../../hooks/useMounted';
import { gapL, gapM, gapS } from '../../design/@generated/themes';
import { Page, PageContent } from '../../components/Page';
import { Tag } from '../../components/Tag';
import { PageSep } from '../../components/PageSep';
import { Link } from '../../components/Link';
import { Card, CardInfo, CardContent, CardActions } from '../../components/Card';
import { IssueTitle } from '../../components/IssueTitle';
import { IssueKey } from '../../components/IssueKey';
import { IssueStats } from '../../components/IssueStats';
import { UserPic } from '../../components/UserPic';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Reactions, ReactionsMap, reactionsGroupsLimit } from '../../components/Reactions';
import { Badge } from '../../components/Badge';
import { commentMask, CommentView } from '../../components/CommentView';
import { IssueDependencies } from '../../components/IssueDependencies';
import { IssueParticipants } from '../../components/IssueParticipants';
import { editGoalKeys } from '../../utils/hotkeys';
import { PriorityDropdown } from '../../components/PriorityDropdown';

const Md = dynamic(() => import('../../components/Md'));
const RelativeTime = dynamic(() => import('../../components/RelativeTime'));
const EstimateDropdown = dynamic(() => import('../../components/EstimateDropdown'));
const UserCompletionDropdown = dynamic(() => import('../../components/UserCompletionDropdown'));
const ModalOnEvent = dynamic(() => import('../../components/ModalOnEvent'));
const GoalEditForm = dynamic(() => import('../../components/GoalEditForm'));
const CommentCreateForm = dynamic(() => import('../../components/CommentCreateForm'));
const ReactionsDropdown = dynamic(() => import('../../components/ReactionsDropdown'));

const refreshInterval = 3000;

const fetcher = createFetcher((_, id: string) => ({
    goal: [
        {
            id,
        },
        {
            id: true,
            title: true,
            description: true,
            activityId: true,
            ownerId: true,
            state: {
                id: true,
                title: true,
                hue: true,
            },
            priority: true,
            estimate: {
                date: true,
                q: true,
                y: true,
            },
            createdAt: true,
            updatedAt: true,
            project: {
                id: true,
                key: true,
                title: true,
                description: true,
                flow: {
                    id: true,
                    states: {
                        id: true,
                        title: true,
                        default: true,
                        hue: true,
                    },
                },
            },
            activity: {
                id: true,
                user: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
                ghost: {
                    id: true,
                    email: true,
                },
            },
            owner: {
                id: true,
                user: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
                ghost: {
                    id: true,
                    email: true,
                },
            },
            tags: {
                id: true,
                title: true,
                description: true,
            },
            reactions: {
                id: true,
                emoji: true,
                activity: {
                    user: {
                        id: true,
                        name: true,
                    },
                    ghost: {
                        id: true,
                        email: true,
                    },
                },
            },
            watchers: {
                id: true,
            },
            stargizers: {
                id: true,
            },
            dependsOn: {
                id: true,
                title: true,
                state: {
                    id: true,
                    title: true,
                    hue: true,
                },
            },
            relatedTo: {
                id: true,
                title: true,
                state: {
                    id: true,
                    title: true,
                    hue: true,
                },
            },
            blocks: {
                id: true,
                title: true,
                state: {
                    id: true,
                    title: true,
                    hue: true,
                },
            },
            comments: {
                id: true,
                description: true,
                createdAt: true,
                activity: {
                    id: true,
                    user: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                    ghost: {
                        id: true,
                        email: true,
                    },
                },
                reactions: {
                    id: true,
                    emoji: true,
                    activity: {
                        user: {
                            id: true,
                            name: true,
                        },
                        ghost: {
                            id: true,
                            email: true,
                        },
                    },
                },
            },
            participants: {
                id: true,
                user: {
                    id: true,
                    email: true,
                    name: true,
                    image: true,
                },
                ghost: {
                    id: true,
                    email: true,
                },
            },
        },
    ],
}));

const IssueHeader = styled(PageContent)`
    display: grid;
    grid-template-columns: 8fr 4fr;
`;

const IssueContent = styled(PageContent)`
    display: grid;
    grid-template-columns: 7fr 5fr;
    gap: ${gapM};
`;

const StyledIssueInfo = styled.div<{ align: 'left' | 'right' }>`
    ${({ align }) => css`
        justify-self: ${align};
    `}

    ${({ align }) =>
        align === 'right' &&
        css`
            display: grid;
            justify-items: end;
            align-content: space-between;
        `}
`;

const StyledIssueInfoRow = styled.div``;

const ActionButton = styled(Button)`
    margin-left: ${gapS};
`;

const IssueAction = styled.div`
    margin-right: ${gapS};
`;

const IssueBaseActions = styled.div`
    display: flex;
    align-items: center;
`;

const StyledIssueTags = styled.span`
    padding-left: ${gapS};
`;

const StyledActivityFeed = styled.div`
    display: grid;
    padding-top: ${gapL};
    row-gap: ${gapM};
`;

const IssueTags: React.FC<{ tags: Goal['tags'] }> = ({ tags }) => (
    <StyledIssueTags>
        {tags?.map((tag) => nullable(tag, (t) => <Tag key={t.id} title={t.title} description={t.description} />))}
    </StyledIssueTags>
);

const StyledIssueDeps = styled.div``;

export const getServerSideProps = declareSsrProps(
    async ({ user, params: { id } }) => ({
        ssrData: await fetcher(user, id),
    }),
    {
        private: true,
    },
);

const GoalPage = ({ user, locale, ssrData, params: { id } }: ExternalPageProps<{ goal: Goal }, { id: string }>) => {
    const t = useTranslations('goals.id');
    const mounted = useMounted(refreshInterval);
    const { asPath } = useRouter();

    const { data, mutate } = useSWR(mounted ? [user, id] : null, (...args) => fetcher(...args), {
        refreshInterval,
    });
    const refresh = useCallback(() => mutate(), [mutate]);

    // NB: this line is compensation for first render before delayed swr will bring updates
    const goal: Goal = data?.goal ?? ssrData.goal;

    const isUserAllowedToEdit = user?.activityId === goal?.activityId || user?.activityId === goal?.ownerId;
    // @ts-ignore unexpectable trouble with filter
    const [watcher, setWatcher] = useState(goal.watchers?.filter(({ id }) => id === user.activityId).length > 0);
    const [stargizer, setStargizer] = useState(
        // @ts-ignore unexpectable trouble with filter
        goal.stargizers?.filter(({ id }) => id === user.activityId).length > 0,
    );
    const [commentFormFocus, setCommentFormFocus] = useState(false);
    const [highlightCommentId, setHighlightCommentId] = useState<string | undefined>(undefined);

    useEffect(() => {
        let tId: NodeJS.Timeout;
        if (highlightCommentId) {
            tId = setTimeout(() => setHighlightCommentId(undefined), 1000);
        }

        return () => clearInterval(tId);
    }, [highlightCommentId]);

    useEffect(() => {
        const targetComment = asPath.split(`#${commentMask}`)[1];

        if (targetComment) {
            setHighlightCommentId(targetComment);
        }
    }, [asPath]);

    const grouppedReactions = useMemo(
        () =>
            goal.reactions?.reduce((acc, curr) => {
                if (!curr) return acc;

                acc[curr.emoji] = acc[curr.emoji]
                    ? {
                          count: acc[curr.emoji].count + 1,
                          authors: acc[curr.emoji].authors.add(curr.activityId),
                      }
                    : {
                          count: 1,
                          authors: new Set(),
                      };

                return acc;
            }, {} as ReactionsMap),
        [goal.reactions],
    );
    const reactionsGroupsNames = Object.keys(grouppedReactions || {});

    const triggerUpdate = useCallback(
        (data: Partial<GoalUpdateInput>) => {
            const promise = gql.mutation({
                updateGoal: [
                    {
                        data: {
                            ...data,
                            id: goal.id,
                        },
                    },
                    {
                        id: true,
                    },
                ],
            });

            toast.promise(promise, {
                error: t('Something went wrong 😿'),
                loading: t('We are updating the goal'),
                success: t('Voila! Goal is up to date 🎉'),
            });

            return promise;
        },
        [t, goal],
    );

    const [issueOwner, setIssueOwner] = useState(goal.owner);
    const issueOwnerName = issueOwner?.user?.name || issueOwner?.user?.email || issueOwner?.ghost?.email;
    const onIssueOwnerChange = useCallback(
        async (activity: Activity) => {
            setIssueOwner(activity);

            await triggerUpdate({
                ownerId: activity?.id,
            });
        },
        [triggerUpdate],
    );

    const [issuePriority, setIssuePriority] = useState(goal.priority);
    const onIssuePriorityChange = useCallback(
        async (priority: Priority) => {
            setIssuePriority(priority);

            await triggerUpdate({
                priority,
            });
        },
        [triggerUpdate],
    );

    const onIssueStateChange = useCallback(
        async (state: State) => {
            await triggerUpdate({
                stateId: state.id,
            });

            refresh();
        },
        [triggerUpdate, refresh],
    );

    const [issueEstimate, setIssueEstimate] = useState<EstimateInput | undefined>(
        goal.estimate?.length ? goal.estimate[goal.estimate.length - 1] : undefined,
    );
    const onIssueEstimateChange = useCallback(
        async (estimate?: EstimateInput) => {
            setIssueEstimate(estimate);

            await triggerUpdate({
                estimate,
            });
        },
        [triggerUpdate],
    );

    const onWatchToggle = useCallback(async () => {
        const promise = gql.mutation({
            toggleGoalWatcher: [
                {
                    toggle: {
                        id: goal.id,
                        direction: !watcher,
                    },
                },
                {
                    id: true,
                },
            ],
        });

        toast.promise(promise, {
            error: t('Something went wrong 😿'),
            loading: t('We are calling owner'),
            success: t(!watcher ? 'Voila! You are watcher now 🎉' : 'So sad! Goal will miss you'),
        });

        setWatcher((w) => !w);

        await promise;
        refresh();
    }, [watcher, goal, refresh, t]);

    const onStarToggle = useCallback(async () => {
        const promise = gql.mutation({
            toggleGoalStargizer: [
                {
                    toggle: {
                        id: goal.id,
                        direction: !stargizer,
                    },
                },
                {
                    id: true,
                },
            ],
        });

        toast.promise(promise, {
            error: t('Something went wrong 😿'),
            loading: t('We are calling owner'),
            success: t(!stargizer ? 'Voila! You are stargizer now 🎉' : 'So sad! Goal will miss you'),
        });

        setStargizer((s) => !s);

        await promise;
        refresh();
    }, [stargizer, goal, refresh, t]);

    const onReactionsToggle = useCallback(
        ({ goalId, commentId }: { goalId?: string; commentId?: string }) =>
            async (emoji?: string) => {
                if (!emoji) return;

                await gql.mutation({
                    toggleReaction: [
                        {
                            data: {
                                emoji,
                                goalId,
                                commentId,
                            },
                        },
                        {
                            id: true,
                        },
                    ],
                });

                refresh();
            },
        [refresh],
    );

    const onParticipantsChange = useCallback(
        async (participants: string[]) => {
            await triggerUpdate({
                participants,
            });

            refresh();
        },
        [refresh, triggerUpdate],
    );

    const onDependenciesChange = useCallback(
        async (toggle: GoalDependencyToggleInput) => {
            const promise = gql.mutation({
                toggleGoalDependency: [
                    {
                        toggle,
                    },
                    {
                        id: true,
                    },
                ],
            });

            toast.promise(promise, {
                error: t('Something went wrong 😿'),
                loading: t('We are updating the goal'),
                success: t('Voila! Goal is up to date 🎉'),
            });

            await promise;

            refresh();
        },
        [refresh, t],
    );

    const onCommentPublish = useCallback(
        (id?: string) => {
            refresh();
            setHighlightCommentId(id);
            setCommentFormFocus(false);
        },
        [refresh, setHighlightCommentId],
    );

    const onCommentLinkClick = useCallback(() => {
        setCommentFormFocus(true);
    }, []);

    const [goalEditModalVisible, setGoalEditModalVisible] = useState(false);
    const onGoalEdit = useCallback(() => {
        setGoalEditModalVisible(false);
        refresh();
    }, [refresh]);

    const onGoalEditModalShow = useCallback(() => {
        setGoalEditModalVisible(true);
    }, []);

    return (
        <Page
            locale={locale}
            title={t.rich('title', {
                goal: () => goal.title,
            })}
        >
            <IssueHeader>
                <StyledIssueInfo align="left">
                    <IssueKey id={goal.id}>
                        <IssueTags tags={goal.tags} />
                    </IssueKey>

                    <IssueTitle title={goal.title} project={goal.project} />

                    <IssueStats
                        locale={locale}
                        flow={goal.project?.flow?.id}
                        state={goal.state}
                        comments={goal.comments?.length || 0}
                        updatedAt={goal.updatedAt}
                        onStateChange={onIssueStateChange}
                        onCommentsClick={onCommentLinkClick}
                    />
                </StyledIssueInfo>

                <StyledIssueInfo align="right">
                    <StyledIssueInfoRow>
                        <ActionButton
                            text={t(watcher ? 'Watching' : 'Watch')}
                            iconLeft={<Icon noWrap type={watcher ? 'eye' : 'eyeClosed'} size="s" />}
                            onClick={onWatchToggle}
                        />
                        <ActionButton
                            text={t(stargizer ? 'Starred' : 'Stars')}
                            iconLeft={<Icon noWrap type={stargizer ? 'starFilled' : 'star'} size="s" />}
                            iconRight={<Badge>{goal.stargizers?.length}</Badge>}
                            onClick={onStarToggle}
                        />
                    </StyledIssueInfoRow>

                    <StyledIssueInfoRow>
                        <Button
                            view="primary"
                            text={t('New goal')}
                            onClick={dispatchModalEvent(ModalEvent.GoalCreateModal, goal.project)}
                        />
                    </StyledIssueInfoRow>
                </StyledIssueInfo>
            </IssueHeader>

            <PageSep />

            <IssueContent>
                <div>
                    <Card>
                        <CardInfo>
                            <Link inline>{goal.activity?.user?.name}</Link> —{' '}
                            <RelativeTime locale={locale} date={goal.createdAt} />
                        </CardInfo>

                        <CardContent>
                            <Md>{goal.description}</Md>
                        </CardContent>

                        <CardActions>
                            <IssueBaseActions>
                                <IssueAction>
                                    <UserCompletionDropdown
                                        text={issueOwnerName}
                                        placeholder={t('Set owner')}
                                        title={t('Set owner')}
                                        query={issueOwnerName}
                                        userPic={
                                            <UserPic
                                                src={issueOwner?.user?.image}
                                                email={issueOwner?.user?.email || issueOwner?.ghost?.email}
                                                size={16}
                                            />
                                        }
                                        onClick={isUserAllowedToEdit ? onIssueOwnerChange : undefined}
                                    />
                                </IssueAction>

                                <IssueAction>
                                    <PriorityDropdown
                                        priority={issuePriority}
                                        text={issuePriority ? t(`Priority.${issuePriority}`) : t('Priority.Priority')}
                                        onClick={isUserAllowedToEdit ? onIssuePriorityChange : undefined}
                                    />
                                </IssueAction>

                                <IssueAction>
                                    <EstimateDropdown
                                        locale={locale}
                                        size="m"
                                        text={t('Schedule')}
                                        placeholder={t('Date input mask placeholder')}
                                        mask={t('Date input mask')}
                                        value={issueEstimate}
                                        defaultValuePlaceholder={issueEstimate ?? estimatedMeta()}
                                        onClose={isUserAllowedToEdit ? onIssueEstimateChange : undefined}
                                    />
                                </IssueAction>
                                <IssueAction>
                                    <Reactions
                                        reactions={grouppedReactions}
                                        onClick={onReactionsToggle({ goalId: goal.id })}
                                    >
                                        {nullable(reactionsGroupsNames.length < reactionsGroupsLimit, () => (
                                            <ReactionsDropdown onClick={onReactionsToggle({ goalId: goal.id })} />
                                        ))}
                                    </Reactions>
                                </IssueAction>
                            </IssueBaseActions>

                            {nullable(isUserAllowedToEdit, () => (
                                <Button text={t('Edit goal')} onClick={dispatchModalEvent(ModalEvent.GoalEditModal)} />
                            ))}
                        </CardActions>
                    </Card>

                    <StyledActivityFeed>
                        <div id="comments" />

                        {goal.comments?.map((comment) =>
                            nullable(comment, (c) => (
                                <CommentView
                                    key={c.id}
                                    id={c.id}
                                    locale={locale}
                                    author={c.activity?.user}
                                    description={c.description}
                                    createdAt={c.createdAt}
                                    isEditable={c.activity?.id === user.activityId}
                                    isNew={c.id === highlightCommentId}
                                    reactions={c.reactions}
                                    onReactionToggle={onReactionsToggle({ commentId: c.id })}
                                />
                            )),
                        )}

                        <CommentCreateForm
                            locale={locale}
                            goalId={goal.id}
                            user={user}
                            setFocus={commentFormFocus}
                            onCreate={onCommentPublish}
                            onBlur={() => setCommentFormFocus(false)}
                        />
                    </StyledActivityFeed>
                </div>

                <StyledIssueDeps>
                    <IssueParticipants issue={goal} onChange={isUserAllowedToEdit ? onParticipantsChange : undefined} />
                    <IssueDependencies issue={goal} onChange={isUserAllowedToEdit ? onDependenciesChange : undefined} />
                </StyledIssueDeps>
            </IssueContent>

            {nullable(isUserAllowedToEdit, () => (
                <ModalOnEvent
                    event={ModalEvent.GoalEditModal}
                    hotkeys={editGoalKeys}
                    visible={goalEditModalVisible}
                    onShow={onGoalEditModalShow}
                >
                    <GoalEditForm goal={goal} locale={locale} onSubmit={onGoalEdit} />
                </ModalOnEvent>
            ))}
        </Page>
    );
};

export default GoalPage;
