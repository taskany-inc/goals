import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { ProjectCreate, ProjectUpdate } from '../../schema/project';
import { trpc } from '../../utils/trpcClient';
import { ProjectUpdateReturnType } from '../../../trpc/inferredTypes';

import { tr } from './useProjectResource.i18n';

type Callback<A = []> = (...args: A[]) => void;

export const useProjectResource = (id: string) => {
    const utils = trpc.useContext();
    const createMutation = trpc.project.create.useMutation();
    const updateMutation = trpc.project.update.useMutation();
    const deleteMutation = trpc.project.delete.useMutation();
    const toggleWatcherMutation = trpc.project.toggleWatcher.useMutation();
    const toggleStargizerMutation = trpc.project.toggleStargizer.useMutation();
    const transferOwnershipMutation = trpc.project.transferOwnership.useMutation();

    const createProject = useCallback(
        (cb: Callback<string>) => async (form: ProjectCreate) => {
            const promise = createMutation.mutateAsync(form);

            toast.promise(promise, {
                error: tr('Something went wrong 😿'),
                loading: tr('We are creating something new'),
                success: tr("Voila! It's here 🎉"),
            });

            const res = await promise;

            res && cb(res.id);
        },
        [createMutation],
    );

    const updateProject = useCallback(
        (cb?: Callback<ProjectUpdateReturnType>) => async (data: ProjectUpdate) => {
            const promise = updateMutation.mutateAsync(data);

            toast.promise(promise, {
                error: tr('Something went wrong 😿'),
                loading: tr('We are updating project settings'),
                success: tr('Voila! Successfully updated 🎉'),
            });

            const res = await promise;

            utils.project.getById.invalidate(id);

            res && cb?.(res);
        },
        [id, updateMutation, utils],
    );

    const deleteProject = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (cb: Callback) => async () => {
            const res = await deleteMutation.mutateAsync(id);

            res && cb();
        },
        [id, deleteMutation],
    );

    const toggleProjectWatching = useCallback(
        (cb: Callback, watcher?: boolean) => async () => {
            const promise = toggleWatcherMutation.mutateAsync({
                id,
                direction: !watcher,
            });

            toast.promise(promise, {
                error: tr('Something went wrong 😿'),
                loading: tr('We are calling owner'),
                success: !watcher ? tr('Voila! You are watcher now 🎉') : tr('So sad! Project will miss you'),
            });

            cb();

            await promise;
        },
        [id, toggleWatcherMutation],
    );

    const toggleProjectStar = useCallback(
        (cb: Callback, stargizer?: boolean) => async () => {
            const promise = toggleStargizerMutation.mutateAsync({
                id,
                direction: !stargizer,
            });

            toast.promise(promise, {
                error: tr('Something went wrong 😿'),
                loading: tr('We are calling owner'),
                success: !stargizer ? tr('Voila! You are stargizer now 🎉') : tr('So sad! Project will miss you'),
            });

            cb();

            await promise;
        },
        [id, toggleStargizerMutation],
    );

    const transferOwnership = useCallback(
        (cb: Callback, activityId: string) => async () => {
            const promise = transferOwnershipMutation.mutateAsync({
                id,
                activityId,
            });

            toast.promise(promise, {
                error: tr('Something went wrong 😿'),
                loading: tr('We are calling owner'),
                success: tr('So sad! Project will miss you'),
            });

            const res = await promise;

            res && cb();
        },
        [id, transferOwnershipMutation],
    );

    return {
        createProject,
        updateProject,
        deleteProject,
        toggleProjectWatching,
        toggleProjectStar,
        transferOwnership,
    };
};
