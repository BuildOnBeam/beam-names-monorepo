'use client';

import { transferBulkSchema, TransferBulkSchema } from './TransferBulk.utils';
import { TransferBulkForm } from './TransferBulkForm';
import { DEFAULT_CHAIN_ID } from '@/constants';
import { useCurrencies } from '@/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBalance } from '@onbeam/features';
import { FormProvider, useForm } from 'react-hook-form';

export const TransferBulk = () => {
  const { currencies } = useCurrencies();
  const { getBalance } = useBalance();

  const currenciesWithBalance = currencies.map((currency) => ({
    ...currency,
    balance: getBalance({
      address: currency.address,
      chainId: DEFAULT_CHAIN_ID,
    })?.formattedBalance,
  }));

  const form = useForm<TransferBulkSchema>({
    resolver: zodResolver(transferBulkSchema(currenciesWithBalance)),
    defaultValues: {
      mode: 'file',
    },
  });

  return (
    <FormProvider {...form}>
      <TransferBulkForm />
    </FormProvider>
  );
};
