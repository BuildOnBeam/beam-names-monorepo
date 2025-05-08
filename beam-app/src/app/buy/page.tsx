'use client';

import { DisconnectedBoundary, SectionHeader } from '@/components';
import { isTestnet } from '@/config/isTestnet';
import { OnRamp, TransakEnvironment } from '@onbeam/onramp';
import { css } from '@onbeam/styled-system/css';
import { Card, PoweredByBeamBanner, Skeleton } from '@onbeam/ui';
import { useAccount } from 'wagmi';

const API_KEY = process.env.NEXT_PUBLIC_TRANSAK_API_KEY;

export default function BuyPage() {
  const { address } = useAccount();

  if (!API_KEY) {
    throw new Error('Missing Transak API key');
  }

  return (
    <DisconnectedBoundary>
      <div className={css({ maxW: '[34.375rem]', w: 'full', mx: 'auto' })}>
        <SectionHeader
          title="Buy"
          description="Purchase BEAM directly to your connected wallet by paying with fiat currencies."
        />
        <OnRamp
          className={css({
            h: '[48rem]',
            '@media (max-width: 549px)': {
              mx: '-4',
              w: 'auto!',
            },
          })}
          config={{
            network: 'beam',
            environment: isTestnet
              ? TransakEnvironment.STAGING
              : TransakEnvironment.PRODUCTION,
            apiKey: API_KEY,
            walletAddress: address,
            cryptoCurrencyCode: 'BEAM',
          }}
          loadingComponent={
            <Card size="lg">
              <Skeleton className={css({ h: '[40.625rem]' })} />
              <PoweredByBeamBanner className={css({ mt: '5' })} />
            </Card>
          }
          withCard
        />
      </div>
    </DisconnectedBoundary>
  );
}
