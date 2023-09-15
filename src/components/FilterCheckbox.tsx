import React from 'react';
import styled from 'styled-components';
import { Checkbox, CheckboxInput, CheckboxLabel, Text, nullable } from '@taskany/bricks';
import { gapS, gapSm, gapXs } from '@taskany/colors';

const StyledCheckboxLabel = styled(CheckboxLabel)`
    display: inline-flex;
    gap: ${gapSm};
    align-items: center;
    margin-left: ${gapS};
`;

const StyledCheckbox = styled(Checkbox)`
    padding: ${gapXs} 0;
`;

const StyledChekboxInput = styled(CheckboxInput)`
    // aligned by icon in input
    margin-left: 9.5px;
`;

type CheckboxProps = React.ComponentProps<typeof Checkbox> & React.ComponentProps<typeof CheckboxInput>;

interface FilterCheckboxProps extends CheckboxProps {
    label: string;
    iconLeft?: React.ReactNode;
}

export const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ name, onClick, checked, value, label, iconLeft }) => (
    <StyledCheckbox name={name} onClick={onClick}>
        <StyledChekboxInput checked={checked} value={value} />
        <StyledCheckboxLabel>
            {nullable(iconLeft, (icon) => icon)}
            <Text weight="bold" size="s">
                {label}
            </Text>
        </StyledCheckboxLabel>
    </StyledCheckbox>
);
