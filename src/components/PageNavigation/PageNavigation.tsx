import { FC } from 'react';
import { IconBellOutline } from '@taskany/icons';
import { useRouter } from 'next/router';

import {
    Navigation,
    NavigationItem,
    NavigationSection,
    NavigationSidebar,
    NavigationSidebarContent,
    NavigationSidebarHeader,
    NavigationSidebarLogo,
    NavigationSidebarTitle,
} from '../NavigationSidebar/NavigationSidebar';
import { NavigationSidebarActionButton } from '../NavigationSidebarActionButton/NavigationSidebarActionButton';
import { routes } from '../../hooks/router';
import { header, headerMenuExplore, headerMenuGoals } from '../../utils/domObjects';

import { tr } from './PageNavigation.i18n';

interface AppNavigationProps {
    logo?: string;
}

const goalsRoutes = [
    {
        title: tr('My goals'),
        href: routes.index(),
        attrs: headerMenuGoals.attr,
    },
    {
        title: tr('All goals'),
        href: routes.goals(),
        attrs: headerMenuExplore.attr,
    },
];

const projectsRoutes = [
    {
        title: tr('All projects'),
        href: routes.exploreProjects(),
    },
];

export const PageNavigation: FC<AppNavigationProps> = ({ logo }) => {
    const nextRouter = useRouter();
    const activeRoute = nextRouter.asPath.split('?')[0];

    return (
        <NavigationSidebar {...header.attr}>
            <NavigationSidebarHeader>
                <NavigationSidebarLogo logo={logo} href={routes.index()} />
                <NavigationSidebarTitle>{tr('Goals')}</NavigationSidebarTitle>
                <IconBellOutline size="s" />
            </NavigationSidebarHeader>
            <NavigationSidebarContent>
                <NavigationSidebarActionButton />
                <Navigation>
                    <NavigationSection title={tr('Goals')}>
                        {goalsRoutes.map(({ title, href }) => (
                            <NavigationItem key={href} selected={activeRoute === href} href={href}>
                                {title}
                            </NavigationItem>
                        ))}
                    </NavigationSection>

                    <NavigationSection title={tr('Projects')}>
                        {projectsRoutes.map(({ title, href }) => (
                            <NavigationItem key={href} selected={activeRoute === href} href={href}>
                                {title}
                            </NavigationItem>
                        ))}
                    </NavigationSection>
                </Navigation>
            </NavigationSidebarContent>
        </NavigationSidebar>
    );
};
