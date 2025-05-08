import { DEFAULT_CHAIN_ID, TOKENBEAMER_CONTRACT_ADDRESS } from '@/constants';
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig';
import { safeSwitchChain } from '@onbeam/utils';
import {
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { Address, erc20Abi } from 'viem';

export const handleTokenApproval = async (
  contract: Address,
  amount: bigint,
) => {
  await safeSwitchChain(wagmiConfig, DEFAULT_CHAIN_ID);

  const { request } = await simulateContract(wagmiConfig, {
    chainId: DEFAULT_CHAIN_ID,
    abi: erc20Abi,
    address: contract,
    functionName: 'approve',
    args: [TOKENBEAMER_CONTRACT_ADDRESS, amount],
  });

  const hash = await writeContract(wagmiConfig, request);

  const receipt = await waitForTransactionReceipt(wagmiConfig, {
    chainId: DEFAULT_CHAIN_ID,
    hash,
  });

  if (receipt.status !== 'success') throw new Error('Transaction failed');

  return hash;
};
