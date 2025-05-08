import { Currency } from '@/helpers';
import { zeroAddress } from 'viem';
import { beam, beamTestnet } from 'viem/chains';
import { DEFAULT_CHAIN_ID } from './chain';

type ChainCurrencies = Record<number, Currency[]>;

export const nativeCurrency: Currency = {
  address: zeroAddress,
  symbol: 'BEAM',
  name: 'BEAM',
  decimals: 18,
  coinGeckoId: 'beam-2',
};

/* Make sure to update the CURRENCY_STORE_VERSION variable in useCurrencies when updating the default currencies. */
export const defaultChainCurrencies = {
  [beam.id]: [
    nativeCurrency,
    {
      address: '0xD51BFa777609213A653a2CD067c9A0132a2D316A',
      name: 'Wrapped BEAM',
      symbol: 'WBEAM',
      decimals: 18,
      coinGeckoId: 'beam-2',
    },
    {
      address: '0x76bf5e7d2bcb06b1444c0a2742780051d8d0e304',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      coinGeckoId: 'usd-coin',
    },
    {
      address: '0x989e7863f15c548accf7b62ad432defbba2677be',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      coinGeckoId: 'ethereum',
    },
    {
      address: '0x00E69e0b6014d77040b28E04F2b8ac25A6EA5d34',
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
      coinGeckoId: 'avalanche-2',
    },
  ],
  [beamTestnet.id]: [
    nativeCurrency,
    {
      address: '0xF65B6f9c94187276C7d91F4F74134751d248bFeA',
      name: 'Wrapped BEAM',
      symbol: 'WBEAM',
      decimals: 18,
      coinGeckoId: 'beam-2',
    },
    {
      address: '0x007fdc86fd12924c9116025c7f594843087397e3',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      coinGeckoId: 'usd-coin',
    },
    {
      address: '0xa2a41769a58cff5df4304cfdd4894f881c0f32e8',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      coinGeckoId: 'ethereum',
    },
    {
      address: '0x2CC787Ed364600B0222361C4188308Fa8E68bA60',
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
      coinGeckoId: 'avalanche-2',
    },
  ],
} satisfies ChainCurrencies;

export const defaultCurrencies = defaultChainCurrencies[DEFAULT_CHAIN_ID];

export const recommendedChainCurrencies = {
  [beam.id]: [
    {
      address: '0x1f9A99498A81365a2FBd503F49A041f066039d53',
      name: 'Purple',
      symbol: 'PRPL',
      decimals: 18,
    },
    {
      address: '0xe338aA35D844D5C1a4E052380DBFA939e0cce13F',
      name: 'Raini Studios Token',
      symbol: 'RST',
      decimals: 18,
      coinGeckoId: 'raini-studios-token',
    },
    {
      address: '0x00E69e0b6014d77040b28E04F2b8ac25A6EA5d34',
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
      coinGeckoId: 'avalanche-2',
    },
    {
      address: '0x999f90f25a2922ae1b21A06066F7EDEbedad42a9',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      coinGeckoId: 'tether',
    },
    {
      address: '0x7fb5a9921CF98362aA425e42f66Bf3484C2C2B5F',
      name: 'Goons of Balatroon',
      symbol: 'GOB',
      decimals: 18,
      coinGeckoId: 'goons-of-balatroon',
    },
    {
      address: '0xAff7314Bc869ff4AB265ec7Efa8E442F1D978d7a',
      name: 'Forgotten Playland',
      symbol: 'FP',
      decimals: 18,
      coinGeckoId: 'forgotten-playland',
    },
    {
      address: '0xFbeAC502b4108CA669E524b16A53b2dB88D8b2dB',
      name: 'Castle of Blackwater',
      symbol: 'COBE',
      decimals: 18,
      coinGeckoId: 'castle-of-blackwater',
    },
    {
      address: '0x61b24C2755371E0AAfFd5f7fc75a3bc074f9a56E',
      name: 'BEAMCAT',
      symbol: 'BCAT',
      decimals: 18,
      coinGeckoId: 'beamcat',
    },
    {
      address: '0x0650c20D8B536dA43818578071d43CDdd8fFE854',
      name: 'Moonsama',
      symbol: 'SAMA',
      decimals: 18,
      coinGeckoId: 'moonsama',
    },
    {
      address: '0x9DA978718b6Bd84Bf485b475EAb253CF76d77b59',
      name: 'City of Greed Anima Spirit Gem',
      symbol: 'ASG',
      decimals: 18,
      coinGeckoId: 'nekoverse-city-of-greed-anima-spirit-gem',
    },
    {
      address: '0x2DD1DaEd2951aEc5Ba360Acb3256473181ef9751',
      name: 'CEDEN Network Token',
      symbol: 'CDN',
      decimals: 18,
      coinGeckoId: 'ceden',
    },
    {
      address: '0x2D83C0dC2eF52E3DcF24541FB3eb4C0E71e58212',
      name: 'Domi',
      symbol: 'DOMI',
      decimals: 18,
      coinGeckoId: 'domi',
    },
  ],
  [beamTestnet.id]: [
    {
      address: '0x3505432B3b175F5e2DD9816f85039a6E6258A2BA',
      name: 'Purple',
      symbol: 'PRPL',
      decimals: 18,
    },
    {
      address: '0xeC10c2a62Bf277867BEDCe1B9c2d0ca7F55D6A4e',
      name: 'Raini Studios Token',
      symbol: 'RST',
      decimals: 18,
      coinGeckoId: 'raini-studios-token',
    },
    {
      address: '0x29633Cf4FF2D98347895C7327f83Ab4cd592C808',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      coinGeckoId: 'tether',
    },
    {
      address: '0x2724A590fe9cC7c66A83204aa11D6ec7Aa8e7C58',
      name: 'Nekotoshi',
      symbol: '/ᐠ‥ᐟ\\',
      decimals: 0,
    },
  ],
} satisfies ChainCurrencies;

export const recommendedCurrencies =
  recommendedChainCurrencies[DEFAULT_CHAIN_ID];
