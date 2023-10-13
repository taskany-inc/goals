import { StateType } from '@prisma/client';
import { z } from 'zod';

export const ToggleSubscriptionSchema = z.object({
    id: z.string().nullish(),
    direction: z.boolean().nullish(),
});

export const StateTypeEnum = z.nativeEnum(StateType);

export type ToggleSubscription = z.infer<typeof ToggleSubscriptionSchema>;

const sortDirectionValue = z.enum(['asc', 'desc']).nullish();

export const sortablePropertiesSchema = z
    .object({
        title: sortDirectionValue,
        state: sortDirectionValue,
        priority: sortDirectionValue,
        project: sortDirectionValue,
        activity: sortDirectionValue,
        owner: sortDirectionValue,
        updatedAt: sortDirectionValue,
        createdAt: sortDirectionValue,
    })
    .optional();

export const queryWithFiltersSchema = z.object({
    priority: z.array(z.string()).optional(),
    state: z.array(z.string()).optional(),
    stateType: z.array(StateTypeEnum).optional(),
    tag: z.array(z.string()).optional(),
    estimate: z.array(z.string()).optional(),
    issuer: z.array(z.string()).optional(),
    owner: z.array(z.string()).optional(),
    participant: z.array(z.string()).optional(),
    project: z.array(z.string()).optional(),
    sort: sortablePropertiesSchema,
    query: z.string().optional(),
    starred: z.boolean().optional(),
    watching: z.boolean().optional(),
});

export type QueryWithFilters = z.infer<typeof queryWithFiltersSchema>;

export const suggestionsQuerySchema = z.object({
    limit: z.number().optional(),
    input: z.string(),
});

export type SuggestionsQuerySchema = z.infer<typeof suggestionsQuerySchema>;

export const batchGoalsSchema = z.object({
    query: queryWithFiltersSchema.optional(),
    limit: z.number(),
    cursor: z.string().nullish(),
    skip: z.number().optional(),
});

export type BatchGoalsSchema = z.infer<typeof batchGoalsSchema>;
