import { defineChain } from 'viem';
import {
  beam as beamConfig,
  mainnet as ethereumConfig,
  beamTestnet as beamTestnetConfig,
  sepolia as sepoliaConfig,
  avalanche as avalancheConfig,
  avalancheFuji as avalancheFujiConfig,
  arbitrum as arbitrumConfig,
  bsc as bscConfig,
} from 'viem/chains';

/* Mainnets */
export const beam = defineChain({
  ...beamConfig,
  rpcUrls: {
    default: {
      http: ['https://build.onbeam.com/rpc'],
    },
  },
});
export const ethereum = defineChain({
  ...ethereumConfig,
  rpcUrls: {
    default: {
      http: [
        'https://eth-mainnet.g.alchemy.com/v2/nAlLKfbuzKPQSmzBHYdYSwMwXtCLhhiY',
      ],
    },
  },
});
export const avalanche = defineChain({
  ...avalancheConfig,
  rpcUrls: {
    default: {
      http: [
        'https://avax-mainnet.g.alchemy.com/v2/nAlLKfbuzKPQSmzBHYdYSwMwXtCLhhiY',
      ],
    },
  },
});
export const arbitrum = defineChain({
  ...arbitrumConfig,
  rpcUrls: {
    default: {
      http: [
        'https://arb-mainnet.g.alchemy.com/v2/nAlLKfbuzKPQSmzBHYdYSwMwXtCLhhiY',
      ],
    },
  },
});
export const bsc = defineChain({
  ...bscConfig,
  rpcUrls: {
    default: {
      http: [
        'https://bnb-mainnet.g.alchemy.com/v2/nAlLKfbuzKPQSmzBHYdYSwMwXtCLhhiY',
      ],
    },
  },
});

/* Testnets */
export const beamTestnet = defineChain({
  ...beamTestnetConfig,
  rpcUrls: {
    default: {
      http: ['https://build.onbeam.com/rpc/testnet'],
    },
  },
});
export const sepolia = defineChain({
  ...sepoliaConfig,
  rpcUrls: {
    default: {
      http: [
        'https://eth-sepolia.g.alchemy.com/v2/nAlLKfbuzKPQSmzBHYdYSwMwXtCLhhiY',
      ],
    },
  },
});
export const avalancheFuji = defineChain({
  ...avalancheFujiConfig,
  rpcUrls: {
    default: {
      http: [
        'https://avax-fuji.g.alchemy.com/v2/nAlLKfbuzKPQSmzBHYdYSwMwXtCLhhiY',
      ],
    },
  },
});

export const chains = [
  arbitrum,
  avalanche,
  avalancheFuji,
  beam,
  beamTestnet,
  bsc,
  ethereum,
  sepolia,
] as const;

export type Chain = (typeof chains)[number];
export type ChainId = Chain['id'];
export const getChainById = (id?: number) => chains.find((c) => c.id === id);
