import { Button } from '@taskany/bricks';
import { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { gapS, gapXs } from '@taskany/colors';

import { createLocaleDate, createYearRange, getYearFromDate } from '../../utils/dateTime';
import { useLocale } from '../../hooks/useLocale';
import { EstimateOption } from '../EstimateOption';
import { useEstimateContext } from '../Estimate/EstimateProvider';
import { estimateYearItem, estimateYearTrigger } from '../../utils/domObjects';

import { tr } from './EstimateYear.i18n';

const StyledTriggerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${gapS};
`;

const StyledItems = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${gapXs};
`;

const StyledButton = styled(Button)`
    display: flex;
    justify-content: center;
`;

const currentYear = getYearFromDate(new Date());
const currentYearRange = createYearRange(currentYear);

const years: number[] = [];

for (let i = currentYear - 1; i <= currentYear + 4; i++) {
    years.push(i);
}

export const EstimateYear: React.FC = () => {
    const { readOnly, setReadOnly, year, setYear, setQuarterAlias } = useEstimateContext();
    const locale = useLocale();

    const onClose = useCallback(() => {
        setReadOnly({ date: true, year: true, quarter: true });
    }, [setReadOnly]);

    const changeHander = useCallback(
        (value?: number) => {
            if (!value) {
                onClose();
            } else {
                setQuarterAlias(undefined);
                setYear(value);
            }
        },
        [setQuarterAlias, setYear, onClose],
    );

    const onClick = useCallback(() => {
        setReadOnly((prev) => ({ ...prev, date: true, year: false }));
    }, [setReadOnly]);

    useEffect(() => {
        if (!readOnly.year) {
            setYear((value) => value || currentYear);
        }
    }, [readOnly.year, setYear]);

    return (
        <EstimateOption
            title={tr('Year title')}
            clue={tr
                .raw('Year clue', {
                    end: createLocaleDate(currentYearRange.end, { locale }),
                })
                .join('')}
            readOnly={readOnly.year}
            onClick={onClick}
            onClose={onClose}
            renderTrigger={() => (
                <StyledTriggerWrapper>
                    <StyledItems>
                        {years.map((y) => (
                            <StyledButton
                                key={y}
                                size="s"
                                text={String(y)}
                                checked={year === y}
                                onClick={() => changeHander(year === y ? undefined : y)}
                                {...estimateYearItem.attr}
                            />
                        ))}
                    </StyledItems>
                </StyledTriggerWrapper>
            )}
            {...estimateYearTrigger.attr}
        />
    );
};
