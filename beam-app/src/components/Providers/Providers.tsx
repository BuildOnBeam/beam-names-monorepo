'use client';

// This needs to be imported before wagmi and rainbowkit imports for the beam
// wallet to be available on mobile devices
import '@/lib/beam/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProviderProps } from './Providers.types';
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig';
import { rainbowKitTheme } from '@onbeam/ui';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { BalanceProvider, ConversionRateProvider } from '@onbeam/features';
import { DEFAULT_CHAIN_ID } from '@/constants';
import { useCurrencies } from '@/helpers';

export const queryClient = new QueryClient();

export const Providers = ({
  conversionRates,
  hydrate,
  children,
}: ProviderProps) => {
  const { currencies } = useCurrencies();

  return (
    <WagmiProvider
      config={wagmiConfig}
      initialState={hydrate.wagmi.initialState}
    >
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowKitTheme} modalSize="compact">
          <ConversionRateProvider conversionRates={conversionRates}>
            <BalanceProvider
              wagmiConfig={wagmiConfig}
              tokens={currencies.map((currency) => ({
                address: currency.address,
                chainId: DEFAULT_CHAIN_ID,
              }))}
            >
              {children}
            </BalanceProvider>
          </ConversionRateProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
