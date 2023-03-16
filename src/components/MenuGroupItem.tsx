import React from 'react';
import styled from 'styled-components';

import { Text } from '@common/Text';

import { gapS, gapXs, gray4, gray7 } from '../design/@generated/themes';

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
    color: ${gray7};

    border-bottom: 1px solid ${gray4};

    padding-bottom: ${gapXs};
    margin-bottom: ${gapS};
`;

export const MenuGroupItem: React.FC<MenuGroupItemProps> = ({ title, children }) => (
    <StyledMenuGroupItem>
        <StyledMenuGroupItemTitle weight="bold" size="s">
            {title}
        </StyledMenuGroupItemTitle>
        {children}
    </StyledMenuGroupItem>
);
