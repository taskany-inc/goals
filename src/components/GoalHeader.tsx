import { nullable } from '@taskany/bricks';
import { ComponentProps, FC, ReactNode } from 'react';
import styled from 'styled-components';

import { GoalByIdReturnType } from '../../trpc/inferredTypes';

import StateSwitch from './StateSwitch';
import { State } from './State';
import { IssueStats } from './IssueStats/IssueStats';
import { IssueTitle } from './IssueTitle';

const StyledGoalHeader = styled.div`
    display: grid;
    grid-template-columns: 1fr max-content;
`;

const StyledPublicActions = styled.div`
    display: flex;
    align-items: center;
`;

const StyledGoalInfo = styled.div<{ align: 'left' | 'right' }>`
    ${({ align }) => `
        justify-self: ${align};
    `}

    ${({ align }) =>
        align === 'right' &&
        `
            display: grid;
            justify-items: end;
            align-content: space-between;
        `}
`;

interface GoalHeaderProps
    extends Pick<ComponentProps<typeof IssueTitle>, 'href' | 'size'>,
        Pick<ComponentProps<typeof IssueStats>, 'onCommentsClick'> {
    goal?: Partial<GoalByIdReturnType>;
    actions?: ReactNode;
    children?: ReactNode;

    onGoalStateChange?: ComponentProps<typeof StateSwitch>['onClick'];
}

export const GoalHeader: FC<GoalHeaderProps> = ({
    goal,
    actions,
    children,
    href,
    size,
    onGoalStateChange,
    onCommentsClick,
}) => {
    return (
        <StyledGoalHeader>
            <StyledGoalInfo align="left">
                {children}

                {nullable(goal?.title, (title) => (
                    <IssueTitle title={title} href={href} size={size} />
                ))}

                {nullable(goal, (g) => (
                    <StyledPublicActions>
                        {nullable(g?.state, (s) =>
                            g._isEditable && g.project?.flowId ? (
                                <StateSwitch state={s} flowId={g.project.flowId} onClick={onGoalStateChange} />
                            ) : (
                                <State title={s.title} hue={s.hue} />
                            ),
                        )}

                        {nullable(g.updatedAt, (date) => (
                            <IssueStats
                                estimate={g.estimate}
                                estimateType={g.estimateType}
                                priority={g.priority}
                                achivedCriteriaWeight={g._hasAchievementCriteria ? g._achivedCriteriaWeight : undefined}
                                comments={g._count?.comments ?? 0}
                                onCommentsClick={onCommentsClick}
                                updatedAt={date}
                            />
                        ))}
                    </StyledPublicActions>
                ))}
            </StyledGoalInfo>
            {nullable(actions, (ac) => (
                <StyledGoalInfo align="right">{ac}</StyledGoalInfo>
            ))}
        </StyledGoalHeader>
    );
};
