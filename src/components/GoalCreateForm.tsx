import { useContext } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import styled from 'styled-components';

import { gql } from '../utils/gql';
import { gapS, gray6, star0 } from '../design/@generated/themes';
import { Activity } from '../../graphql/@generated/genql';
import { routes } from '../hooks/router';
import { TLocale } from '../types/locale';

import { Icon } from './Icon';
import { Tip } from './Tip';
import { Keyboard } from './Keyboard';
import { GoalForm, GoalFormType } from './GoalForm';
import { Link } from './Link';
import { modalOnEventContext } from './ModalOnEvent';

interface GoalCreateFormProps {
    locale: TLocale;

    onCreate: (id?: string) => void;
}

const StyledFormBottom = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    padding: ${gapS} ${gapS} 0 ${gapS};
`;

const GoalCreateForm: React.FC<GoalCreateFormProps> = ({ locale, onCreate }) => {
    const t = useTranslations('goals.new');
    const { data: session } = useSession();
    const modalOnEventProps = useContext(modalOnEventContext);

    const createGoal = async (form: GoalFormType) => {
        const promise = gql.mutation({
            createGoal: [
                {
                    data: {
                        title: form.title,
                        description: form.description,
                        ownerId: form.owner.id,
                        projectId: form.project.id,
                        stateId: form.state.id,
                        priority: form.priority,
                        tags: form.tags,
                        estimate: form.estimate,
                    },
                },
                {
                    id: true,
                },
            ],
        });

        toast.promise(promise, {
            error: t('Something went wrong 😿'),
            loading: t('We are creating new goal'),
            success: t('Voila! Goal is here 🎉'),
        });

        const res = await promise;

        onCreate(res.createGoal?.id);
    };

    return (
        <GoalForm
            i18nKeyset="goals.new"
            formTitle={t('Create new goal')}
            locale={locale}
            owner={{ id: session?.user.activityId, user: session?.user } as Partial<Activity>}
            project={modalOnEventProps}
            priority="Medium"
            onSumbit={createGoal}
        >
            <StyledFormBottom>
                <Tip title={t('Pro tip!')} icon={<Icon type="bulbOn" size="s" color={star0} />}>
                    {t.rich('Press key to create the goal', {
                        key: () => <Keyboard command enter />,
                    })}
                </Tip>

                <Link href={routes.help(locale, 'goals')}>
                    <Icon type="question" size="s" color={gray6} />
                </Link>
            </StyledFormBottom>
        </GoalForm>
    );
};

export default GoalCreateForm;
