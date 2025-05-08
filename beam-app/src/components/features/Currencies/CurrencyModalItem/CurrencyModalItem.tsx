'use client';

import { Currency } from '@/helpers';
import { css } from '@onbeam/styled-system/css';
import { flex, text, vstack } from '@onbeam/styled-system/patterns';
import { PixelBackground, SelectButton } from '@onbeam/ui';
import {
  isDefined,
  formatTokenAmount,
  formatUsd,
  bigintToNumber,
} from '@onbeam/utils';
import { useAccount, useBalance } from 'wagmi';
import { DEFAULT_CHAIN_ID } from '@/constants';
import { useConversionRate } from '@onbeam/features';
import { CurrencyIcon } from '@onbeam/icons';

export const CurrencyModalItem = (currency: Currency) => {
  const { getConversionRate } = useConversionRate();
  const conversionRate = getConversionRate(currency.symbol);
  const { address: userAddress } = useAccount();
  const { data: balanceData } = useBalance({
    chainId: DEFAULT_CHAIN_ID,
    address: userAddress,
    token: currency.address,
  });

  const balance = balanceData
    ? bigintToNumber(balanceData.value, balanceData.decimals)
    : undefined;

  return (
    <PixelBackground
      className={flex({
        direction: 'row',
        p: '4',
        gap: '3',
        align: 'center',
      })}
    >
      <SelectButton
        as="div"
        icon={<CurrencyIcon symbol={currency.symbol} />}
        disableChevron
        className={css({ pointerEvents: 'none' })}
      >
        {currency.symbol}
      </SelectButton>
      <div className={flex({ ml: 'auto', align: 'center' })}>
        <div className={vstack({ align: 'flex-end' })}>
          <span className={text({ style: 'xl' })}>
            {formatTokenAmount(balance, { fallback: '-' })}
          </span>
          <span className={text({ style: 'sm', color: 'mono.300' })}>
            {formatUsd(
              isDefined(balance) && isDefined(conversionRate)
                ? balance * conversionRate
                : undefined,
              { fallback: '-' },
            )}
          </span>
        </div>
      </div>
    </PixelBackground>
  );
};
