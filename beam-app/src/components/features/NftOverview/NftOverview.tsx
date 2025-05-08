'use client';

import { flex, grid, vstack } from '@onbeam/styled-system/patterns';
import { ActionMenu, Button, Divider } from '@onbeam/ui';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { getUserNfts } from '@/actions';
import { useAccount } from 'wagmi';
import { css, cx } from '@onbeam/styled-system/css';
import { tile } from '@onbeam/styled-system/recipes';
import { compareAddresses, isDefined, useDebouncedValue } from '@onbeam/utils';
import { useEffect, useState } from 'react';
import { GetUsersUserTokensV7SortDirection } from '@/api/reservoir-api';
import {
  EmptyResults,
  NFTTileSkeleton,
  SearchBar,
  SkeletonList,
} from '@/components';
import {
  MAX_NFTS_PER_TRANSFER,
  NftTransfer,
  useNftTransferStore,
} from './NftTransfer';
import { AnimatePresence } from 'motion/react';
import { NftOverviewTile } from './NftOverviewTile';
import { NftOverviewEmpty } from './NftOverviewEmpty';

export const NftOverview = () => {
  const { address } = useAccount();
  const { isSelecting, selectedNfts, setSelecting, setState, reset } =
    useNftTransferStore();

  /* Reset the store when the address changes to prevent the user from having NFTs selected that they do not own. */
  useEffect(() => {
    if (!address) return;
    reset();
  }, [address, reset]);

  const [sortDirection, setSortDirection] =
    useState<GetUsersUserTokensV7SortDirection>('desc');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, search ? 300 : 0);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['nft-overview', address, debouncedSearch, sortDirection],
      placeholderData: keepPreviousData,
      initialPageParam: '',
      queryFn: ({ pageParam }) =>
        getUserNfts({
          address,
          limit: 24,
          search: debouncedSearch,
          sortDirection,
          continuation: pageParam,
        }),
      getNextPageParam: (lastPage) => lastPage.continuation,
    });

  const tokens = data?.pages.flatMap((page) => page.tokens).filter(isDefined);

  const isAllSelected =
    selectedNfts.length >= MAX_NFTS_PER_TRANSFER ||
    !!tokens?.every(({ token }) =>
      selectedNfts.some(
        (nft) =>
          nft.id === token?.tokenId &&
          compareAddresses(nft.contract, token?.contract),
      ),
    );

  const handleSelectAll = () =>
    setState({
      selectedNfts: isAllSelected
        ? []
        : tokens
            ?.slice(0, MAX_NFTS_PER_TRANSFER)
            .map(({ token, ownership }) => ({
              id: token?.tokenId || '',
              contract: token?.contract || '',
              kind: token?.kind?.includes('721') ? 721 : 1155,
              quantity: 1,
              quantityOwned: Number(ownership?.tokenCount || 0),
              name: token?.name || `#${token?.tokenId}`,
              image: token?.imageMedium || token?.image || '',
            })),
    });

  return (
    <div className={cx(tile(), vstack({ flex: '1', p: '4', pb: '6' }))}>
      <div
        className={flex({
          direction: 'column',
          gap: '4',
          mb: '4',
          md: { flexDir: 'row' },
        })}
      >
        <SearchBar
          placeholder="Search NFT"
          value={search}
          setValue={setSearch}
        />
        <div className={flex({ gap: '2' })}>
          <ActionMenu
            triggerProps={{
              className: css({ w: 'full', md: { w: '[8.625rem]' } }),
            }}
            items={[
              { value: 'desc', label: 'newest' },
              { value: 'asc', label: 'oldest' },
            ]}
            value={sortDirection}
            onValueChange={(value: GetUsersUserTokensV7SortDirection) =>
              setSortDirection(value)
            }
          />
          <Button
            className={css({ w: 'full', md: { w: '[7rem]' } })}
            onClick={() => setSelecting(!isSelecting)}
          >
            {isSelecting ? 'cancel' : 'select'}
          </Button>
        </div>
      </div>
      <Divider />
      <AnimatePresence>
        {isSelecting && (
          <NftTransfer
            isAllSelected={isAllSelected}
            onSelectAll={handleSelectAll}
          />
        )}
      </AnimatePresence>
      {isLoading || !!tokens?.length ? (
        <div
          className={grid({
            columns: { base: 1, sm: 2, lg: 3 },
            gap: '4',
            mt: '4',
          })}
        >
          {isLoading && <SkeletonList count={9} component={NFTTileSkeleton} />}
          {tokens?.map((token) => (
            <NftOverviewTile
              key={(token.token?.tokenId || '') + (token.token?.contract || '')}
              {...token}
            />
          ))}
        </div>
      ) : !!search ? (
        <EmptyResults noun="NFTs" onClear={() => setSearch('')} />
      ) : (
        <NftOverviewEmpty />
      )}
      {hasNextPage && (
        <Button
          className={css({ mt: '4', mx: 'auto' })}
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
        >
          load more
        </Button>
      )}
    </div>
  );
};
