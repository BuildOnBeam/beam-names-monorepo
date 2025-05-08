import { HTMLProps, ReactElement } from 'react';

export type NavigationItem = {
  title: string;
  href: string;
  icon: ReactElement<HTMLProps<SVGElement>, 'svg'>;
  associatedRoutes?: string[];
};
