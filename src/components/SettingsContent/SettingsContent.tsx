import { FormCard } from '@taskany/bricks';
import cn from 'classnames';
import { ReactNode } from 'react';

import { PageContent } from '../PageContent/PageContent';

import s from './SettingsContent.module.css';

const colorsMap = {
    default: s.SettingsCard_view_default,
    warning: s.SettingsCard_view_warning,
    danger: s.SettingsCard_view_danger,
};

interface SettingsCardProps {
    className?: string;
    children?: ReactNode;
    view?: keyof typeof colorsMap;
}

export const SettingsCard = ({ view = 'default', className, children, ...props }: SettingsCardProps) => {
    return (
        <FormCard className={cn(colorsMap[view], className)} {...props}>
            {children}
        </FormCard>
    );
};

export const SettingsContent: React.FC<{ children: React.ReactNode }> = ({ children, ...attrs }) => {
    return (
        <PageContent className={s.SettingsPageContent} {...attrs}>
            <div>{children}</div>
        </PageContent>
    );
};
