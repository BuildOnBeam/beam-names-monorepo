import { CurrencyTileProps } from './CurrencyTile.types';
import { css, cx } from '@onbeam/styled-system/css';
import { vstack, flex, text } from '@onbeam/styled-system/patterns';
import { tile } from '@onbeam/styled-system/recipes';
import { formatTokenAmount, formatUsd } from '@onbeam/utils';
import { CurrencyActions } from '../../Currencies/CurrencyActions';
import { CurrencyIcon, MenuIcon } from '@onbeam/icons';
import { useBalance, useConversionRate } from '@onbeam/features';
import { DEFAULT_CHAIN_ID } from '@/constants';

export const CurrencyTile = ({ currency }: CurrencyTileProps) => {
  const { getBalance } = useBalance();
  const { getConvertedBalance } = useConversionRate();

  const balance = getBalance({
    address: currency.address,
    chainId: DEFAULT_CHAIN_ID,
  });

  const usdBalance = getConvertedBalance({ balance, symbol: currency.symbol });

  return (
    <div
      className={cx(
        tile(),
        flex({
          md: { flexDir: 'column' },
          justify: 'center',
          gap: '2.5',
          w: 'full',
          p: '4',

          mdDown: {
            bg: '[unset]',
            border: 'none',
            shadow: '[none]',
          },
        }),
      )}
    >
      <div className={flex({ w: 'full', align: 'center', gap: '2' })}>
        <CurrencyIcon symbol={currency.symbol} />
        <h3 className={text({ style: 'xl' })}>{currency.symbol}</h3>
        <CurrencyActions
          currency={currency}
          trigger={
            <button
              type="button"
              className={css({
                ml: 'auto',
                cursor: 'pointer',
                display: 'none',
                md: { display: 'block' },
                transition: 'colors',
                rounded: 'full',
                _hover: {
                  bg: 'mono.250',
                },
              })}
            >
              <MenuIcon />
            </button>
          }
        />
      </div>
      <div
        className={vstack({
          h: 'full',
          textAlign: 'right',
          md: { textAlign: 'left' },
        })}
      >
        <span className={text({ style: 'xl' })}>
          {formatTokenAmount(balance?.formattedBalance, { fallback: '-' })}
        </span>
        <span className={text({ style: 'sm', color: 'mono.300' })}>
          {formatUsd(usdBalance, { fallback: '-' })}
        </span>
      </div>
    </div>
  );
};
