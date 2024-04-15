import { ComponentProps, FC } from 'react';
import { Button } from '@taskany/bricks/harmony';
import { nullable } from '@taskany/bricks';
import { IconArrowDownOutline, IconArrowUpOutline } from '@taskany/icons';

import { SortDirection } from '../../hooks/useUrlFilterParams';

const getNextDirection = (currentDirection?: SortDirection): SortDirection => {
    switch (currentDirection) {
        case 'asc':
            return 'desc';
        case 'desc':
            return null;
        default:
            return 'asc';
    }
};

interface SortButtonProps extends Omit<ComponentProps<typeof Button>, 'value' | 'onChange'> {
    title: string;
    value?: SortDirection;
    onChange?: (value: SortDirection) => void;
}

export const SortButton: FC<SortButtonProps> = ({ title, value, onChange }) => {
    return (
        <Button
            text={title}
            view={value ? 'checked' : 'default'}
            iconLeft={nullable(value, (v) =>
                v === 'asc' ? <IconArrowDownOutline size="s" /> : <IconArrowUpOutline size="s" />,
            )}
            onClick={() => onChange?.(getNextDirection(value))}
        />
    );
};
