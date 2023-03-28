import { useCallback } from 'react';
import styled from 'styled-components';

import { nullable } from '@common/utils/nullable';
import { CleanButton } from '@common/CleanButton';
import { UserPic } from '@common/UserPic';

import { Activity } from '../../graphql/@generated/genql';
import { gapS } from '../design/@generated/themes';

import { IssueMeta } from './IssueMeta';

interface IssueParticipantsListProps {
    title: string;
    participants?: Array<Activity | undefined>;

    onEdit?: () => void;
    onDelete?: (id: string) => void;
}

const StyledCleanButton = styled(CleanButton)``;

const StyledParticipant = styled.span`
    position: relative;
    display: inline-block;
    margin-top: ${gapS};
    margin-right: ${gapS};

    &:hover {
        ${StyledCleanButton} {
            visibility: visible;

            cursor: pointer;
        }
    }
`;

export const IssueParticipantsList: React.FC<IssueParticipantsListProps> = ({
    title,
    participants,
    onEdit,
    onDelete,
}) => {
    const onParticipantDelete = useCallback(
        (id: string) => () => {
            onDelete && onDelete(id);
        },
        [onDelete],
    );

    return (
        <>
            <IssueMeta title={title} onEdit={onEdit}>
                {participants?.map((p) =>
                    nullable(p, (pa) => (
                        <StyledParticipant key={pa.id}>
                            {nullable(onDelete, () => (
                                <StyledCleanButton onClick={onParticipantDelete(pa.id)} />
                            ))}
                            <UserPic src={pa.user?.image} email={pa.user?.email} size={24} />
                        </StyledParticipant>
                    )),
                )}
            </IssueMeta>
        </>
    );
};
