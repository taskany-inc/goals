import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Schema, z } from 'zod';
import { State, Tag as TagModel } from '@prisma/client';
import { Form, nullable } from '@taskany/bricks';
import {
    FormControl,
    FormControlInput,
    FormControlError,
    Tag,
    TagCleanButton,
    ModalContent,
    Switch,
    SwitchControl,
} from '@taskany/bricks/harmony';

import { FormControlEditor } from '../FormControlEditor/FormControlEditor';
import { errorsProvider } from '../../utils/forms';
import { DateType } from '../../types/date';
import { TagComboBox } from '../TagComboBox/TagComboBox';
import { StateDropdown } from '../StateDropdown/StateDropdown';
import { PriorityDropdown } from '../PriorityDropdown/PriorityDropdown';
import { ActivityByIdReturnType } from '../../../trpc/inferredTypes';
import { HelpButton } from '../HelpButton/HelpButton';
import {
    combobox,
    estimateCombobox,
    goalDescriptionInput,
    goalTagList,
    goalTagListItem,
    goalTagListItemClean,
    goalTitleInput,
    goalTitleInputError,
    priorityCombobox,
    projectsCombobox,
    stateCombobox,
    usersCombobox,
} from '../../utils/domObjects';
import { TagsList } from '../TagsList/TagsList';
import { GoalParentDropdown } from '../GoalParentDropdown/GoalParentDropdown';
import { UserDropdown } from '../UserDropdown/UserDropdown';
import { EstimateDropdown } from '../EstimateDropdown/EstimateDropdown';
import { FormActions } from '../FormActions/FormActions';

import { tr } from './GoalForm.i18n';
import s from './GoalForm.module.css';

const goalTypeMap = {
    personal: 'personal',
    default: 'default',
} as const;

const tagsLimit = 5;
interface GoalFormProps extends React.HTMLAttributes<HTMLDivElement> {
    actionButton: React.ReactNode;
    owner?: ActivityByIdReturnType;
    title?: string;
    description?: string;
    parent?: { id: string; title: string; flowId: string; description?: string | null };
    personal?: boolean;
    tags?: TagModel[];
    state?: State;
    priority?: {
        id: string;
        title: string;
        value: number;
        default: boolean;
    };
    estimate?: {
        date: string;
        type: DateType;
    };
    busy?: boolean;
    validitySchema: Schema;
    id?: string;
    tip?: React.ReactNode;

    onSubmit: (fields: z.infer<GoalFormProps['validitySchema']>) => void;
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
    onSubmit,
    personal,
    ...attrs
}) => {
    const [goalType, setGoalType] = useState<keyof typeof goalTypeMap>(
        personal ? goalTypeMap.personal : goalTypeMap.default,
    );
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
        values: {
            title,
            description,
            owner,
            parent: personal ? null : parent,
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

    const onSwitchGoalType = useCallback(() => {
        setValue('state', undefined);

        if (goalType === goalTypeMap.default) {
            setValue('parent', null);
            setGoalType(goalTypeMap.personal);
            return;
        }

        setValue('parent', parent);
        setGoalType(goalTypeMap.default);
    }, [setValue, goalType, parent]);

    return (
        <ModalContent {...attrs}>
            <Form onSubmit={handleSubmit(onSubmit)} className={s.Form}>
                <div>
                    <FormControl>
                        <FormControlInput
                            {...register('title')}
                            disabled={busy}
                            autoFocus
                            placeholder={tr("Goal's title")}
                            brick="bottom"
                            size="m"
                            {...goalTitleInput.attr}
                        />
                        {nullable(errorsResolver('title'), (error) => (
                            <FormControlError error={error} {...goalTitleInputError.attr} />
                        ))}
                    </FormControl>

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <FormControl>
                                <FormControlEditor
                                    placeholder={tr('And its description')}
                                    disabled={busy}
                                    brick="top"
                                    height={200}
                                    {...field}
                                    {...goalDescriptionInput.attr}
                                />
                                {nullable(errorsResolver(field.name), (error) => (
                                    <FormControlError error={error} />
                                ))}
                            </FormControl>
                        )}
                    />
                </div>

                {nullable(tip || !id, () => (
                    <FormActions>
                        {nullable(!id, () => (
                            <div className={s.SwitchGoalType}>
                                <Switch value={goalType} onChange={onSwitchGoalType}>
                                    <SwitchControl text={tr('Project goal')} value={goalTypeMap.default} />
                                    <SwitchControl text={tr('Personal goal')} value={goalTypeMap.personal} />
                                </Switch>
                                <HelpButton slug="goals" />
                            </div>
                        ))}
                        {nullable(tip, () => (
                            <div className={s.FormTip}>{tip}</div>
                        ))}
                    </FormActions>
                ))}

                <FormActions className={s.FormActions} {...combobox.attr}>
                    {nullable(!id && goalType === 'default', () => (
                        <Controller
                            name="parent"
                            control={control}
                            render={({ field }) => (
                                <GoalParentDropdown
                                    label="Project"
                                    placeholder={tr('Enter project')}
                                    error={errorsResolver(field.name)}
                                    disabled={busy}
                                    {...field}
                                    {...projectsCombobox.attr}
                                />
                            )}
                        />
                    ))}

                    <Controller
                        name="owner"
                        control={control}
                        render={({ field }) => (
                            <UserDropdown
                                label="Owner"
                                placeholder={tr('Enter name or email')}
                                error={errorsResolver(field.name)}
                                disabled={busy}
                                {...usersCombobox.attr}
                                {...field}
                            />
                        )}
                    />

                    <Controller
                        name="priority"
                        control={control}
                        render={({ field }) => (
                            <PriorityDropdown
                                label="Priority"
                                error={errorsResolver(field.name)}
                                disabled={busy}
                                {...priorityCombobox.attr}
                                {...field}
                            />
                        )}
                    />

                    <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                            <StateDropdown
                                label="State"
                                flowId={parentWatcher?.flowId}
                                error={errorsResolver(field.name)}
                                disabled={(goalType === 'default' && !parentWatcher?.flowId) || busy}
                                {...stateCombobox.attr}
                                {...field}
                            />
                        )}
                    />

                    <Controller
                        name="estimate"
                        control={control}
                        render={({ field }) => {
                            return (
                                <EstimateDropdown
                                    label="Estimate"
                                    error={errorsResolver(field.name)}
                                    {...field}
                                    {...estimateCombobox.attr}
                                />
                            );
                        }}
                    />
                </FormActions>

                <FormActions className={s.FormActions}>
                    <TagsList {...goalTagList.attr}>
                        {tagsWatcher.map((tag) => (
                            <Tag
                                key={tag.id}
                                {...goalTagListItem.attr}
                                action={
                                    <TagCleanButton onClick={onTagDeleteProvider(tag)} {...goalTagListItemClean.attr} />
                                }
                            >
                                {tag.title}
                            </Tag>
                        ))}
                        <Controller
                            name="tags"
                            control={control}
                            render={({ field }) => (
                                <TagComboBox
                                    placeholder={tr('Enter tag title')}
                                    disabled={busy || (tagsWatcher || []).length >= tagsLimit}
                                    {...combobox.attr}
                                    {...field}
                                />
                            )}
                        />
                    </TagsList>

                    {actionButton}
                </FormActions>
            </Form>
        </ModalContent>
    );
};
