'use client';

import { grid } from '@onbeam/styled-system/patterns';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { getNftUrl } from '@/helpers';
import {
  NFTTile,
  NFTTileSkeleton,
  SkeletonList,
  SphereTile,
} from '@/components';
import { getUserNfts } from '@/actions';

export const WalletNFTs = () => {
  const { address } = useAccount();

  const { data, isLoading } = useQuery({
    queryKey: ['wallet-nfts', address],
    queryFn: () => getUserNfts({ address, limit: 3 }),
  });

  const nftCount = data?.tokens?.length || 0;

  return (
    <div
      className={grid({
        gap: '4',
        overflowX: 'auto',
        mx: '-4',
        px: '4',
        gridTemplateColumns: '[repeat(var(--columns), minmax(16rem, 1fr))]',
        lg: {
          gridTemplateColumns: '[repeat(3, minmax(16rem, 1fr))]',
          overflowX: 'hidden',
          mx: '0',
          px: '0',
        },
        scrollbarWidth: '[none]',
        '& *::-webkit-scrollbar': {
          display: 'none',
        },
      })}
      style={{
        '--columns': Math.min(3, nftCount + 1),
      }}
    >
      {isLoading ? (
        <SkeletonList count={3} component={NFTTileSkeleton} />
      ) : (
        <>
          {data?.tokens?.map((token) => (
            <NFTTile
              key={(token.token?.tokenId || '') + (token.token?.contract || '')}
              href={getNftUrl({
                contract: token.token?.contract,
                tokenId: token.token?.tokenId,
              })}
              name={token.token?.name || token.token?.tokenId || ''}
              quantityOwned={Number(token.ownership?.tokenCount || 0)}
              image={token.token?.imageMedium || token.token?.image || ''}
            />
          ))}
          {nftCount < 3 && <SphereTile nftCount={nftCount} />}
        </>
      )}
    </div>
  );
};
