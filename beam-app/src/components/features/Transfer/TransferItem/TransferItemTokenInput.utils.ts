import {
  DEFAULT_CHAIN_ID,
  TOKENBEAMER_ABI,
  TOKENBEAMER_CONTRACT_ADDRESS,
} from '@/constants';
import { nativeCurrency } from '@/constants/currencies';
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig';
import { bigintToNumber, estimateGas, safeSwitchChain } from '@onbeam/utils';
import { Address } from 'viem';

type Props = {
  balance?: bigint;
  address?: Address;
};

export const getRemainingAmountAfterGas = async ({
  balance,
  address,
}: Props) => {
  await safeSwitchChain(wagmiConfig, DEFAULT_CHAIN_ID);

  const gasFee = await estimateGas(wagmiConfig, {
    account: address,
    abi: TOKENBEAMER_ABI,
    address: TOKENBEAMER_CONTRACT_ADDRESS,
    functionName: 'beamTokens',
    args: [[address], [nativeCurrency.address], [0], [0n], [balance]],
    value: balance,
  });

  const amount = bigintToNumber(
    (balance || 0n) - gasFee.wei,
    nativeCurrency.decimals,
  );

  return amount;
};
