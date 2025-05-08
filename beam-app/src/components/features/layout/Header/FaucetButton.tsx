'use client';

import { isTestnet } from '@/config/isTestnet';
import { DEFAULT_CHAIN_ID } from '@/constants';
import { getExplorerUrl } from '@/helpers';
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig';
import { useBalance } from '@onbeam/features';
import { css } from '@onbeam/styled-system/css';
import { Button, ButtonProps, toast, Tooltip } from '@onbeam/ui';
import { waitForTransactionReceipt } from '@wagmi/core';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const FaucetButton = (props: ButtonProps) => {
  const { address } = useAccount();
  const [isLoading, setLoading] = useState(false);
  const { refetchBalances } = useBalance();

  if (!address || !isTestnet) return null;

  const onRequest = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/faucet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          address,
        }),
      }).then((res) => res.json());

      if (response.hash) {
        const receipt = await waitForTransactionReceipt(wagmiConfig, {
          chainId: DEFAULT_CHAIN_ID,
          hash: response.hash,
        });

        if (receipt.status !== 'success') throw new Error('Transaction failed');

        toast.success('BEAM received', {
          description: (
            <a
              className={css({
                transition: 'colors',
                _hover: { color: 'mono.200' },
              })}
              href={getExplorerUrl(response.hash)}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on explorer
            </a>
          ),
        });

        refetchBalances();

        return;
      }

      toast.error('Request failed', {
        description: response.message || 'An unknown error has occurred',
      });
    } catch (error) {
      console.error(error);
      toast.error('Request failed', {
        description: 'An unknown error has occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip
      label={`On testnet, you can request ${process.env.NEXT_PUBLIC_BEAM_DISTRIBUTION_AMOUNT} BEAM from our faucet every 24 hours for testing.`}
      width={216}
    >
      <Button
        size="sm"
        onClick={onRequest}
        isLoading={isLoading}
        loadingMessage="requesting beam"
        {...props}
      >
        request {process.env.NEXT_PUBLIC_BEAM_DISTRIBUTION_AMOUNT} beam
      </Button>
    </Tooltip>
  );
};
