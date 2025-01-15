/* eslint-disable no-console */
import assert from 'assert';

import { prisma } from '../src/utils/prisma';
import { createSheep } from '../src/utils/worker/sheep';
import { createCronJob } from '../src/utils/worker/create';

const adminEmail = process.env.ADMIN_EMAIL || 'tony@taskany.org';
const adminPassword = process.env.ADMIN_PASSWORD || 'taskany';

const userEmail = 'user@taskany.org';
const userPassword = 'taskany';

(async () => {
    assert(adminEmail, "Admin's email isn't provided. Check your environment variables: ADMIN_EMAIL.");
    assert(adminPassword, "Admin's password isn't provided. Check your environment variables: ADMIN_PASSWORD.");

    console.log('Adding default data...');

    await Promise.all([
        prisma.priority.createMany({
            data: [
                {
                    title: 'Highest',
                    value: 4,
                },
                {
                    title: 'High',
                    value: 3,
                },
                {
                    title: 'Medium',
                    value: 2,
                    default: true,
                },
                {
                    title: 'Low',
                    value: 1,
                },
            ].reverse(),
        }),
        prisma.flow.create({
            data: {
                title: 'Goal — Default',
                recommended: true,
                states: {
                    create: [
                        {
                            title: 'Draft',
                            hue: 1,
                            type: 'NotStarted',
                            default: true,
                            darkForeground: 'hsl(240 9% 75%)',
                            darkBackground: 'hsl(240 9% 16%)',
                            lightForeground: 'hsl(240 9% 55%)',
                            lightBackground: 'hsl(240 10% 94%)',
                        },
                        {
                            title: 'InProgress',
                            hue: 194,
                            type: 'InProgress',
                            darkForeground: 'hsl(207 86% 65%)',
                            darkBackground: 'hsl(207 60% 18%)',
                            lightForeground: 'hsl(207 54% 51%)',
                            lightBackground: 'hsl(208 81% 96%)',
                        },
                        {
                            title: 'Blocked',
                            hue: 30,
                            type: 'InProgress',
                            darkForeground: 'hsl(46 67% 58%)',
                            darkBackground: 'hsl(46 84% 12%)',
                            lightForeground: 'hsl(46 61% 54%)',
                            lightBackground: 'hsl(44 48% 94%)',
                        },
                        {
                            title: 'Finished',
                            hue: 158,
                            type: 'Completed',
                            darkForeground: 'hsl(102 36% 55%)',
                            darkBackground: 'hsl(101 39% 15%)',
                            lightForeground: 'hsl(101 32% 43%)',
                            lightBackground: 'hsl(102 36% 95%)',
                        },
                        {
                            title: 'Failed',
                            hue: 360,
                            type: 'Failed',
                            darkForeground: 'hsl(1 73% 73%)',
                            darkBackground: 'hsl(2 35% 20%)',
                            lightForeground: 'hsl(0 41% 58%)',
                            lightBackground: 'hsl(0 76% 97%)',
                        },
                        {
                            title: 'Canceled',
                            hue: 274,
                            type: 'Canceled',
                            darkForeground: 'hsl(284 57% 78%)',
                            darkBackground: 'hsl(284 29% 20%)',
                            lightForeground: 'hsl(284 33% 63%)',
                            lightBackground: 'hsl(282 56% 96%)',
                        },
                        {
                            title: 'AtRisk',
                            hue: 14,
                            type: 'InProgress',
                            darkForeground: 'hsl(33 68% 55%)',
                            darkBackground: 'hsl(34 75% 14%)',
                            lightForeground: 'hsl(33 68% 55%)',
                            lightBackground: 'hsl(30 69% 95%)',
                        },
                    ],
                },
            },
            include: {
                states: true,
            },
        }),
        prisma.filter.create({
            data: {
                mode: 'Global',
                title: 'Active',
                params: 'stateType=InProgress,NotStarted&estimate=@current',
                default: true,
            },
        }),
        prisma.user.create({
            data: {
                email: adminEmail,
                role: 'ADMIN',
                accounts: {
                    create: {
                        type: 'credentials',
                        provider: 'email',
                        providerAccountId: 'credentials',
                        password: adminPassword,
                    },
                },
                activity: {
                    create: {
                        settings: {
                            create: {},
                        },
                    },
                },
            },
        }),
        prisma.user.create({
            data: {
                email: userEmail,
                role: 'USER',
                accounts: {
                    create: {
                        type: 'credentials',
                        provider: 'email',
                        providerAccountId: 'userCredentials',
                        password: userPassword,
                    },
                },
                activity: {
                    create: {
                        settings: {
                            create: {},
                        },
                    },
                },
            },
        }),
        prisma.appConfig.create({ data: {} }),
        createSheep(),
        createCronJob('goalPing', '0 0 0 1 * *'),
        createCronJob('externalTaskCheck', '1/10 * * * *'),
        createCronJob('makeCriteriaQueue', '1/10 * * * *'),
    ]);
})();
