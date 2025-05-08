import { PropsWithChildren } from 'react';

export type ErrorLayoutProps = PropsWithChildren & {
  title?: string;
  description?: string;
  errorCode?: string;
};
