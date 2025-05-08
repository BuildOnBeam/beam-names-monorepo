'use client';

import { getUserNftCount } from '@/actions';
import { cx } from '@onbeam/styled-system/css';
import { text } from '@onbeam/styled-system/patterns';
import { formatNumber, isNumber } from '@onbeam/utils';
import { useQuery } from '@tanstack/react-query';
import { HTMLAttributes } from 'react';
import { useAccount } from 'wagmi';

export const NFTCount = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  const { address } = useAccount();
  const { data } = useQuery({
    queryKey: ['nft-count', address],
    queryFn: () => getUserNftCount({ address }),
  });
  const nftCount = data?.tokensCount;

  if (!isNumber(nftCount)) return null;

  return (
    <span
      className={cx(text({ md: { textStyle: 'sm' } }), className)}
      {...props}
    >
      ({formatNumber(nftCount)})
    </span>
  );
};
