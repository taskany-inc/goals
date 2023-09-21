import { useMemo, useState } from 'react';
import { Button } from '@taskany/bricks';
import { gray10 } from '@taskany/colors';
import { IconBulbOnOutline } from '@taskany/icons';

import { GoalForm } from '../GoalForm/GoalForm';
import { GoalUpdateReturnType, GoalByIdReturnType } from '../../../trpc/inferredTypes';
import { GoalUpdate, goalUpdateSchema } from '../../schema/goal';
import { ModalEvent, dispatchModalEvent } from '../../utils/dispatchModal';
import { Tip } from '../Tip';
import { Keyboard } from '../Keyboard';
import { trpc } from '../../utils/trpcClient';
import { useGoalResource } from '../../hooks/useGoalResource';

import { tr } from './GoalEditForm.i18n';

interface GoalEditFormProps {
    goal: NonNullable<GoalByIdReturnType>;

    onSubmit: (goal?: GoalUpdateReturnType) => void;
}

const GoalEditForm: React.FC<GoalEditFormProps> = ({ goal, onSubmit }) => {
    const [busy, setBusy] = useState(false);
    const { invalidate, goalUpdate } = useGoalResource(
        {
            id: goal.id,
        },
        {
            invalidate: {
                getById: goal._shortId,
            },
        },
    );

    const utils = trpc.useContext();

    const updateGoal = async (form: GoalUpdate) => {
        setBusy(true);

        const updatedGoal = await goalUpdate(form);

        onSubmit(updatedGoal);
        utils.project.getDeepInfo.invalidate({ id: form.parent.id });
        invalidate();
    };

    const estimateValue = useMemo(
        () =>
            goal.estimate
                ? {
                      date: goal.estimate,
                      type: goal.estimateType || 'Strict',
                  }
                : undefined,
        [goal],
    );

    // FIXME: nullable values are conflicting with undefined
    return (
        <GoalForm
            validityScheme={goalUpdateSchema}
            id={goal.id}
            busy={busy}
            title={goal.title}
            description={goal.description}
            owner={goal.owner ?? undefined}
            parent={goal.project ?? undefined}
            state={goal.state ?? undefined}
            priority={goal.priority ?? undefined}
            tags={goal.tags}
            estimate={estimateValue}
            onSumbit={updateGoal}
            actionButton={
                <>
                    <Button outline text={tr('Cancel')} onClick={dispatchModalEvent(ModalEvent.GoalEditModal)} />
                    <Button view="primary" disabled={busy} outline type="submit" text={tr('Submit')} />
                </>
            }
            tip={
                <Tip title={tr('Pro tip!')} icon={<IconBulbOnOutline size="s" color={gray10} />}>
                    {tr.raw('Press key to update goal', {
                        key: <Keyboard key={'cmd/enter'} command enter />,
                    })}
                </Tip>
            }
        />
    );
};

export default GoalEditForm;
