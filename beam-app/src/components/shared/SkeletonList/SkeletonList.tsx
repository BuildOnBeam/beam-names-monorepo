import { Skeleton } from '@onbeam/ui';
import { SkeletonListProps } from './SkeletonList.types';

export const SkeletonList = ({
  count,
  component: CustomSkeleton,
  ...props
}: SkeletonListProps) =>
  Array.from({ length: count }, (_, index) =>
    CustomSkeleton ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: https://www.youtube.com/watch?v=tocmWagn2KM
      <CustomSkeleton key={index} />
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: https://www.youtube.com/shorts/Zj581lHjtGQ
      <Skeleton key={index} {...props} />
    ),
  );
