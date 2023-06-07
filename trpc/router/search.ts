import { z } from 'zod';

import { prisma } from '../../src/utils/prisma';
import { protectedProcedure, router } from '../trpcBackend';
import { addCalclulatedGoalsFields, goalDeepQuery } from '../queries/goals';

export const search = router({
    global: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
        const [goals, projects] = await Promise.all([
            prisma.goal.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                contains: input,
                                mode: 'insensitive',
                            },
                        },
                        {
                            description: {
                                contains: input,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
                include: {
                    ...goalDeepQuery,
                },
            }),
            prisma.project.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                contains: input,
                                mode: 'insensitive',
                            },
                        },
                        {
                            description: {
                                contains: input,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
                include: {
                    activity: {
                        include: {
                            user: true,
                            ghost: true,
                        },
                    },
                },
            }),
        ]);

        return {
            goals: goals.map((g) => ({
                ...g,
                ...addCalclulatedGoalsFields(g, ctx.session.user.activityId),
            })),
            projects,
        };
    }),
});
