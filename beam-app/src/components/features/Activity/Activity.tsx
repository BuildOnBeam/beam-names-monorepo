'use client';

import { css, cx } from '@onbeam/styled-system/css';
import { flex, vstack } from '@onbeam/styled-system/patterns';
import { tile } from '@onbeam/styled-system/recipes';
import { ActionMenu, Button, Divider } from '@onbeam/ui';
import { ActivityItem } from './ActivityItem';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { getActivities } from './Activity.utils';
import { Fragment, useState } from 'react';
import { formatEther, isAddress } from 'viem';
import { isDefined } from '@onbeam/utils';
import { SortOrder } from '@/api/glacier-api';
import { EmptyResults, SearchBar, SkeletonList } from '@/components';

export const Activity = () => {
  const { address: userAddress } = useAccount();
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [addressFilter, setAddressFilter] = useState('');

  const address =
    addressFilter && isAddress(addressFilter) ? addressFilter : userAddress;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['activities', address, sortOrder],
      initialPageParam: '',
      queryFn: ({ pageParam }) =>
        getActivities({
          address,
          sortOrder,
          pageToken: pageParam,
          pageSize: 20,
        }),
      getNextPageParam: (lastPage) => lastPage.nextPageToken,
    });

  const activities = data?.pages
    .flatMap((page) => page.transactions)
    .filter(isDefined);

  return (
    <div className={cx(tile(), vstack({ flex: '1', p: '4', align: 'center' }))}>
      <div className={css({ w: 'full' })}>
        <div
          className={flex({
            direction: 'column',
            w: 'full',
            gap: '4',
            md: { flexDir: 'row' },
          })}
        >
          <SearchBar
            placeholder="Search by wallet address"
            value={addressFilter}
            setValue={setAddressFilter}
            hasError={!!addressFilter && !isAddress(addressFilter)}
          />
          <ActionMenu
            triggerProps={{
              className: css({
                flexShrink: '0',
                w: 'full',
                md: { w: '[8.625rem]' },
              }),
            }}
            items={[
              { value: 'desc', label: 'newest' },
              { value: 'asc', label: 'oldest' },
            ]}
            value={sortOrder}
            onValueChange={(value: SortOrder) => setSortOrder(value)}
          />
        </div>
        <Divider className={css({ mt: '4', mb: '2' })} />
      </div>
      {isLoading ? (
        <SkeletonList
          count={20}
          className={css({ rounded: 'md', h: '[3.25rem]', my: '1' })}
        />
      ) : !!activities?.length ? (
        activities.map((activity) => (
          <Fragment key={activity.nativeTransaction.txHash}>
            <ActivityItem
              hash={activity.nativeTransaction.txHash}
              from={activity.nativeTransaction.from.address}
              to={activity.nativeTransaction.to.address}
              value={formatEther(BigInt(activity.nativeTransaction.value))}
              timestamp={activity.nativeTransaction.blockTimestamp * 1000}
            />
            <Divider className={css({ md: { display: 'none' } })} />
          </Fragment>
        ))
      ) : !!addressFilter ? (
        <EmptyResults noun="activities" onClear={() => setAddressFilter('')} />
      ) : (
        <EmptyResults>
          There's no activity to show yet.
          <br /> As you explore and interact, your activity will appear here.
        </EmptyResults>
      )}
      {hasNextPage && (
        <Button
          className={css({ mt: '3' })}
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
        >
          load more
        </Button>
      )}
    </div>
  );
};
