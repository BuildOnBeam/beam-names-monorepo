import { connectors } from './connectors';
import { createWagmiConfig } from './createWagmiConfig';

export const wagmiConfig = createWagmiConfig(connectors);
