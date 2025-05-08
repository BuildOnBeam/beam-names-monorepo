import { GetUsersUserTokensV7ResponseTokensItem } from '@/api/reservoir-api';
import {
  MAX_NFTS_PER_TRANSFER,
  useNftTransferStore,
} from '@/components/features/NftOverview/NftTransfer';
import { NFTTile } from '@/components/shared/NFTTile';
import { getNftUrl } from '@/helpers';
import { compareAddresses } from '@onbeam/utils';

export const NftOverviewTile = ({
  token,
  ownership,
}: GetUsersUserTokensV7ResponseTokensItem) => {
  const { isSelecting, selectedNfts, selectNft, deselectNft } =
    useNftTransferStore();

  const isSelected = selectedNfts.some(
    ({ id, contract }) =>
      id === token?.tokenId && compareAddresses(contract, token.contract),
  );

  const hasSelectedMax = selectedNfts.length >= MAX_NFTS_PER_TRANSFER;

  const handleClick = () => {
    if (!isSelecting) return;

    if (isSelected) {
      deselectNft({
        id: token?.tokenId || '',
        contract: token?.contract || '',
      });
    } else {
      if (hasSelectedMax) return;

      selectNft({
        id: token?.tokenId || '',
        contract: token?.contract || '',
        kind: token?.kind?.includes('721') ? 721 : 1155,
        quantity: 1,
        quantityOwned: Number(ownership?.tokenCount || 0),
        name: token?.name || `#${token?.tokenId}`,
        image: token?.imageMedium || token?.image || '',
      });
    }
  };

  return (
    <NFTTile
      href={getNftUrl({
        contract: token?.contract,
        tokenId: token?.tokenId,
      })}
      name={token?.name || `#${token?.tokenId}`}
      quantityOwned={Number(ownership?.tokenCount || 0)}
      image={token?.imageMedium || token?.image || ''}
      isSelected={isSelected}
      isSelecting={isSelecting}
      hasSelectedMax={hasSelectedMax}
      onClick={handleClick}
    />
  );
};
