import { useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Schema, z } from 'zod';
import { State, Tag as TagModel } from '@prisma/client';
import {
    Form,
    FormInput,
    FormActions,
    FormAction,
    ModalContent,
    Tag,
    TagCleanButton,
    nullable,
    Button,
} from '@taskany/bricks';
import { IconGitPullOutline, IconCalendarTickOutline } from '@taskany/icons';

import { FormEditor } from '../FormEditor/FormEditor';
import { errorsProvider } from '../../utils/forms';
import { formateEstimate } from '../../utils/dateTime';
import { DateType } from '../../types/date';
import { useLocale } from '../../hooks/useLocale';
import { Priority } from '../../types/priority';
import { UserComboBox } from '../UserComboBox';
import { GoalParentComboBox } from '../GoalParentComboBox';
import { TagComboBox } from '../TagComboBox';
import { StateDropdown } from '../StateDropdown';
import { PriorityDropdown } from '../PriorityDropdown';
import { ActivityByIdReturnType } from '../../../trpc/inferredTypes';
import { HelpButton } from '../HelpButton/HelpButton';
import { goalProjectSelectControl } from '../../utils/domObjects';

import { GoalFormEstimate } from './GoalFormEstimate';
import { tr } from './GoalForm.i18n';

const tagsLimit = 5;
interface GoalFormProps extends React.HTMLAttributes<HTMLDivElement> {
    actionButton: React.ReactNode;
    owner?: ActivityByIdReturnType;
    title?: string;
    description?: string;
    parent?: { id: string; title: string; flowId: string; description?: string | null };
    tags?: TagModel[];
    state?: State;
    priority?: Priority | string;
    estimate?: {
        date: string;
        type: DateType;
    };
    busy?: boolean;
    validitySchema: Schema;
    id?: string;
    tip?: React.ReactNode;

    onSumbit: (fields: z.infer<GoalFormProps['validitySchema']>) => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({
    id,
    title,
    description,
    owner,
    parent,
    tags = [],
    state,
    priority,
    estimate,
    busy,
    validitySchema,
    actionButton,
    tip,
    onSumbit,
    ...attrs
}) => {
    const locale = useLocale();
    const {
        control,
        register,
        handleSubmit,
        watch,
        setFocus,
        setValue,
        formState: { errors, isSubmitted },
    } = useForm<z.infer<typeof validitySchema>>({
        resolver: zodResolver(validitySchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        shouldFocusError: false,
        defaultValues: {
            title,
            description,
            owner,
            parent,
            state,
            priority,
            estimate,
            tags,
            id,
        },
    });

    const parentWatcher = watch('parent');
    const tagsWatcher: TagModel[] = watch('tags');
    const errorsResolver = errorsProvider(errors, isSubmitted);

    useEffect(() => {
        setTimeout(() => setFocus('title'), 0);
    }, [setFocus]);

    const onTagDeleteProvider = useCallback(
        (tag: Partial<TagModel>) => () => {
            const tags = tagsWatcher?.filter((t) => t.id !== tag.id);
            setValue('tags', tags);
        },
        [setValue, tagsWatcher],
    );

    return (
        <ModalContent {...attrs}>
            <Form onSubmit={handleSubmit(onSumbit)}>
                <FormInput
                    {...register('title')}
                    error={errorsResolver('title')}
                    placeholder={tr("Goal's title")}
                    autoFocus
                    flat="bottom"
                    disabled={busy}
                />

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <FormEditor
                            flat="both"
                            placeholder={tr('And its description')}
                            error={errorsResolver(field.name)}
                            disabled={busy}
                            {...field}
                        />
                    )}
                />

                <FormActions flat="top">
                    <FormAction left inline {...goalProjectSelectControl.attr}>
                        {nullable(!id, () => (
                            <Controller
                                name="parent"
                                control={control}
                                render={({ field }) => (
                                    <GoalParentComboBox
                                        text={tr('Enter project')}
                                        placeholder={tr('Enter project')}
                                        error={errorsResolver(field.name)}
                                        disabled={busy}
                                        {...field}
                                    />
                                )}
                            />
                        ))}

                        <Controller
                            name="priority"
                            control={control}
                            render={({ field }) => (
                                <PriorityDropdown
                                    text={tr('Priority')}
                                    error={errorsResolver(field.name)}
                                    disabled={busy}
                                    {...field}
                                />
                            )}
                        />

                        <Controller
                            name="owner"
                            control={control}
                            render={({ field }) => (
                                <UserComboBox
                                    text={tr('Assign')}
                                    placeholder={tr('Enter name or email')}
                                    error={errorsResolver(field.name)}
                                    disabled={busy}
                                    {...field}
                                />
                            )}
                        />

                        <Controller
                            name="estimate"
                            control={control}
                            render={({ field }) => {
                                return (
                                    <GoalFormEstimate
                                        placeholder={tr('Date input mask placeholder')}
                                        mask={tr('Date input mask')}
                                        placement="top"
                                        renderTrigger={(props) => (
                                            <Button
                                                onClick={props.onClick}
                                                disabled={busy}
                                                text={
                                                    field.value
                                                        ? formateEstimate(new Date(field.value.date), {
                                                              locale,
                                                              type: field.value.type,
                                                          })
                                                        : ''
                                                }
                                                iconLeft={<IconCalendarTickOutline size="xs" />}
                                            />
                                        )}
                                        error={errorsResolver(field.name)}
                                        {...field}
                                    />
                                );
                            }}
                        />

                        {parentWatcher?.flowId ? (
                            <Controller
                                name="state"
                                control={control}
                                render={({ field }) => (
                                    <StateDropdown
                                        text={tr('State')}
                                        flowId={parentWatcher.flowId}
                                        error={errorsResolver(field.name)}
                                        disabled={busy}
                                        {...field}
                                    />
                                )}
                            />
                        ) : (
                            <Button text={tr('State')} iconLeft={<IconGitPullOutline size="xs" />} disabled />
                        )}

                        <Controller
                            name="tags"
                            control={control}
                            render={({ field }) => (
                                <TagComboBox
                                    disabled={busy || (tagsWatcher || []).length >= tagsLimit}
                                    placeholder={tr('Enter tag title')}
                                    error={errorsResolver(field.name)}
                                    {...field}
                                />
                            )}
                        />

                        <HelpButton slug="goals" />
                    </FormAction>
                </FormActions>
                <FormActions flat="top">
                    <FormAction left>
                        {tagsWatcher.length ? (
                            <>
                                {tagsWatcher?.map((tag) => (
                                    <Tag key={tag.id}>
                                        <TagCleanButton onClick={onTagDeleteProvider(tag)} />
                                        {tag.title}
                                    </Tag>
                                ))}
                            </>
                        ) : (
                            tip
                        )}
                    </FormAction>
                    <FormAction right inline>
                        {actionButton}
                    </FormAction>
                </FormActions>
            </Form>
        </ModalContent>
    );
};
