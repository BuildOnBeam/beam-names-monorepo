import { DisconnectedBoundary, SectionHeader, Transfer } from '@/components';
import { css } from '@onbeam/styled-system/css';
import { Button } from '@onbeam/ui';
import Link from 'next/link';

export default function TransferPage() {
  return (
    <DisconnectedBoundary>
      <div className={css({ maxW: '[34.375rem]', w: 'full', mx: 'auto' })}>
        <SectionHeader
          title="Send"
          description="Transfer any crypto asset in your connected wallet to your own addresses or others. Seamlessly move funds on the Beam Network."
        >
          <Button as={Link} href="/bulk-send" size="sm">
            bulk send
          </Button>
        </SectionHeader>
        <Transfer />
      </div>
    </DisconnectedBoundary>
  );
}
