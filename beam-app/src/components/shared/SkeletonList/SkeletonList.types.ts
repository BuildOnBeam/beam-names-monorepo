import { SkeletonProps } from '@onbeam/ui';
import { ElementType } from 'react';

export type SkeletonListProps = {
  count: number;
  component?: ElementType;
} & SkeletonProps;
