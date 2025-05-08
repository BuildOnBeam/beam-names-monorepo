'use client';

import { cx, css } from '@onbeam/styled-system/css';
import { vstack, flex, text } from '@onbeam/styled-system/patterns';
import { gridBackground, noiseBackground } from '@onbeam/styled-system/recipes';
import { SelectButton, Divider } from '@onbeam/ui';
import { CurrencyListItemProps } from './CurrencyListItem.types';
import { CurrencyIcon, DragIcon, MenuVerticalIcon } from '@onbeam/icons';
import { CurrencyActions } from '../CurrencyActions';
import { formatTokenAmount, formatUsd } from '@onbeam/utils';
import { useBalance, useConversionRate } from '@onbeam/features';
import { DEFAULT_CHAIN_ID } from '@/constants';
import { Reorder, useDragControls } from 'motion/react';
import { PointerEventHandler } from 'react';

export const CurrencyListItem = ({
  currency,
  isDragDisabled,
  isLast,
}: CurrencyListItemProps) => {
  const controls = useDragControls();
  const { getBalance } = useBalance();
  const { getConvertedBalance } = useConversionRate();

  const balance = getBalance({
    address: currency.address,
    chainId: DEFAULT_CHAIN_ID,
  });
  const usdBalance = getConvertedBalance({ balance, symbol: currency.symbol });

  const handleDrag: PointerEventHandler = (event) => {
    if (isDragDisabled) return;
    controls.start(event);
  };

  return (
    <Reorder.Item
      value={currency}
      dragListener={false}
      dragControls={controls}
      initial={{ height: 0 }}
      animate={{ height: 'auto' }}
      exit={{ height: 0 }}
      className={cx(
        vstack({
          pos: 'relative',
          transitionProperty: 'background-color',
          transitionDuration: 'fast',
          transitionTimingFunction: 'ease-out',
          bgColor: 'mono.650',
          overflow: 'hidden',

          '&[data-drag-disabled="false"]': {
            userSelect: 'none',
            md: {
              cursor: 'grab',
            },
            _hover: {
              bgColor: 'mono.750',
            },
          },
        }),
      )}
      data-drag-disabled={!!isDragDisabled}
    >
      <div
        className={cx(
          gridBackground(),
          noiseBackground(),
          flex({ pos: 'relative' }),
        )}
      >
        <div
          onPointerDown={handleDrag}
          className={flex({
            align: 'center',
            pl: '4',
            pr: '3',
            cursor: 'grab',
            touchAction: 'none',

            '&[data-drag-disabled="true"]': {
              cursor: 'not-allowed',
              opacity: 0.5,
            },
          })}
          data-drag-disabled={isDragDisabled}
        >
          <DragIcon width={12} />
        </div>
        <div
          className={flex({
            w: 'full',
            align: 'center',
            gap: '3',
            py: '3',
            pr: '12',
            mdDown: { pointerEvents: 'none' },
          })}
          onPointerDown={handleDrag}
        >
          <SelectButton
            as="div"
            icon={<CurrencyIcon symbol={currency.symbol} />}
            disableChevron
            className={css({ pointerEvents: 'none' })}
          >
            {currency.symbol}
          </SelectButton>
          <div className={vstack({ ml: 'auto', align: 'end' })}>
            <span className={text({ style: 'xl' })}>
              {formatTokenAmount(balance?.formattedBalance, { fallback: '-' })}
            </span>
            <span className={text({ style: 'sm', color: 'mono.300' })}>
              {formatUsd(usdBalance, { fallback: '-' })}
            </span>
          </div>
        </div>
        <CurrencyActions
          currency={currency}
          trigger={
            <button
              type="button"
              className={css({
                alignSelf: 'center',
                pos: 'absolute',
                right: '3',
                cursor: 'pointer',
                transition: 'colors',
                rounded: 'full',
                _hover: {
                  bg: 'mono.250',
                },
              })}
            >
              <MenuVerticalIcon />
            </button>
          }
        />
      </div>
      {!isLast && <Divider className={css({ pos: 'absolute', bottom: '0' })} />}
    </Reorder.Item>
  );
};
