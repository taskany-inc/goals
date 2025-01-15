import { prisma } from '../prisma';

import * as templates from './mail/templates';
import { log } from './utils';

export const defaultJobDelay = process.env.WORKER_JOBS_DELAY ? parseInt(process.env.WORKER_JOBS_DELAY, 10) : 1000;

export enum jobState {
    scheduled = 'scheduled',
    pending = 'pending',
    completed = 'completed',
}

export enum jobKind {
    email = 'email',
    cron = 'cron',
    comment = 'comment',
    criteriaToUpdate = 'criteriaToUpdate',
    criteriaListToUpdate = 'criteriaListToUpdate',
}

type Templates = typeof templates;

export interface JobDataMap {
    email: {
        template: keyof Templates;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any;
    };
    cron: {
        template: 'goalPing' | 'externalTaskCheck' | 'makeCriteriaQueue';
    };
    comment: {
        goalId: string;
        activityId: string;
        description: string;
    };
    criteriaToUpdate: {
        id: string;
    };
    criteriaListToUpdate: {
        ids: string[];
    };
}

export const castJobData = <Kind extends jobKind>(kind: Kind, data: unknown): data is JobDataMap[Kind] => {
    return data != null;
};

export type JobKind = keyof JobDataMap;

interface CreateJobProps<K extends keyof JobDataMap> {
    data: JobDataMap[K];
    priority?: number;
    delay?: number;
    cron?: string;
}

export const pickScheduledLastJob = async (kind: JobKind) => {
    const res = await prisma.job.findMany({
        where: { kind, state: jobState.scheduled },
        orderBy: [{ createdAt: 'desc' }, { updatedAt: 'desc' }],
        take: 1,
        skip: 0,
    });

    if (res.length) {
        return res[0];
    }

    return null;
};

export function createJob<K extends keyof JobDataMap>(
    kind: K,
    { data, priority, delay = defaultJobDelay, cron }: CreateJobProps<K>,
) {
    log(`create new ${kind} job`, JSON.stringify(data));

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

export function createCommentJob(data: JobDataMap['comment'], delay?: number) {
    return createJob('comment', {
        data,
        delay,
    });
}

export const createCriteriaToUpdate = (data: JobDataMap['criteriaToUpdate'], delay?: number) => {
    return createJob('criteriaToUpdate', { data, delay });
};

export const createCriteriaListToUpdate = (data: JobDataMap['criteriaListToUpdate'], delay?: number) => {
    return createJob('criteriaListToUpdate', { data, delay });
};
