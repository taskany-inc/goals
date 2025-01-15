import { createComment } from '../db/createComment';

import * as emailTemplates from './mail/templates';
import { sendMail } from './mail';
import { JobDataMap } from './create';
import { goalPingJob } from './goalPingJob';
import { externalTasksJob, makeCriteriaQueue, shiftCriteriaFromQueue } from './externalTasksJob';

interface JobHandler<K extends keyof JobDataMap> {
    (value: JobDataMap[K]): Promise<void> | void;
}

export const email: JobHandler<'email'> = async ({ template, data }) => {
    const renderedTemplate = await emailTemplates[template](data);
    sendMail(renderedTemplate);
};

export const cron: JobHandler<'cron'> = async ({ template }) => {
    switch (template) {
        // case 'externalTaskCheck':
        //     externalTaskCheckJob();
        //     break;
        case 'makeCriteriaQueue':
            makeCriteriaQueue();
            break;
        case 'goalPing':
            goalPingJob();
            break;
        default:
            throw new Error('No supported cron jobs');
    }
};

export const comment: JobHandler<'comment'> = async ({ activityId, description, goalId }) => {
    await createComment({
        description,
        activityId,
        goalId,
        role: 'USER',
        shouldUpdateGoal: false,
    });
};

export const criteriaToUpdate: JobHandler<'criteriaToUpdate'> = async ({ id }) => {
    await externalTasksJob(id);
};

export const criteriaListToUpdate: JobHandler<'criteriaListToUpdate'> = async ({ ids }) => {
    return shiftCriteriaFromQueue(ids);
};
