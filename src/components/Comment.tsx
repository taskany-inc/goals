import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import { Scalars, User } from '../../graphql/@generated/genql';
import { brandColor, gray4 } from '../design/@generated/themes';

import { Card, CardContent, CardInfo } from './Card';
import { Link } from './Link';
import { Md } from './Md';
import { RelativeTime } from './RelativeTime';
import { UserPic } from './UserPic';

interface CommentProps {
    id: string;
    description: string;
    createdAt: Scalars['DateTime'];
    updatedAt?: Scalars['DateTime']; // https://github.com/taskany-inc/issues/issues/217
    author?: User;
    isNew?: boolean;
}

export const commentMask = 'comment-';

const StyledComment = styled.div`
    display: grid;
    grid-template-columns: 35px 1fr;
    column-gap: 15px;
`;

const StyledCommentCard = styled(Card)<{ isNew?: boolean }>`
    position: relative;
    min-height: 90px;

    transition: border-color 200ms ease-in-out;

    ${({ isNew }) =>
        isNew &&
        css`
            border-color: ${brandColor};
        `}

    &::before {
        position: absolute;
        z-index: 0;

        content: '';

        width: 14px;
        height: 14px;

        background-color: ${gray4};

        border-left: 1px solid ${gray4};
        border-top: 1px solid ${gray4};
        border-radius: 2px;

        transform: rotate(-45deg);
        transition: border-color 200ms ease-in-out;

        top: 8px;
        left: -6px;

        ${({ isNew }) =>
            isNew &&
            css`
                border-color: ${brandColor};
            `}
    }
`;

export const Comment: FC<CommentProps> = ({ id, author, description, createdAt, isNew }) => {
    return (
        <StyledComment id={`${commentMask}${id}`}>
            <UserPic size={32} src={author?.image} />

            <StyledCommentCard isNew={isNew}>
                <CardInfo>
                    <Link inline>{author?.name}</Link> —{' '}
                    <Link inline href={`#${commentMask}${id}`}>
                        <RelativeTime date={createdAt} />
                    </Link>
                </CardInfo>

                <CardContent>
                    <Md>{description}</Md>
                </CardContent>
            </StyledCommentCard>
        </StyledComment>
    );
};
