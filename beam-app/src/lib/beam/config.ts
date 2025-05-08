import { DEFAULT_CHAIN_ID } from '@/constants';
import { ClientConfig, ChainId } from '@onbeam/sdk';

const environment = process.env.NEXT_PUBLIC_BEAM_ENVIRONMENT;
const isPreview = environment === 'preview';

const beamConfig: ClientConfig = {
  chainId: DEFAULT_CHAIN_ID,
  chains: [
    {
      id: ChainId.BEAM_MAINNET,
      publishableKey: 'VKIIlWLEGx5OhgKxvg5lupR0o4ppwKN0', // mainnet key
      sponsor: true,
    },
    {
      id: ChainId.BEAM_TESTNET,
      publishableKey: isPreview
        ? 'ggw3PV2PPVbVtzR9YzOcWWHffR5AbUDL' // preview key
        : '2h74Z3qM0XWYvEfQfxBrLcxYQRGgkUDt', // testnet key
      isPreview,
      sponsor: true,
    },
  ],
  debug: isPreview,
};

export { beamConfig };
