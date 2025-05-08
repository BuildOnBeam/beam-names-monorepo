import { DEFAULT_CHAIN_ID, TOKENBEAMER_CONTRACT_ADDRESS } from '@/constants';
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig';
import { safeSwitchChain } from '@onbeam/utils';
import {
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { Address, erc721Abi } from 'viem';

export const handleContractApproval = async (contract: Address) => {
  await safeSwitchChain(wagmiConfig, DEFAULT_CHAIN_ID);

  const { request } = await simulateContract(wagmiConfig, {
    chainId: DEFAULT_CHAIN_ID,
    abi: erc721Abi,
    address: contract,
    functionName: 'setApprovalForAll',
    args: [TOKENBEAMER_CONTRACT_ADDRESS, true],
  });

  const hash = await writeContract(wagmiConfig, request);

  const receipt = await waitForTransactionReceipt(wagmiConfig, {
    chainId: DEFAULT_CHAIN_ID,
    hash,
  });

  if (receipt.status !== 'success') throw new Error('Transaction failed');

  return hash;
};
