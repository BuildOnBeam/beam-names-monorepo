import { cx } from '@onbeam/styled-system/css';
import { vstack } from '@onbeam/styled-system/patterns';
import { HTMLAttributes } from 'react';

export const Main = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement>) => (
  <main
    className={cx(
      vstack({
        w: 'full',
        flex: '1',
        px: '4',
        py: '8',

        md: {
          px: '0',
          py: '10',
        },
      }),
      className,
    )}
    {...props}
  >
    {children}
  </main>
);
