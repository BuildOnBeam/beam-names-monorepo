import { isTestnet } from '@/config/isTestnet';

const MARKETPLACE_DOMAIN = isTestnet
  ? 'https://testnet.sphere.market/beam-testnet'
  : 'https://sphere.market/beam';

type Props = {
  contract?: string;
  tokenId?: string;
};

export const getNftUrl = ({ contract, tokenId }: Props) =>
  `${MARKETPLACE_DOMAIN}/nft/${contract}/${tokenId}`;
