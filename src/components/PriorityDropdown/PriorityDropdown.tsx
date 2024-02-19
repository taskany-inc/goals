import { Text } from '@taskany/bricks/harmony';
import { nullable } from '@taskany/bricks';
import { ComponentProps } from 'react';

import { Priority } from '../../types/priority';
import { trpc } from '../../utils/trpcClient';
import { Dropdown, DropdownTrigger, DropdownPanel } from '../Dropdown/Dropdown';
import { getPriorityText } from '../PriorityText/PriorityText';

interface PriorityDropdownProps {
    error?: ComponentProps<typeof DropdownTrigger>['error'];
    label?: ComponentProps<typeof DropdownTrigger>['label'];
    value?: Priority;
    disabled?: boolean;

    onChange?: (priority: Priority) => void;
}

export const PriorityDropdown = ({ label, value, disabled, onChange, ...props }: PriorityDropdownProps) => {
    const { data: priorities = [] } = trpc.priority.getAll.useQuery();

    return (
        <Dropdown>
            <DropdownTrigger label={label} {...props} readOnly={disabled}>
                {nullable(value, ({ title }) => (
                    <Text size="s" as="span">
                        {getPriorityText(title)}
                    </Text>
                ))}
            </DropdownTrigger>
            <DropdownPanel
                width={150}
                value={value}
                selectable
                items={priorities}
                onChange={onChange}
                renderItem={(props) => <Text size="s">{getPriorityText(props.item.title)}</Text>}
            />
        </Dropdown>
    );
};
