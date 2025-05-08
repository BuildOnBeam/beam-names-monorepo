'use server';

import { simplePrice } from '@/api/coingecko-api';
import {
  defaultCurrencies,
  recommendedCurrencies,
} from '@/constants/currencies';
import { getUniqueValues, isDefined } from '@onbeam/utils';

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
const REVALIDATE_INTERVAL = 60 * 5; // 5 minutes

const currencies = [...defaultCurrencies, ...recommendedCurrencies];

const COINGECKO_IDS = getUniqueValues(
  currencies.map((currency) => currency.coinGeckoId).filter(isDefined),
).join(',');

export const getConversionRates = async () => {
  const rates = currencies.reduce(
    (acc, { symbol }) => {
      acc[symbol] = undefined;
      return acc;
    },
    {} as Record<string, number | undefined>,
  );

  try {
    const response = await simplePrice(
      { ids: COINGECKO_IDS, vs_currencies: 'USD' },
      {
        cache: 'force-cache',
        next: {
          revalidate: REVALIDATE_INTERVAL,
        },
        ...(COINGECKO_API_KEY && {
          headers: { 'x-cg-pro-api-key': COINGECKO_API_KEY },
        }),
      },
    );

    return currencies.reduce((acc, { symbol, coinGeckoId }) => {
      if (!coinGeckoId) return acc;

      acc[symbol] = (response.data as Record<string, { usd: number }>)?.[
        coinGeckoId
      ]?.usd;

      return acc;
    }, rates);
  } catch {
    return rates;
  }
};
