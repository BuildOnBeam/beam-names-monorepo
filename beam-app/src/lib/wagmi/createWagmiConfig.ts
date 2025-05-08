import { type Chain, chains } from './chains';
import {
  cookieStorage,
  createConfig,
  CreateConnectorFn,
  createStorage,
  http,
  Transport,
} from 'wagmi';

type Transports = Record<Chain['id'], Transport>;

const transports = chains.reduce((acc: Transports, chain) => {
  const key = chain.id as keyof Transports;
  acc[key] = http() as Transports[keyof Transports];
  return acc;
}, {} as Transports);

export const createWagmiConfig = (connectors?: CreateConnectorFn[]) =>
  createConfig({
    connectors,
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    chains,
    transports,
  });
