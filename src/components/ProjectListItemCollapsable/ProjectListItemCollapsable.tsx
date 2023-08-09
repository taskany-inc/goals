import React, { ComponentProps, MouseEvent, ReactNode } from 'react';
import styled from 'styled-components';
import NextLink from 'next/link';
import { gapXs, gray4, radiusM } from '@taskany/colors';
import { Text, nullable } from '@taskany/bricks';
import { IconServersOutline } from '@taskany/icons';

import { ProjectByIdReturnType } from '../../../trpc/inferredTypes';
import { GoalsListContainer } from '../GoalListItem';
import { CollapsableItem, collapseOffset } from '../CollapsableItem';
import { ProjectListContainer, ProjectListItem } from '../ProjectListItem';

const StyledGoalsListContainer = styled(GoalsListContainer)`
    background-color: ${gray4};
    border-radius: ${radiusM};
    margin: 0px;
    padding: 0px;
`;

const StyledProjectIcons = styled.div`
    display: flex;
    align-items: center;
    gap: ${gapXs};
`;

interface ProjectListItemCollapsableProps {
    href?: string;
    project: NonNullable<ProjectByIdReturnType>;
    position?: ComponentProps<typeof CollapsableItem>['position'];
    disabled?: boolean;
    nodes?: ComponentProps<typeof CollapsableItem>['nodes'];
    children?: ReactNode;
    collapsed: boolean;
    onClick?: () => void;
    loading?: boolean;
    deep?: number;
}

const onProjectClickHandler = (e: MouseEvent) => {
    if (!e.metaKey && !e.ctrlKey) {
        e.preventDefault();
    } else {
        e.stopPropagation();
    }
};

export const ProjectListItemCollapsable: React.FC<ProjectListItemCollapsableProps> = ({
    project,
    collapsed = true,
    position = 'root',
    onClick,
    children,
    loading = false,
    disabled,
    nodes,
    deep = 0,
    href,
}) => {
    const childsLength = project.children.length;
    const contentHidden = collapsed || loading;

    const offset = collapseOffset * (deep > 0 && contentHidden ? deep - 1 : deep);

    const projectComponent = (
        <ProjectListItem
            as="a"
            title={project.title}
            owner={project.activity}
            participants={project.participants}
            starred={project._isStarred}
            watching={project._isWatching}
            averageScore={project.averageScore}
            onClick={onProjectClickHandler}
            disabled={disabled}
        >
            {nullable(childsLength, (c) => (
                <StyledProjectIcons>
                    <IconServersOutline size="xs" />
                    <Text size="xs">{c}</Text>
                </StyledProjectIcons>
            ))}
        </ProjectListItem>
    );

    return (
        <CollapsableItem
            position={position}
            collapsed={contentHidden}
            onClick={disabled ? undefined : onClick}
            nodes={nodes}
            header={
                <ProjectListContainer offset={offset}>
                    {href ? (
                        <NextLink href={href} passHref legacyBehavior>
                            {projectComponent}
                        </NextLink>
                    ) : (
                        projectComponent
                    )}
                </ProjectListContainer>
            }
        >
            <StyledGoalsListContainer offset={offset}>{children}</StyledGoalsListContainer>
        </CollapsableItem>
    );
};
