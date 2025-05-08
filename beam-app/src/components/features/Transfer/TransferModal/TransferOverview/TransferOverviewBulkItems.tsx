import { CopyButton } from '@/components';
import { Transaction } from '@/components/features/Transfer/TransferModal/useTransferModalStore';
import { useCurrencies } from '@/helpers';
import { CurrencyIcon } from '@onbeam/icons';
import { css } from '@onbeam/styled-system/css';
import { flex } from '@onbeam/styled-system/patterns';
import { PixelBackground } from '@onbeam/ui';
import {
  compareAddresses,
  formatAddress,
  formatTokenAmount,
} from '@onbeam/utils';

export const TransferOverviewBulkItems = ({
  transactions,
}: { transactions: Transaction[] }) => {
  const { currencies } = useCurrencies();

  const symbol = currencies.find(({ address }) =>
    compareAddresses(address, transactions[0].tokens[0].currencyAddress),
  )?.symbol;

  const total = transactions.reduce(
    (acc, { tokens }) => acc + (tokens[0].amount || 0),
    0,
  );

  return (
    <div>
      <PixelBackground
        className={css({ overflowY: 'scroll', maxH: '[11rem]', p: '3' })}
      >
        {transactions.map(({ recipient, tokens }, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: https://www.youtube.com/watch?v=jmVOi5BEzLQ
            key={index}
            className={flex({
              gap: '2',
              align: 'center',
              justify: 'space-between',
            })}
          >
            <div
              className={flex({
                gap: '1',
                textStyle: 'base',
                align: 'center',
              })}
            >
              <CurrencyIcon symbol={symbol} size={16} />
              {formatTokenAmount(tokens[0].amount, { symbol })}
            </div>
            <CopyButton
              className={css({ color: 'mono.100' })}
              value={recipient}
            >
              {formatAddress(recipient)}
            </CopyButton>
          </div>
        ))}
      </PixelBackground>
      <div
        className={flex({
          mt: '3',
          gap: '1',
          textStyle: 'base',
          align: 'center',
        })}
      >
        <span className={css({ color: 'mono.100', mr: '1' })}>Total:</span>
        <CurrencyIcon symbol={symbol} size={16} />
        {formatTokenAmount(total, { symbol })}
      </div>
    </div>
  );
};
