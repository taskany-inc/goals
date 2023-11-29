import React, { ChangeEvent, ComponentProps, ReactNode, useCallback } from 'react';
import styled from 'styled-components';
import { FormControl, FormControlError, FormControlInput, nullable } from '@taskany/bricks';
import { IconSearchOutline } from '@taskany/icons';
import { gapS } from '@taskany/colors';

import { tr } from './FilterAutoCompleteInput.i18n';

const StyledFormControl = styled(FormControl)`
    margin-bottom: ${gapS};
`;

interface FilterAutoCompleteInputProps extends Omit<React.ComponentProps<typeof FormControlInput>, 'onChange'> {
    onChange: (value: string) => void;
    error?: ComponentProps<typeof FormControlError>['error'];
    icon?: ReactNode;
}

export const FilterAutoCompleteInput: React.FC<FilterAutoCompleteInputProps> = ({
    onChange,
    error,
    icon = <IconSearchOutline size="s" />,
    placeholder = tr('Search...'),
    ...props
}) => {
    const onChangeHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
        },
        [onChange],
    );

    return (
        <StyledFormControl variant="outline" error={error?.message != null}>
            <FormControlInput
                autoFocus
                placeholder={placeholder}
                iconLeft={icon}
                onChange={onChangeHandler}
                {...props}
            />
            {nullable(error?.message, (message) => (
                <FormControlError error={{ message }} />
            ))}
        </StyledFormControl>
    );
};
