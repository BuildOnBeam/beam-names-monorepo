import { defineConfig } from 'orval';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  'reservoir-api': {
    input: {
      target: `${process.env.NEXT_PUBLIC_RESERVOIR_API_URL}/swagger.json`,
      parserOptions: {
        resolve: {
          http: {
            timeout: 30_000,
          },
        },
      },
    },
    output: {
      baseUrl: process.env.NEXT_PUBLIC_RESERVOIR_API_URL,
      client: 'fetch',
      target: './src/api/reservoir-api.ts',
    },
  },
  'glacier-api': {
    input: {
      target: 'https://glacier-api.avax.network/api-json',
      filters: {
        mode: 'include',
        tags: ['EVM Transactions'],
      },
      parserOptions: {
        resolve: {
          http: {
            timeout: 30_000,
          },
        },
      },
    },
    output: {
      baseUrl: 'https://glacier-api.avax.network',
      client: 'fetch',
      target: './src/api/glacier-api.ts',
    },
  },
  'coingecko-api': {
    input: {
      target:
        'https://raw.githubusercontent.com/coingecko/coingecko-api-oas/refs/heads/main/coingecko-pro-api-v3.json',
      filters: {
        mode: 'include',
        tags: ['Simple'],
      },
      parserOptions: {
        resolve: {
          http: {
            timeout: 30_000,
          },
        },
      },
    },
    output: {
      baseUrl: process.env.COINGECKO_API_KEY
        ? 'https://pro-api.coingecko.com/api/v3'
        : 'https://api.coingecko.com/api/v3',
      client: 'fetch',
      target: './src/api/coingecko-api.ts',
    },
  },
});
