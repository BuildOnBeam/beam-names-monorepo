'use client';

import { DisconnectedBoundary, SectionHeader } from '@/components';
import { isTestnet } from '@/config/isTestnet';
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig';
import { useBalance, useConversionRate } from '@onbeam/features';
import { css } from '@onbeam/styled-system/css';
import { Swap } from '@onbeam/swap';
import { Card, PoweredByBeamBanner, Skeleton } from '@onbeam/ui';
import { useSearchParams } from 'next/navigation';

export default function SwapPage() {
  const searchParams = useSearchParams();
  const { conversionRates } = useConversionRate();
  const { refetchBalances } = useBalance();

  return (
    <DisconnectedBoundary>
      <div className={css({ maxW: '[34.375rem]', w: 'full', mx: 'auto' })}>
        <SectionHeader
          title="Swap"
          description="Exchange any crypto asset on the Beam Network for another through Beam Swap, a decentralized automated market maker."
        />
        <Swap
          className={css({
            '@media (max-width: 549px)': {
              mx: '-4',
              w: 'auto!',
            },
          })}
          wagmiConfig={wagmiConfig}
          isTestnet={isTestnet}
          conversionRates={conversionRates}
          initialCurrencyInSymbol={searchParams.get('currency') || undefined}
          onSwap={refetchBalances}
          loadingComponent={
            <Card size="lg">
              <Skeleton className={css({ h: '[24.75rem]' })} />
              <PoweredByBeamBanner className={css({ mt: '10' })} />
            </Card>
          }
          withCard
        />
      </div>
    </DisconnectedBoundary>
  );
}
