'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { transferSchema, TransferSchema } from './Transfer.utils';
import { useAccount } from 'wagmi';
import { TransferForm } from './TransferForm';
import { useBalance } from '@onbeam/features';
import { DEFAULT_CHAIN_ID } from '@/constants';
import { useCurrencies } from '@/helpers';
import { useSearchParams } from 'next/navigation';

export const Transfer = () => {
  const searchParams = useSearchParams();
  const { address } = useAccount();
  const { currencies, getCurrency } = useCurrencies();
  const { getBalance } = useBalance();

  const currenciesWithBalance = currencies.map((currency) => ({
    ...currency,
    balance: getBalance({
      address: currency.address,
      chainId: DEFAULT_CHAIN_ID,
    })?.formattedBalance,
  }));

  const currencyAddress = getCurrency({
    symbol: searchParams.get('currency'),
  })?.address;

  const form = useForm<TransferSchema>({
    resolver: zodResolver(transferSchema(currenciesWithBalance, address)),
    defaultValues: {
      transactions: [
        {
          tokens: [{ currencyAddress }],
        },
      ],
    },
  });

  return (
    <FormProvider {...form}>
      <TransferForm />
    </FormProvider>
  );
};
