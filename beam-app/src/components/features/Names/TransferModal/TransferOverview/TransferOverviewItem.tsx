import { CopyButton } from '@/components';
import { Transaction } from '@/components/features/Transfer/TransferModal';
import { useCurrencies } from '@/helpers';
import { CurrencyIcon } from '@onbeam/icons';
import { cx } from '@onbeam/styled-system/css';
import { vstack, flex, text } from '@onbeam/styled-system/patterns';
import { tile } from '@onbeam/styled-system/recipes';
import {
  compareAddresses,
  formatAddress,
  formatTokenAmount,
  padString,
} from '@onbeam/utils';
import { Address } from 'viem';

export const TransferOverviewItem = ({
  index,
  ...transaction
}: { index: number } & Transaction) => {
  const { currencies } = useCurrencies();

  const groupedTokens = transaction.tokens.reduce(
    (acc, { amount = 0, currencyAddress }) => {
      const existingToken = acc.find((token) =>
        compareAddresses(token.currencyAddress, currencyAddress),
      );

      if (existingToken) {
        existingToken.amount += amount;
      } else {
        acc.push({ amount, currencyAddress });
      }

      return acc;
    },
    [] as { amount: number; currencyAddress: Address }[],
  );

  return (
    <div className={cx(tile(), vstack({ gap: '3', p: '4' }))}>
      {groupedTokens.map(({ amount, currencyAddress }) => {
        const symbol = currencies.find(({ address }) =>
          compareAddresses(address, currencyAddress),
        )?.symbol;

        return (
          <div key={currencyAddress} className={flex({ gap: '2' })}>
            <CurrencyIcon symbol={symbol} />
            {formatTokenAmount(amount, { symbol })}
          </div>
        );
      })}
      <div
        className={flex({
          justify: 'space-between',
          align: 'center',
          gap: '3',
        })}
      >
        <p className={text({ style: 'base', color: 'mono.300' })}>
          send_item_{padString(index + 1, 2, '0')}
        </p>

        {transaction.beamName ?
          <div>
            send to: <CopyButton value={transaction.beamName}>
              {formatAddress(transaction.beamName)}
            </CopyButton>
          </div>
          :
          <div>
            <CopyButton value={transaction.recipient}>
              {formatAddress(transaction.recipient)}
            </CopyButton>
          </div>
        }
      </div>
    </div>
  );
};
