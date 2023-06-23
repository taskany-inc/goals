import React, { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { danger0, gapM, gapS, gray7 } from '@taskany/colors';
import {
    Dot,
    Button,
    Card,
    CardComment,
    CardInfo,
    Dropdown,
    Link,
    MoreVerticalIcon,
    BinIcon,
    EditIcon,
    MenuItem,
    ModalContent,
    ModalHeader,
    ModalPreview,
    nullable,
    Text,
} from '@taskany/bricks';

import { refreshInterval } from '../../utils/config';
import { routes } from '../../hooks/router';
import { usePageContext } from '../../hooks/usePageContext';
import { useReactionsResource } from '../../hooks/useReactionsResource';
import { useCriteriaResource } from '../../hooks/useCriteriaResource';
import { dispatchModalEvent, ModalEvent } from '../../utils/dispatchModal';
import { editGoalKeys } from '../../utils/hotkeys';
import { IssueTitle } from '../IssueTitle';
import { IssueParent } from '../IssueParent';
import { RelativeTime } from '../RelativeTime/RelativeTime';
import { IssueStats } from '../IssueStats/IssueStats';
import { GoalDeleteModal } from '../GoalDeleteModal/GoalDeleteModal';
import { trpc } from '../../utils/trpcClient';
import { notifyPromise } from '../../utils/notifyPromise';
import { GoalStateChangeSchema } from '../../schema/goal';
import { GoalActivity } from '../GoalActivity';
import { GoalCriteria } from '../GoalCriteria/GoalCriteria';
import { CriteriaForm } from '../CriteriaForm/CriteriaForm';

import { tr } from './GoalPreview.i18n';

const Md = dynamic(() => import('../Md'));
const StateSwitch = dynamic(() => import('../StateSwitch'));
const ModalOnEvent = dynamic(() => import('../ModalOnEvent'));
const GoalEditForm = dynamic(() => import('../GoalEditForm/GoalEditForm'));

interface GoalPreviewProps {
    preview: {
        _shortId: string;
        id: string;
        title: string;
        description?: string | null;
        updatedAt: Date;
    };

    onClose?: () => void;
    onDelete?: () => void;
}

const StyledImportantActions = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const StyledPublicActions = styled.div`
    display: flex;
    align-items: center;

    & > * {
        margin-right: ${gapS};
    }
`;

const StyledModalHeader = styled(ModalHeader)`
    top: 0;
    position: sticky;

    box-shadow: 0 2px 5px 2px rgb(0 0 0 / 10%);
`;

const StyledModalContent = styled(ModalContent)`
    overflow: auto;
    height: 70vh;

    padding-top: ${gapM};
`;

const StyledCard = styled(Card)`
    min-height: 60px;
`;

const GoalPreview: React.FC<GoalPreviewProps> = ({ preview, onClose, onDelete }) => {
    const { user } = usePageContext();
    const [isRelativeTime, setIsRelativeTime] = useState(true);

    const onChangeTypeDate = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined) => {
        if (e && e.target === e.currentTarget) {
            setIsRelativeTime(!isRelativeTime);
        }
    };

    const archiveMutation = trpc.goal.toggleArchive.useMutation();
    const utils = trpc.useContext();

    const invalidateFn = useCallback(() => {
        return utils.goal.getById.invalidate(preview._shortId);
    }, [utils.goal.getById, preview._shortId]);

    const { data: goal } = trpc.goal.getById.useQuery(preview._shortId, {
        staleTime: refreshInterval,
    });

    const [goalEditModalVisible, setGoalEditModalVisible] = useState(false);
    const onGoalEdit = useCallback(() => {
        setGoalEditModalVisible(false);

        invalidateFn();
    }, [invalidateFn]);
    const onGoalEditModalShow = useCallback(() => {
        setGoalEditModalVisible(true);
    }, []);

    const onGoalEditModalClose = useCallback(() => {
        setGoalEditModalVisible(false);
    }, []);

    const { commentReaction } = useReactionsResource(goal?.reactions);

    const stateChangeMutations = trpc.goal.switchState.useMutation();
    const onGoalStateChange = useCallback(
        async (nextState: GoalStateChangeSchema['state']) => {
            if (goal) {
                await stateChangeMutations.mutateAsync({
                    id: goal.id,
                    state: nextState,
                });
            }

            invalidateFn();
        },
        [goal, invalidateFn, stateChangeMutations],
    );

    const onCommentPublish = useCallback(() => {
        invalidateFn();
    }, [invalidateFn]);

    const onCommentReactionToggle = useCallback(
        (id: string) => commentReaction(id, () => utils.goal.getById.invalidate(preview._shortId)),
        [preview._shortId, commentReaction, utils.goal.getById],
    );
    const onCommentDelete = useCallback(() => {
        invalidateFn();
    }, [invalidateFn]);

    const onPreviewClose = useCallback(() => {
        setGoalEditModalVisible(false);
        onClose?.();
    }, [onClose]);

    const onEditMenuChange = useCallback((item: { onClick: () => void }) => {
        item.onClick?.();
    }, []);

    const onGoalDeleteConfirm = useCallback(async () => {
        onDelete?.();
        const promise = archiveMutation.mutateAsync({
            id: preview.id,
            archived: true,
        });

        await notifyPromise(promise, 'goalsDelete');

        invalidateFn();
    }, [onDelete, archiveMutation, preview.id, invalidateFn]);

    const { onAddHandler, onRemoveHandler, onToggleHandler } = useCriteriaResource(invalidateFn);

    const commentsRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const onCommentsClick = useCallback(() => {
        commentsRef.current &&
            contentRef.current &&
            headerRef.current &&
            contentRef.current.scrollTo({
                behavior: 'smooth',
                top: commentsRef.current.offsetTop - headerRef.current.offsetHeight,
            });
    }, []);

    const { title, description, updatedAt } = goal || preview;

    return (
        <>
            <ModalPreview visible onClose={onPreviewClose}>
                <StyledModalHeader ref={headerRef}>
                    {Boolean(goal?.project?.parent?.length) &&
                        nullable(goal?.project?.parent, (parent) => (
                            <>
                                <IssueParent as="span" mode="compact" parent={parent} size="m" />
                                <Dot />
                            </>
                        ))}

                    {nullable(goal?.project, (project) => (
                        <IssueParent as="span" mode="compact" parent={project} size="m" />
                    ))}

                    {nullable(title, (t) => (
                        <IssueTitle title={t} href={routes.goal(preview._shortId)} size="xl" />
                    ))}

                    <StyledImportantActions>
                        <StyledPublicActions>
                            {nullable(goal?.state, (s) => (
                                <StateSwitch state={s} flowId={goal?.project?.flowId} onClick={onGoalStateChange} />
                            ))}

                            <IssueStats
                                mode="compact"
                                issuer={goal?.activity}
                                owner={goal?.owner}
                                estimate={goal?._lastEstimate}
                                priority={goal?.priority}
                                achivedCriteriaWeight={
                                    goal?._hasAchievementCriteria ? goal?._achivedCriteriaWeight : undefined
                                }
                                comments={goal?._count?.comments ?? 0}
                                onCommentsClick={onCommentsClick}
                                updatedAt={updatedAt}
                            />
                        </StyledPublicActions>

                        {nullable(goal?._isEditable, () => (
                            <Dropdown
                                onChange={onEditMenuChange}
                                items={[
                                    {
                                        label: tr('Edit'),
                                        icon: <EditIcon size="xxs" />,
                                        onClick: dispatchModalEvent(ModalEvent.GoalEditModal),
                                    },
                                    {
                                        label: tr('Delete'),
                                        color: danger0,
                                        icon: <BinIcon size="xxs" />,
                                        onClick: dispatchModalEvent(ModalEvent.GoalDeleteModal),
                                    },
                                ]}
                                renderTrigger={({ ref, onClick }) => (
                                    <Button
                                        ref={ref}
                                        ghost
                                        iconLeft={<MoreVerticalIcon noWrap size="xs" />}
                                        onClick={onClick}
                                    />
                                )}
                                renderItem={({ item, cursor, index, onClick }) => (
                                    <MenuItem
                                        key={item.label}
                                        ghost
                                        color={item.color}
                                        focused={cursor === index}
                                        icon={item.icon}
                                        onClick={onClick}
                                    >
                                        {item.label}
                                    </MenuItem>
                                )}
                            />
                        ))}
                    </StyledImportantActions>
                </StyledModalHeader>
                <StyledModalContent ref={contentRef}>
                    <StyledCard>
                        <CardInfo onClick={onChangeTypeDate}>
                            <Link inline>{goal?.activity?.user?.name}</Link> —{' '}
                            {nullable(goal?.createdAt, (date) => (
                                <RelativeTime isRelativeTime={isRelativeTime} date={date} />
                            ))}
                        </CardInfo>

                        <CardComment>
                            {description ? (
                                <Md>{description}</Md>
                            ) : (
                                <Text size="s" color={gray7} weight="thin">
                                    {tr('No description provided')}
                                </Text>
                            )}
                        </CardComment>
                    </StyledCard>

                    {nullable(goal?.goalAchiveCriteria.length || goal?._isEditable, () => (
                        <GoalCriteria
                            goalId={goal?.id}
                            criteriaList={goal?.goalAchiveCriteria}
                            canEdit={goal?._isEditable || false}
                            onAddCriteria={onAddHandler}
                            onToggleCriteria={onToggleHandler}
                            onRemoveCriteria={onRemoveHandler}
                            renderForm={(props) =>
                                nullable(goal?._isEditable, () => (
                                    <CriteriaForm
                                        onSubmit={props.onAddCriteria}
                                        goalId={goal?.id || preview.id}
                                        validityData={props.dataForValidateCriteria}
                                    />
                                ))
                            }
                        />
                    ))}

                    {nullable(goal?.activityFeed, (feed) => (
                        <GoalActivity
                            feed={feed}
                            ref={commentsRef}
                            onCommentPublish={onCommentPublish}
                            onCommentReaction={onCommentReactionToggle}
                            goalId={preview.id}
                            userId={user?.activityId}
                            goalStates={goal?._isEditable ? goal.project?.flow.states : undefined}
                            onCommentDelete={onCommentDelete}
                        />
                    ))}
                </StyledModalContent>
            </ModalPreview>

            {nullable(goal, (g) =>
                nullable(g._isEditable, () => (
                    <>
                        <ModalOnEvent
                            event={ModalEvent.GoalEditModal}
                            hotkeys={editGoalKeys}
                            visible={goalEditModalVisible}
                            onShow={onGoalEditModalShow}
                            onClose={onGoalEditModalClose}
                        >
                            <GoalEditForm goal={g} onSubmit={onGoalEdit} />
                        </ModalOnEvent>

                        <GoalDeleteModal shortId={g._shortId} onConfirm={onGoalDeleteConfirm} />
                    </>
                )),
            )}
        </>
    );
};

export default GoalPreview;
