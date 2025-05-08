import { PropsWithChildren } from 'react';

export type EmptyResultsProps = PropsWithChildren<{
  noun?: string;
  className?: string;
  onClear?(): void;
}>;
