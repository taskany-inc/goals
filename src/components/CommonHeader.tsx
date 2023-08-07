import styled from 'styled-components';
import { gapM, gapS, gray6 } from '@taskany/colors';
import { Text, nullable } from '@taskany/bricks';

import { PageContent } from './Page';

interface CommonHeaderProps {
    title: React.ReactNode;
    preTitle?: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
    actions?: React.ReactNode;
}

const StyledCommonHeader = styled(PageContent)`
    display: grid;
    grid-template-columns: 8fr 4fr;
`;

const StyledCommonHeaderInfo = styled.div<{ align: 'left' | 'right' }>`
    ${({ align }) => `
        justify-self: ${align};
    `}

    ${({ align }) =>
        align === 'right' &&
        `
            display: grid;
            justify-items: end;
            align-content: space-between;
        `}
`;

const StyledCommonHeaderTitle = styled(Text)`
    width: 850px;
    padding-top: ${gapM};
`;

export const CommonHeader: React.FC<CommonHeaderProps> = ({ preTitle, title, description, children, actions }) => {
    return (
        <StyledCommonHeader>
            <StyledCommonHeaderInfo align="left">
                {nullable(preTitle, (pT) => (
                    <Text size="m" weight="bold" color={gray6}>
                        {pT}
                    </Text>
                ))}

                <StyledCommonHeaderTitle size="xxl" weight="bolder">
                    {title}
                </StyledCommonHeaderTitle>

                {nullable(description, (d) => (
                    <Text size="m" color={gray6} style={{ paddingTop: gapS }}>
                        {d}
                    </Text>
                ))}
            </StyledCommonHeaderInfo>

            <div>{actions}</div>

            {children}
        </StyledCommonHeader>
    );
};
