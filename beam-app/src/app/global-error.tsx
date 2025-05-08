'use client';

import { ErrorLayout, Main } from '@/components';
import { flex, vstack } from '@onbeam/styled-system/patterns';
import { AppBackground, Button } from '@onbeam/ui';
import Link from 'next/link';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

type Props = { error: Error & { digest?: string } };

const GlobalError = ({ error }: Props) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        className={vstack({
          minH: '[100vh]',
        })}
      >
        <AppBackground />
        <Main>
          <ErrorLayout errorCode="500">
            <div
              className={flex({
                gap: '1',
                flexDir: { base: 'column', sm: 'row' },
              })}
            >
              <Button as={Link} href="/" variant="secondary" size="lg">
                return to home
              </Button>
              <Button onClick={() => window.location.reload()} size="lg">
                reload page
              </Button>
            </div>
          </ErrorLayout>
        </Main>
      </body>
    </html>
  );
};

export default GlobalError;
