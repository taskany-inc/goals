import { gql } from '../utils/gql';
import { notifyPromise } from '../utils/notifyPromise';
import { CreateFormType } from '../schema/filter';
import { FilterInput, SubscriptionToggleInput } from '../../graphql/@generated/genql';

export const useFilterResource = () => {
    const createFilter = (data: CreateFormType) =>
        notifyPromise(
            gql.mutation({
                createFilter: [
                    {
                        data,
                    },
                    {
                        id: true,
                    },
                ],
            }),
            {
                onPending: 'We are saving your filter...',
                onSuccess: 'Voila! Saved successfully 🎉! Use and share it with teammates 😉',
                onError: 'Something went wrong 😿',
            },
        );

    const toggleFilterStar = (data: SubscriptionToggleInput) =>
        notifyPromise(
            gql.mutation({
                toggleFilterStargizer: [
                    {
                        data,
                    },
                    {
                        id: true,
                    },
                ],
            }),
            {
                onPending: 'We are calling owner...',
                onSuccess: data.direction ? 'Voila! You are stargizer now 🎉' : 'So sad! We will miss you',
                onError: 'Something went wrong 😿',
            },
        );

    const deleteFilter = (data: FilterInput) =>
        notifyPromise(
            gql.mutation({
                deleteFilter: [
                    {
                        data,
                    },
                    {
                        id: true,
                    },
                ],
            }),
            {
                onPending: 'We are deleting your filter...',
                onSuccess: 'Deleted successfully 🎉!',
                onError: 'Something went wrong 😿',
            },
        );

    return {
        createFilter,
        toggleFilterStar,
        deleteFilter,
    };
};
