import { z } from 'zod';

import { tr } from './schema.i18n';
import { queryWithFiltersSchema } from './common';

export const projectDeepInfoSchema = queryWithFiltersSchema.extend({
    id: z.string(),
});

export const projectSuggestionsSchema = z.object({
    query: z.string(),
    take: z.number().optional(),
    include: z.array(z.string()).optional(),
});

export type ProjectDeepInfo = z.infer<typeof projectDeepInfoSchema>;

export const projectCreateSchema = z.object({
    id: z.string().min(3),
    title: z
        .string({
            required_error: tr('Title is required'),
            invalid_type_error: tr('Title must be a string'),
        })
        .min(2, {
            message: tr('Title must be longer than 2 symbols'),
        })
        .max(50, {
            message: tr('Title can be 50 symbols maximum'),
        }),
    description: z.string().optional(),
    flow: z.object({
        id: z.string(),
    }),
});

export type ProjectCreate = z.infer<typeof projectCreateSchema>;

export const projectUpdateSchema = z.object({
    id: z.string(),
    title: z
        .string({
            required_error: tr('Title is required'),
            invalid_type_error: tr('Title must be a string'),
        })
        .min(2, {
            message: tr('Title must be longer than 2 symbols'),
        }),
    description: z.string().nullable().optional(),
    parent: z
        .array(
            z.object({
                id: z.string(),
                title: z.string(),
            }),
        )
        .optional(),
    accessUsers: z
        .array(
            z.object({
                id: z.string(),
            }),
        )
        .optional(),
});

export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;

export const projectTransferOwnershipSchema = z.object({
    id: z.string(),
    activityId: z.string(),
});

export type ProjectTransferOwnership = z.infer<typeof projectTransferOwnershipSchema>;

export const projectDeleteSchema = z.object({
    id: z.string(),
});

export const participantsToProjectSchema = z.object({
    id: z.string(),
    participants: z.array(z.string()),
});

export const teamsToProjectSchema = z.object({
    id: z.string(),
    teams: z.array(z.string()),
});

export type TeamsUpdate = z.infer<typeof teamsToProjectSchema>;

export type ParticipantsToProject = z.infer<typeof participantsToProjectSchema>;
