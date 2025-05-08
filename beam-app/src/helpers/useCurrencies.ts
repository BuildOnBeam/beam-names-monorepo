import { defaultCurrencies } from '@/constants/currencies';
import { compareAddresses } from '@onbeam/utils';
import { Address } from 'viem';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Currency {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  coinGeckoId?: string;
}

type CurrencyListState = {
  isLoading: boolean;
  currencies: Currency[];
  isAddCurrencyModalOpen: boolean;
};

type CurrencyListActions = {
  addCurrency: (token: Currency) => void;
  getCurrency: (params: { symbol?: string | null; address?: Address }) =>
    | Currency
    | undefined;
  removeCurrency: (address: Address) => void;
};

export type CurrencyListStore = CurrencyListState & CurrencyListActions;

const CURRENCY_STORE_VERSION = 1;

export const useCurrencies = create<CurrencyListStore>()(
  persist(
    (set, get) => ({
      isLoading: true,
      currencies: defaultCurrencies,
      isAddCurrencyModalOpen: false,
      addCurrency: (token) =>
        set((state) => {
          const exists = state.currencies.some((currency) =>
            compareAddresses(currency.address, token.address),
          );

          if (exists) return state;

          return {
            currencies: [...state.currencies, token],
          };
        }),
      getCurrency: ({ symbol, address }) => {
        const { currencies } = get();

        return currencies.find(
          (currency) =>
            currency.symbol === symbol ||
            compareAddresses(currency.address, address),
        );
      },
      removeCurrency: (address) => {
        const isDefaultCurrency = defaultCurrencies.some((currency) =>
          compareAddresses(currency.address, address),
        );

        if (isDefaultCurrency) return;

        set((state) => ({
          currencies: state.currencies.filter(
            (currency) => !compareAddresses(currency.address, address),
          ),
        }));
      },
    }),
    {
      name: 'tokens',
      version: CURRENCY_STORE_VERSION,
      migrate: (state, version) => {
        if (version === CURRENCY_STORE_VERSION) return state;

        const currencies = (state as CurrencyListState)
          ?.currencies as Currency[];

        if (!currencies) return { currencies: defaultCurrencies };

        const missingDefaultCurrencies = defaultCurrencies.filter(
          (currency) =>
            !currencies.some((c) =>
              compareAddresses(c.address, currency.address),
            ),
        );

        return { currencies: [...currencies, ...missingDefaultCurrencies] };
      },
      partialize: ({ currencies }) => ({
        currencies,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.isLoading = false;
      },
    },
  ),
);
