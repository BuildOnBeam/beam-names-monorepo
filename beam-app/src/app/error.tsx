'use client';

import { ErrorLayout } from '@/components/features/layout/ErrorLayout';
import { flex } from '@onbeam/styled-system/patterns';
import { Button } from '@onbeam/ui';
import type { NextPage } from 'next/types';
import Link from 'next/link';
import { Main } from '@/components';

const Page: NextPage = () => (
  <Main>
    <ErrorLayout errorCode="500">
      <div
        className={flex({ gap: '1', flexDir: { base: 'column', sm: 'row' } })}
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
);

export default Page;
