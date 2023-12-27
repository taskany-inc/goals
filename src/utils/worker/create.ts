import * as Sentry from '@sentry/nextjs';

import { prisma } from '../prisma';

import * as templates from './mail/templates';

export enum jobState {
    scheduled = 'scheduled',
    pending = 'pending',
    completed = 'completed',
}

export enum jobKind {
    email = 'email',
    cron = 'cron',
}

type Templates = typeof templates;

export interface JobDataMap {
    email: {
        template: keyof Templates;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any;
    };
    cron: {
        template: 'goalPing';
    };
}

export type JobKind = keyof JobDataMap;

interface CreateJobProps<K extends keyof JobDataMap> {
    data: JobDataMap[K];
    priority?: number;
    delay?: number;
    cron?: string;
}

export function createJob<K extends keyof JobDataMap>(kind: K, { data, priority, delay, cron }: CreateJobProps<K>) {
    return prisma.job.create({
        data: {
            state: jobState.scheduled,
            data,
            kind,
            priority,
            delay,
            cron,
        },
    });
}

export function createEmailJob<T extends keyof Templates, Params extends Parameters<Templates[T]>[number]>(
    template: T,
    data: Params,
) {
    if (!data.to.length) {
        Sentry.captureException(new Error('No recipients defined'), {
            extra: {
                template,
                ...data,
            },
        });
        return null;
    }

    return createJob('email', {
        data: {
            template,
            data,
        },
    });
}

export function createCronJob<T extends JobDataMap['cron']['template']>(template: T, cron: string) {
    return createJob('cron', {
        data: {
            template,
        },
        cron,
    });
}
