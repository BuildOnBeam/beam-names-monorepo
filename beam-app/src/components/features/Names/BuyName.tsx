// app/Names/BuyName.tsx
'use client';

import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAccount } from 'wagmi';
import { NamesForm } from './NamesForm';
import { NameSchema } from './utils/ens';
import { vstack } from '@onbeam/styled-system/patterns';

export const BuyName = () => {
  const { address } = useAccount();

  const form = useForm<NameSchema>({
    resolver: zodResolver(NameSchema),
    defaultValues: {
      name: '',
      duration: 31536000, // 1 year
      owner: address || ('0x0000000000000000000000000000000000000000' as const),
    },
  });

  return (
    <div className={vstack({ align: 'center', gap: '4', p: '4' })}>
      <h1>Buy a .beam Name</h1>
      <FormProvider {...form}>
        <NamesForm />
      </FormProvider>
    </div>
  );
};

export default BuyName;