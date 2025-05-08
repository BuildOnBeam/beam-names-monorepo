import {
  DisconnectedBoundary,
  SectionHeader,
  TransferBulk,
} from '@/components';
import { css } from '@onbeam/styled-system/css';
import { Button } from '@onbeam/ui';
import Link from 'next/link';

export default function TransferBulkPage() {
  return (
    <DisconnectedBoundary>
      <div className={css({ maxW: '[34.375rem]', w: 'full', mx: 'auto' })}>
        <SectionHeader
          title="Bulk send"
          description="Transfer any crypto asset in your connected wallet to multiple addresses at once. Seamlessly move funds on the Beam Network."
        >
          <Button as={Link} href="/send" size="sm">
            default send
          </Button>
        </SectionHeader>
        <TransferBulk />
      </div>
    </DisconnectedBoundary>
  );
}
