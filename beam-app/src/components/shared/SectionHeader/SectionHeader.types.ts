import { ButtonProps } from '@onbeam/ui';
import { ElementType, PropsWithChildren, ReactNode } from 'react';

export type SectionHeaderProps = PropsWithChildren<{
  title: ReactNode;
  as?: ElementType;
  description?: string;
  action?: ButtonProps;
  backHref?: string;
  className?: string;
}>;
