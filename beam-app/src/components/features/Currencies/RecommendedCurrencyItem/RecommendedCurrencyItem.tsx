'use client';

import { cx, css } from '@onbeam/styled-system/css';
import { flex } from '@onbeam/styled-system/patterns';
import { gridBackground, noiseBackground } from '@onbeam/styled-system/recipes';
import { SelectButton, IconButton } from '@onbeam/ui';
import { RecommendedCurrencyItemProps } from './RecommendedCurrencyItem.types';
import { CurrencyIcon, PlusIcon } from '@onbeam/icons';
import { useCurrencies } from '@/helpers';

export const RecommendedCurrencyItem = ({
  currency,
}: RecommendedCurrencyItemProps) => {
  const handleAddCurrency = () => {
    useCurrencies.getState().addCurrency(currency);
  };

  return (
    <div
      className={cx(
        gridBackground(),
        noiseBackground(),
        flex({
          position: 'relative',
          px: '4',
          py: '3',
          rounded: 'sm',
          borderColor: 'mono.900',
          border: '1px solid',
          bg: 'mono.900',
        }),
      )}
    >
      <SelectButton
        as="div"
        icon={<CurrencyIcon symbol={currency.symbol} />}
        disableChevron
        className={css({ pointerEvents: 'none' })}
      >
        {currency.symbol}
      </SelectButton>
      <IconButton
        aria-label="Add currency"
        className={css({ ml: 'auto' })}
        onClick={handleAddCurrency}
      >
        <PlusIcon />
      </IconButton>
    </div>
  );
};
