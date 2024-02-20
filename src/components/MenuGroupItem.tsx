import React from 'react';
import styled from 'styled-components';
import { Text } from '@taskany/bricks';

interface MenuGroupItemProps {
    title: string;
    children?: React.ReactNode;
}

const StyledMenuGroupItem = styled.div`
    box-sizing: border-box;

    padding: 6px;
    margin-bottom: 4px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const StyledMenuGroupItemTitle = styled(Text)`
    color: var(--gray7);

    border-bottom: 1px solid var(--gray4);

    padding-bottom: var(--gap-xs);
    margin-bottom: var(--gap-s);
`;

export const MenuGroupItem: React.FC<MenuGroupItemProps> = ({ title, children }) => (
    <StyledMenuGroupItem>
        <StyledMenuGroupItemTitle weight="bold" size="s">
            {title}
        </StyledMenuGroupItemTitle>
        {children}
    </StyledMenuGroupItem>
);
