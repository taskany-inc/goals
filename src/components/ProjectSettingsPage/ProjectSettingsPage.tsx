import { ChangeEvent, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import { gapM, gapS, gapXs, gray3, gray8, gray9, warn0 } from '@taskany/colors';
import {
    Text,
    Fieldset,
    Form,
    FormAction,
    FormActions,
    FormTitle,
    FormMultiInput,
    ModalHeader,
    ModalContent,
    nullable,
    UserPic,
    Tag,
    Tip,
    FormControl,
    FormControlInput,
    FormControlLabel,
    FormControlError,
} from '@taskany/bricks';
import { IconExclamationCircleSolid, IconPlusCircleOutline, IconXSolid } from '@taskany/icons';
import { Button } from '@taskany/bricks/harmony';

import { ExternalPageProps } from '../../utils/declareSsrProps';
import { PageSep } from '../PageSep';
import { useRouter } from '../../hooks/router';
import { SettingsCard, SettingsContent } from '../SettingsContent';
import { dispatchModalEvent, ModalEvent } from '../../utils/dispatchModal';
import { Page } from '../Page';
import { useProjectResource } from '../../hooks/useProjectResource';
import { errorsProvider } from '../../utils/forms';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { UserComboBox } from '../UserComboBox';
import { trpc } from '../../utils/trpcClient';
import { ProjectUpdate, projectUpdateSchema } from '../../schema/project';
import { ActivityByIdReturnType, ProjectUpdateReturnType } from '../../../trpc/inferredTypes';
import { TextList, TextListItem } from '../TextList';
import { CommonHeader } from '../CommonHeader';
import {
    projectSettingsCancelDeleteProjectButton,
    projectSettingsConfirmDeleteProjectButton,
    projectSettingsDeleteProjectInput,
    projectSettingsContent,
    projectSettingsDeleteProjectButton,
    projectSettingsDescriptionInput,
    projectSettingsParentMultiInput,
    projectSettingsSaveButton,
    projectSettingsTitleInput,
    projectSettingsDeleteForm,
    projectSettingsTransferForm,
    projectSettingsTransferProjectKeyInput,
    projectSettingsTransferProjectOwnerButton,
    projectSettingsConfirmTransferProjectButton,
    projectSettingsCancelTransferProjectButton,
    projectSettingsTransferProjectButton,
    projectSettingsParentMultiInputTrigger,
    projectSettingsParentMultiInputTagClean,
    pageHeader,
} from '../../utils/domObjects';
import { safeUserData } from '../../utils/getUserName';
import { ProjectPageTabs } from '../ProjectPageTabs/ProjectPageTabs';
import { ProjectAccessUser } from '../ProjectAccessUser/ProjectAccessUser';
import { AccessUserDeleteErrorModal } from '../AccessUserDeleteErrorModal/AccessUserDeleteErrorModal';
import { ProjectParticipants } from '../ProjectParticipants/ProjectParticipants';

import { tr } from './ProjectSettingsPage.i18n';

const ModalOnEvent = dynamic(() => import('../ModalOnEvent'));

const StyledTip = styled(Tip)`
    padding: ${gapS} 0;
`;

const StyledModalActions = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
`;

const StyledTag = styled(Tag)`
    display: flex;
    gap: ${gapXs};

    :not(:last-of-type) {
        margin-right: ${gapXs};
    }
`;

const StyledTextList = styled(TextList)`
    margin-left: ${gapM};
`;

const StyledTextListItem = styled(TextListItem)`
    margin-left: ${gapXs};
`;

const StyledFormControl = styled(FormControl).attrs({ size: 'l' })`
    flex-direction: row;
    align-items: center;
    gap: 0;
    background-color: ${gray3};
`;

const StyledFormControlLabel = styled(FormControlLabel).attrs({
    size: 'm',
    weight: 'bold',
    color: gray8,
})`
    padding: ${gapS};
    padding-left: ${gapM};
`;

export const ProjectSettingsPage = ({ user, ssrTime, params: { id } }: ExternalPageProps) => {
    const router = useRouter();
    const [lastProjectCache, setLastProjectCache] = useLocalStorage('lastProjectCache');
    const [currentProjectCache, setCurrentProjectCache] = useLocalStorage('currentProjectCache');
    const [recentProjectsCache, setRecentProjectsCache] = useLocalStorage('recentProjectsCache', {});

    const project = trpc.project.getById.useQuery({ id });

    const { updateProject, deleteProject, transferOwnership } = useProjectResource(id);

    const {
        handleSubmit,
        reset,
        register,
        control,
        formState: { errors, isSubmitted, isDirty },
    } = useForm<ProjectUpdate>({
        resolver: zodResolver(projectUpdateSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        shouldFocusError: true,
        defaultValues: {
            id: project.data?.id,
            title: project.data?.title,
            description: project.data?.description,
            parent: project.data?.parent,
        },
    });

    const errorsResolver = errorsProvider(errors, isSubmitted);

    const onProjectUpdate = useCallback(
        (data: ProjectUpdateReturnType) => {
            reset({
                id: data?.id,
                title: data?.title,
                description: data?.description,
                parent: data?.parent,
            });
        },
        [reset],
    );

    const [keyConfirmation, setKeyConfirmation] = useState('');
    const [transferTo, setTransferTo] = useState<NonNullable<ActivityByIdReturnType> | undefined>();

    const onConfirmationInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setKeyConfirmation(e.currentTarget.value);
    }, []);

    const onDeleteCancel = useCallback(() => {
        setKeyConfirmation('');
        dispatchModalEvent(ModalEvent.ProjectDeleteModal)();
    }, []);

    const onTransferCancel = useCallback(() => {
        setKeyConfirmation('');
        setTransferTo(undefined);
        dispatchModalEvent(ModalEvent.ProjectTransferModal)();
    }, []);

    const onProjectDelete = useCallback(() => {
        if (!project.data) return;

        const newRecentProjectsCache = { ...recentProjectsCache };
        if (recentProjectsCache[project.data.id]) {
            delete newRecentProjectsCache[project.data.id];
            setRecentProjectsCache(newRecentProjectsCache);
        }

        if (currentProjectCache?.id === project.data.id) {
            setCurrentProjectCache(null);
        }

        if (lastProjectCache?.id === project.data.id) {
            setLastProjectCache(null);
        }

        router.exploreProjects();
    }, [
        router,
        project.data,
        recentProjectsCache,
        currentProjectCache,
        lastProjectCache,
        setRecentProjectsCache,
        setCurrentProjectCache,
        setLastProjectCache,
    ]);

    const handleDeleteProjectBtnClick = useCallback(() => {
        if (project.data?.children.length) {
            dispatchModalEvent(ModalEvent.ProjectCannotDeleteModal)();
            return;
        }

        dispatchModalEvent(ModalEvent.ProjectDeleteModal)();
    }, [project.data?.children]);

    const onTransferToChange = useCallback((a: NonNullable<ActivityByIdReturnType>) => {
        setTransferTo(a);
    }, []);
    const onProjectTransferOwnership = useCallback(() => {
        if (!project.data) return;

        router.project(project.data.id);
    }, [router, project.data]);

    const projectParentIds = project.data?.parent?.map((p) => p.id) ?? [];
    const [parentQuery, setParentQuery] = useState('');
    const suggestions = trpc.project.suggestions.useQuery({
        query: parentQuery,
    });

    const pageTitle = tr
        .raw('title', {
            project: project.data?.title,
        })
        .join('');

    if (!project.data) return null;

    return (
        <Page user={user} ssrTime={ssrTime} title={pageTitle}>
            <CommonHeader title={project.data.title} description={project.data.description} {...pageHeader.attr}>
                <ProjectPageTabs id={id} editable />
            </CommonHeader>

            <PageSep />

            <SettingsContent {...projectSettingsContent.attr}>
                <SettingsCard>
                    <Form onSubmit={handleSubmit(updateProject(onProjectUpdate))}>
                        <Fieldset title={tr('General')}>
                            <StyledFormControl flat="bottom">
                                <StyledFormControlLabel>{tr('key')}:</StyledFormControlLabel>
                                <FormControlInput
                                    {...register('id')}
                                    disabled
                                    defaultValue={project.data.id}
                                    autoComplete="off"
                                />
                            </StyledFormControl>

                            <StyledFormControl flat="bottom">
                                <StyledFormControlLabel>{tr('Title')}:</StyledFormControlLabel>
                                <FormControlInput
                                    {...register('title')}
                                    defaultValue={project.data.title}
                                    autoComplete="off"
                                    {...projectSettingsTitleInput.attr}
                                />
                                {nullable(errorsResolver('title'), (error) => (
                                    <FormControlError error={error} />
                                ))}
                            </StyledFormControl>

                            <StyledFormControl flat="both">
                                <StyledFormControlLabel>{tr('Description')}:</StyledFormControlLabel>
                                <FormControlInput
                                    {...register('description')}
                                    defaultValue={project.data?.description ?? undefined}
                                    {...projectSettingsDescriptionInput.attr}
                                />
                                {nullable(errorsResolver('description'), (error) => (
                                    <FormControlError error={error} />
                                ))}
                            </StyledFormControl>

                            <Controller
                                name="parent"
                                control={control}
                                render={({ field }) => (
                                    <FormMultiInput
                                        label={tr('Parent')}
                                        query={parentQuery}
                                        // FIXME: move filter to server
                                        items={suggestions.data?.filter((p) => !projectParentIds.includes(p.id))}
                                        onInput={(q) => setParentQuery(q)}
                                        renderTrigger={(props) => (
                                            <IconPlusCircleOutline
                                                size="xs"
                                                onClick={props.onClick}
                                                {...projectSettingsParentMultiInputTrigger.attr}
                                            />
                                        )}
                                        renderInput={(props) => (
                                            <FormControl variant="outline">
                                                <FormControlInput autoFocus {...props} />
                                            </FormControl>
                                        )}
                                        renderItem={(item) => (
                                            <StyledTag key={item.id}>
                                                {item.title}
                                                <IconXSolid
                                                    size="xxs"
                                                    onClick={item.onClick}
                                                    {...projectSettingsParentMultiInputTagClean.attr}
                                                />
                                            </StyledTag>
                                        )}
                                        {...field}
                                        {...projectSettingsParentMultiInput.attr}
                                    />
                                )}
                            />
                        </Fieldset>

                        <FormActions flat="top">
                            <FormAction left />
                            <FormAction right inline>
                                <Button
                                    view="primary"
                                    type="submit"
                                    disabled={!isDirty}
                                    text={tr('Save')}
                                    {...projectSettingsSaveButton.attr}
                                />
                            </FormAction>
                        </FormActions>
                    </Form>
                </SettingsCard>

                <ProjectAccessUser project={project.data} />

                <ProjectParticipants id={project.data.id} participants={project.data.participants} />

                <SettingsCard view="warning">
                    <Form>
                        <Fieldset title={tr('Danger zone')} view="warning">
                            <FormActions flat="top">
                                <FormAction left inline>
                                    <Text color={gray9} style={{ paddingLeft: gapS }}>
                                        {tr('Be careful — all data will be lost')}
                                    </Text>
                                </FormAction>
                                <FormAction right inline>
                                    <Button
                                        onClick={handleDeleteProjectBtnClick}
                                        view="warning"
                                        text={tr('Delete project')}
                                        {...projectSettingsDeleteProjectButton.attr}
                                    />
                                </FormAction>
                            </FormActions>

                            <FormActions flat="top">
                                <FormAction left>
                                    <Text color={gray9} style={{ paddingLeft: gapS }}>
                                        {tr('Transfer project to other person')}
                                    </Text>
                                </FormAction>
                                <FormAction right inline>
                                    <Button
                                        onClick={dispatchModalEvent(ModalEvent.ProjectTransferModal)}
                                        view="warning"
                                        text={tr('Transfer ownership')}
                                        {...projectSettingsTransferProjectButton.attr}
                                    />
                                </FormAction>
                            </FormActions>
                        </Fieldset>
                    </Form>
                </SettingsCard>
            </SettingsContent>

            <AccessUserDeleteErrorModal />

            <ModalOnEvent view="warn" event={ModalEvent.ProjectDeleteModal}>
                <ModalHeader>
                    <FormTitle color={warn0}>{tr('You are trying to delete project')}</FormTitle>
                </ModalHeader>

                <ModalContent>
                    <SettingsCard view="warning">
                        <StyledTip view="warning" icon={<IconExclamationCircleSolid size="s" />}>
                            <Text as="span" weight="bold" size="s" color="inherit">
                                {tr('What happens when you delete a project')}:
                            </Text>
                        </StyledTip>

                        <StyledTextList type="unordered">
                            <StyledTextListItem>
                                <Text size="s">{tr('All active goals will be archived')};</Text>
                            </StyledTextListItem>
                            <StyledTextListItem>
                                <Text size="s">{tr('Criteria as project goals will be removed')};</Text>
                            </StyledTextListItem>
                            <StyledTextListItem>
                                <Text size="s">
                                    {tr(
                                        'Criteria-affected goals will be recalculated as progress towards meeting the criteria',
                                    )}
                                    ;
                                </Text>
                            </StyledTextListItem>
                            <StyledTextListItem>
                                <Text size="s">
                                    {tr(
                                        'For affected projects, average progress across all goals will be recalculated',
                                    )}
                                    .
                                </Text>
                            </StyledTextListItem>
                        </StyledTextList>
                    </SettingsCard>
                    <br />
                    <Text>
                        {tr.raw('To confirm deleting project {project} please type project key {key} below.', {
                            project: <b key={project.data.title}>{project.data.title}</b>,
                            key: <b key={project.data.id}>{project.data.id}</b>,
                        })}
                    </Text>

                    <br />

                    <Form {...projectSettingsDeleteForm.attr}>
                        <FormControl flat="bottom" size="l">
                            <FormControlInput
                                placeholder={tr('Project key')}
                                autoComplete="off"
                                onChange={onConfirmationInputChange}
                                {...projectSettingsDeleteProjectInput.attr}
                            />
                        </FormControl>

                        <FormActions flat="top">
                            <FormAction left />
                            <FormAction right inline>
                                <Button
                                    text={tr('Cancel')}
                                    onClick={onDeleteCancel}
                                    {...projectSettingsCancelDeleteProjectButton.attr}
                                />
                                <Button
                                    view="warning"
                                    disabled={keyConfirmation !== project.data.id}
                                    onClick={deleteProject(onProjectDelete)}
                                    text={tr('Yes, delete it')}
                                    {...projectSettingsConfirmDeleteProjectButton.attr}
                                />
                            </FormAction>
                        </FormActions>
                    </Form>
                </ModalContent>
            </ModalOnEvent>

            <ModalOnEvent view="warn" event={ModalEvent.ProjectTransferModal}>
                <ModalHeader>
                    <FormTitle color={warn0}>{tr('You are trying to transfer project ownership')}</FormTitle>
                </ModalHeader>

                <ModalContent>
                    <Text>
                        {tr.raw(
                            'To confirm transfering {project} ownership please type project key {key} and select new owner below.',
                            {
                                project: <b key={project.data.title}>{project.data.title}</b>,
                                key: <b key={project.data.id}>{project.data.id}</b>,
                            },
                        )}
                    </Text>

                    <br />

                    <Form {...projectSettingsTransferForm.attr}>
                        <FormControl flat="bottom" size="l">
                            <FormControlInput
                                placeholder={tr('Project key')}
                                autoComplete="off"
                                onChange={onConfirmationInputChange}
                                {...projectSettingsTransferProjectKeyInput.attr}
                            />
                        </FormControl>
                        <FormActions flat="top">
                            <FormAction left>
                                <UserComboBox
                                    text={tr('New project owner')}
                                    placeholder={tr('Enter name or email')}
                                    value={transferTo}
                                    onChange={onTransferToChange}
                                    renderTrigger={(props) => (
                                        <Button
                                            text={props.text}
                                            disabled={props.disabled}
                                            onClick={props.onClick}
                                            iconLeft={nullable(safeUserData(transferTo), ({ image, email, name }) => (
                                                <UserPic src={image} email={email} name={name} size={16} />
                                            ))}
                                            {...projectSettingsTransferProjectOwnerButton.attr}
                                        />
                                    )}
                                />
                            </FormAction>
                            <FormAction right inline>
                                <Button
                                    text={tr('Cancel')}
                                    onClick={onTransferCancel}
                                    {...projectSettingsCancelTransferProjectButton.attr}
                                />
                                <Button
                                    view="warning"
                                    disabled={!transferTo || keyConfirmation !== project.data.id}
                                    onClick={
                                        transferTo
                                            ? transferOwnership(onProjectTransferOwnership, transferTo.id)
                                            : undefined
                                    }
                                    text={tr('Transfer ownership')}
                                    {...projectSettingsConfirmTransferProjectButton.attr}
                                />
                            </FormAction>
                        </FormActions>
                    </Form>
                </ModalContent>
            </ModalOnEvent>

            <ModalOnEvent view="warn" event={ModalEvent.ProjectCannotDeleteModal}>
                <ModalHeader>
                    <FormTitle color={warn0}>{tr('Cannot delete project now')}</FormTitle>
                </ModalHeader>
                <ModalContent>
                    <StyledTip view="warning" icon={<IconExclamationCircleSolid size="s" />}>
                        {tr('The project has child projects')}
                    </StyledTip>
                    <Text size="s">{tr('Before delete a project, you must move it to another project or delete')}</Text>
                    <StyledModalActions>
                        <Button
                            view="warning"
                            text={tr('Ok, got it')}
                            onClick={dispatchModalEvent(ModalEvent.ProjectCannotDeleteModal)}
                        />
                    </StyledModalActions>
                </ModalContent>
            </ModalOnEvent>
        </Page>
    );
};
