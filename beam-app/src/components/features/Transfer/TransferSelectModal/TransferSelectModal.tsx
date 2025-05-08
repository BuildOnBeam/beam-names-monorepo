import { DEFAULT_CHAIN_ID } from '@/constants';
import { useCurrencies } from '@/helpers';
import { useBalance, useConversionRate } from '@onbeam/features';
import { CurrencyIcon } from '@onbeam/icons';
import { SelectModal, SelectModalItem, SelectModalProps } from '@onbeam/ui';
import {
  compareAddresses,
  formatTokenAmount,
  formatUsd,
  isDefined,
} from '@onbeam/utils';
import { useCallback, useState } from 'react';

export const TransferSelectModal = (props: SelectModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { getBalance } = useBalance();
  const { getConversionRate } = useConversionRate();
  const { currencies } = useCurrencies();

  const filter = useCallback(
    (item: SelectModalItem): boolean => {
      const search = searchQuery.toLowerCase();

      if (!search) return true;

      if (item.name.toLowerCase().includes(search)) return true;
      if (item.subname?.toLowerCase().includes(search)) return true;
      if (compareAddresses(item.id, search)) return true;

      return false;
    },
    [searchQuery],
  );

  return (
    <SelectModal
      title="Select token"
      listTitle="Select a token you want to send"
      searchPlaceholder="Search token"
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
      items={currencies.map(({ address, symbol, name }) => {
        const balance = getBalance({
          address,
          chainId: DEFAULT_CHAIN_ID,
        })?.formattedBalance;

        const conversionRate = getConversionRate(symbol);

        return {
          id: address,
          name: symbol || '',
          address,
          chainId: DEFAULT_CHAIN_ID,
          subname: name,
          detailLabel: formatTokenAmount(balance, {
            fallback: '-',
          }),
          detailCaption: formatUsd(
            isDefined(balance) && isDefined(conversionRate)
              ? balance * conversionRate
              : undefined,
            { fallback: '-' },
          ),
          logo: <CurrencyIcon symbol={symbol} />,
        };
      })}
      filter={filter}
      {...props}
    />
  );
};
