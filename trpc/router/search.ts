import { z } from 'zod';

import { prisma } from '../../src/utils/prisma';
import { protectedProcedure, router } from '../trpcBackend';
import { addCalclulatedGoalsFields, goalDeepQuery } from '../queries/goals';
import { nonArchivedPartialQuery } from '../queries/project';

export const search = router({
    global: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
        const { activityId, role } = ctx.session.user;

        const [goals, projects] = await Promise.all([
            prisma.goal.findMany({
                take: 5,
                where: {
                    AND: [
                        {
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
                        {
                            archived: {
                                not: true,
                            },
                        },
                    ],
                },
                include: {
                    ...goalDeepQuery,
                    estimate: {
                        include: {
                            estimate: true,
                        },
                    },
                },
            }),
            prisma.project.findMany({
                take: 5,
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
                    AND: [{ ...nonArchivedPartialQuery }],
                },
                include: {
                    activity: {
                        include: {
                            user: true,
                            ghost: true,
                        },
                    },
                    _count: {
                        select: {
                            children: true,
                        },
                    },
                },
            }),
        ]);

        return {
            goals: goals.map((g) => ({
                ...g,
                ...addCalclulatedGoalsFields(g, activityId, role),
            })),
            projects,
        };
    }),
});
