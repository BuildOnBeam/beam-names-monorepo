'use client';

import { FeatureItem } from './FeatureItem';
import { ConnectWalletButton } from '@onbeam/features';
import { css } from '@onbeam/styled-system/css';
import { grid, text, vstack } from '@onbeam/styled-system/patterns';
import { Divider } from '@onbeam/ui';
import { PropsWithChildren } from 'react';
import { useAccount } from 'wagmi';

export const DisconnectedBoundary = ({ children }: PropsWithChildren) => {
  const { isConnected } = useAccount();

  if (isConnected) return children;

  return (
    <div className={vstack({ flex: '1', maxH: '[48rem]', my: 'auto' })}>
      <div
        className={vstack({
          flex: '1',
          gap: '6',
          align: 'center',
          justify: 'center',
          textAlign: 'center',
          py: '8',
          md: { py: '12' },
        })}
      >
        <h1 className={text({ style: 'header' })}>Welcome to Beam</h1>
        <ConnectWalletButton ignoreUnsupported />
      </div>
      <Divider className={css({ my: '6' })} />
      <div
        className={grid({
          columns: 1,
          gap: '8',
          pb: '8',
          md: { gridTemplateColumns: '3', pb: '20' },
        })}
      >
        <FeatureItem title="Take back control">
          Monitor balances, send and swap tokens seamlessly
        </FeatureItem>
        <FeatureItem title="Your gateway to Beam">
          Buy BEAM and transfer assets between other blockchains and the Beam
          Network
        </FeatureItem>
        <FeatureItem title="A personal overview">
          An in-depth overview of all your tokens, NFTs and activity
        </FeatureItem>
      </div>
    </div>
  );
};
