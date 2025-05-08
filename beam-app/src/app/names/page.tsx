import { DisconnectedBoundary, SectionHeader, Transfer } from '@/components';
import { BuyName } from '@/components/features/Names';
import { css } from '@onbeam/styled-system/css';
import { Button } from '@onbeam/ui';
import Link from 'next/link';

export default function NamePage() {
  return (
    <DisconnectedBoundary>
      <div className={css({ maxW: '[34.375rem]', w: 'full', mx: 'auto' })}>
        <SectionHeader
          title="Names"
          description="Buy a .beam name"
        >
        </SectionHeader>
        <BuyName />
      </div>
    </DisconnectedBoundary>
  );
}
