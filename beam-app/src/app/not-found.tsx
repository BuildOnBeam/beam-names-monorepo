import { Main } from '@/components';
import { ErrorLayout } from '@/components/features/layout/ErrorLayout/ErrorLayout';
import { Button } from '@onbeam/ui';
import Link from 'next/link';
import type { NextPage } from 'next/types';

const Page: NextPage = () => (
  <Main>
    <ErrorLayout
      title="Page not found"
      description="We couldn't find the page you were looking for."
      errorCode="404"
    >
      <Button as={Link} href="/" size="lg">
        return to home
      </Button>
    </ErrorLayout>
  </Main>
);

export default Page;
