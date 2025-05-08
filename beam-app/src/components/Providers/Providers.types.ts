import { ConversionRates } from '@onbeam/features';
import { PropsWithChildren } from 'react';
import { State } from 'wagmi';

export type ProviderProps = PropsWithChildren<{
  conversionRates: ConversionRates;
  hydrate: {
    wagmi: {
      initialState: State | undefined;
    };
  };
}>;
