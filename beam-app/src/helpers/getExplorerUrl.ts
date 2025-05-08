import { isTestnet } from '@/config/isTestnet';

const EXPLORER_URL = isTestnet
  ? 'https://subnets-test.avax.network/beam/tx'
  : 'https://subnets.avax.network/beam/tx';

export const getExplorerUrl = (hash: string) => `${EXPLORER_URL}/${hash}`;
