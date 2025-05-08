'use client';

import { DisconnectedBoundary, SectionHeader } from '@/components';
import { isTestnet } from '@/config/isTestnet';
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig';
import { Bridge } from '@onbeam/bridge';
import { useBalance, useConversionRate } from '@onbeam/features';
import { css } from '@onbeam/styled-system/css';
import { Card, PoweredByBeamBanner, Skeleton } from '@onbeam/ui';
import { isBeamConnector } from '@onbeam/utils';
import { useSearchParams } from 'next/navigation';
import { beam, beamTestnet } from 'viem/chains';
import { useAccount } from 'wagmi';

export default function BridgePage() {
  const searchParams = useSearchParams();
  const { connector } = useAccount();
  const { conversionRates } = useConversionRate();
  const { refetchBalances } = useBalance();

  return (
    <DisconnectedBoundary>
      <div className={css({ maxW: '[34.375rem]', w: 'full', mx: 'auto' })}>
        <SectionHeader
          title="Bridge"
          description="Transfer any crypto asset between other blockchains and the Beam Network using the Beam Bridge. An example would be moving BEAM between Ethereum and the Beam Network."
        />
        <Bridge
          className={css({
            '@media (max-width: 549px)': {
              mx: '-4',
              w: 'auto!',
            },
          })}
          wagmiConfig={wagmiConfig}
          isTestnet={isTestnet}
          conversionRates={conversionRates}
          defaultCurrency={searchParams.get('currency') || undefined}
          onBridge={refetchBalances}
          loadingComponent={
            <Card size="lg">
              <Skeleton className={css({ h: '[38rem]' })} />
              <PoweredByBeamBanner className={css({ mt: '10' })} />
            </Card>
          }
          withCard
          {...(isBeamConnector(connector) && {
            /* Restrict supported source chains to Beam chains when the user is connected via the Beam connector. */
            supportedSourceChainIds: [beam.id, beamTestnet.id],
            /* Enforce the use of the 'custom recipient' field to prevent users from bridging funds to themselves on unsupported chains. */
            isRecipientRequired: true,
          })}
        />
      </div>
    </DisconnectedBoundary>
  );
}
