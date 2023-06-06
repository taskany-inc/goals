import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import InputMask from 'react-input-mask';
import { danger8, danger9, gray6, textColor } from '@taskany/colors';
import { Button, Input, ComboBox, CalendarTickIcon } from '@taskany/bricks';

import {
    createLocaleDate,
    quarterFromDate,
    yearFromDate,
    endOfQuarter,
    parseLocaleDate,
    formatEstimate,
    quarters,
} from '../utils/dateTime';
import { usePageContext } from '../hooks/usePageContext';
import { TLocale } from '../utils/getLang';

interface EstimateComboBoxProps {
    text?: React.ComponentProps<typeof Button>['text'];
    mask: string;
    value?: {
        date: string;
        q: string;
        y: string;
        id: number;
    };
    defaultValuePlaceholder: {
        date: string;
        q: string;
        y?: string;
    };
    disabled?: boolean;
    placeholder?: string;
    error?: React.ComponentProps<typeof ComboBox>['error'];

    onChange?: (estimate?: { date: string; q: string; y: string }) => void;
}

const StyledInput = styled(Input)`
    min-width: 100px;
`;

const StyledButtonsContainer = styled.div`
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 2;
    grid-gap: 6px;
    margin: 6px 2px;
`;

const StyledCleanButton = styled.div`
    display: none;
    position: absolute;
    z-index: 2;
    transform: rotate(45deg);
    top: -6px;
    right: -6px;
    width: 12px;
    height: 12px;
    line-height: 12px;
    text-align: center;
    font-size: 12px;
    border-radius: 100%;
    cursor: pointer;

    background-color: ${danger8};
    color: ${textColor};

    &:hover {
        background-color: ${danger9};
        color: ${textColor};
    }
`;

const StyledTriggerContainer = styled.div`
    position: relative;

    &:hover {
        ${StyledCleanButton} {
            display: block;
        }
    }
`;

const CheckableButton = styled(Button)<{ checked?: boolean }>`
    ${({ checked }) =>
        checked &&
        `
            background-color: ${gray6};
        `}
`;

const isValidDate = (d: string) => !d.includes('_');

const createValue = (date: string | Date, locale: TLocale) => {
    const localDate = typeof date === 'object' ? date : parseLocaleDate(date, { locale });

    return {
        q: quarterFromDate(localDate),
        y: String(yearFromDate(localDate)),
        date: createLocaleDate(localDate, { locale }),
    };
};

export const EstimateComboBox = React.forwardRef<HTMLDivElement, EstimateComboBoxProps>(
    ({ text = '', value, defaultValuePlaceholder, placeholder, mask, disabled, error, onChange }, ref) => {
        const { locale } = usePageContext();
        const inputVal = parseLocaleDate(value?.date || defaultValuePlaceholder?.date, { locale });
        const [inputState, setInputState] = useState(inputVal ? createLocaleDate(inputVal, { locale }) : '');
        const [selectedQ, setSelectedQ] = useState(value?.q || defaultValuePlaceholder?.q);
        const [changed, setChanged] = useState(false);
        const [buttonText, setButtonText] = useState(text);

        const quarterInfo = useMemo(() => {
            const quarterInfo: Record<string, { date: string; q: string; y?: string }> = {
                [defaultValuePlaceholder.q]: defaultValuePlaceholder,
            };

            const qOrder = Object.keys(quarters);
            const qLen = qOrder.length;
            const nextIndex = qOrder.indexOf(defaultValuePlaceholder.q) + 1;

            for (let i = nextIndex; i <= nextIndex + 3; i++) {
                const relatedIndex = `Q${i <= qLen ? i : i - qLen}`;
                if (i <= qLen) {
                    quarterInfo[relatedIndex] = createValue(
                        createLocaleDate(endOfQuarter(relatedIndex), { locale }),
                        locale,
                    );
                } else {
                    const temp = parseLocaleDate(createLocaleDate(endOfQuarter(relatedIndex), { locale }), { locale });
                    temp.setFullYear(temp.getFullYear() + 1);
                    quarterInfo[relatedIndex] = createValue(temp, locale);
                }
            }
            return quarterInfo;
        }, [defaultValuePlaceholder, locale]);

        const onQButtonClick = useCallback(
            (nextQ: string) => () => {
                setSelectedQ(nextQ);
                setChanged(true);
            },
            [],
        );

        const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setChanged(true);
            setInputState(e.target.value);
        }, []);

        useEffect(() => {
            if (Object.keys(quarterInfo).length) {
                setInputState(createLocaleDate(parseLocaleDate(quarterInfo[selectedQ].date, { locale }), { locale }));
            }
        }, [selectedQ, locale, quarterInfo]);

        useEffect(() => {
            if (isValidDate(inputState)) {
                setSelectedQ(quarterFromDate(parseLocaleDate(inputState, { locale })));
            }
        }, [inputState, locale]);

        useEffect(() => {
            if (changed && isValidDate(inputState)) {
                const v = createValue(inputState, locale);
                setButtonText(formatEstimate(v, locale));

                onChange?.(v);
            }
        }, [changed, selectedQ, inputState, locale, onChange]);

        useEffect(() => {
            if (value) {
                setButtonText(
                    formatEstimate(
                        {
                            q: quarterInfo[value.q].q,
                            y: quarterInfo[value.q].y || value.y,
                            date: quarterInfo[value.q].date,
                        },
                        locale,
                    ),
                );
            }
        }, [value, locale, quarterInfo]);

        const onCleanClick = useCallback(() => {
            setButtonText(text);
            setChanged(false);
            const inputVal = value?.date || defaultValuePlaceholder?.date;
            setInputState(inputVal ? createLocaleDate(parseLocaleDate(inputVal, { locale }), { locale }) : '');
            setSelectedQ(defaultValuePlaceholder?.q);
            onChange?.(undefined);
        }, [defaultValuePlaceholder, text, onChange, setInputState, value?.date, locale]);

        return (
            <ComboBox
                ref={ref}
                text={text}
                value={value}
                disabled={disabled}
                error={error}
                placement="top-start"
                items={Object.keys(quarterInfo)}
                maxWidth={100}
                minWidth={100}
                onChange={onChange}
                renderTrigger={(props) => (
                    <StyledTriggerContainer>
                        {changed && <StyledCleanButton onClick={onCleanClick}>+</StyledCleanButton>}
                        <Button
                            disabled={props.disabled}
                            ref={props.ref}
                            text={buttonText}
                            iconLeft={<CalendarTickIcon noWrap size="xs" />}
                            onClick={props.onClick}
                        />
                    </StyledTriggerContainer>
                )}
                renderInput={() => (
                    <InputMask mask={mask} maskPlaceholder={null} onChange={onInputChange} value={inputState}>
                        {/* @ts-ignore incorrect type in react-input-mask */}
                        {(props: { value: string; onChange: () => void }) => (
                            <StyledInput
                                autoFocus
                                placeholder={placeholder}
                                value={props.value}
                                onChange={props.onChange}
                            />
                        )}
                    </InputMask>
                )}
                renderItem={(props) => (
                    <CheckableButton
                        size="s"
                        key={props.item}
                        text={props.item}
                        checked={props.item === selectedQ}
                        onClick={onQButtonClick(props.item)}
                    />
                )}
                renderItems={(children) => (
                    <StyledButtonsContainer>{children as React.ReactNode}</StyledButtonsContainer>
                )}
            />
        );
    },
);
