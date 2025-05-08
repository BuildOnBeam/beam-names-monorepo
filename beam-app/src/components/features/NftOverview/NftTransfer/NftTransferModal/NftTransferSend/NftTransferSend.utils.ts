import { SelectedNft } from '@/components/features/NftOverview/NftTransfer';
import {
  DEFAULT_CHAIN_ID,
  TOKENBEAMER_ABI,
  TOKENBEAMER_CONTRACT_ADDRESS,
} from '@/constants';
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig';
import { compareAddresses, safeSwitchChain } from '@onbeam/utils';
import {
  getAccount,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { Address, BaseError, erc721Abi, erc1155Abi, isAddress } from 'viem';
import { z } from 'zod';

export const transferNftSchema = (userAddress?: string) =>
  z.object({
    recipient: z
      .custom<Address>(isAddress, {
        message: 'Please enter a valid recipient address',
      })
      .refine((value) => !compareAddresses(value, userAddress), {
        message:
          "Please use a different address, you can't transfer to the same address that you're currently connected with.",
      }),
  });

export type TransferNftSchemaType = z.TypeOf<
  ReturnType<typeof transferNftSchema>
>;

export const handleTransferNfts = async (
  recipient: Address,
  selectedNfts: SelectedNft[],
) => {
  await safeSwitchChain(wagmiConfig, DEFAULT_CHAIN_ID);

  /* If we're only transferring a single NFT, we can handle it without using the TokenBeamer contract. */
  if (selectedNfts.length === 1) {
    return handleSingleNftTransfer(recipient, selectedNfts[0]);
  }

  const { request } = await simulateContract(wagmiConfig, {
    chainId: DEFAULT_CHAIN_ID,
    abi: TOKENBEAMER_ABI,
    address: TOKENBEAMER_CONTRACT_ADDRESS,
    functionName: 'beamTokens',
    args: [
      [recipient],
      selectedNfts.map((nft) => nft.contract) as Address[],
      selectedNfts.map((nft) => nft.kind),
      selectedNfts.map((nft) => BigInt(nft.id)),
      selectedNfts.map((nft) => BigInt(nft.quantity)),
    ],
  });

  const hash = await writeContract(wagmiConfig, request);
  return verifyTransaction(hash);
};

export const handleSingleNftTransfer = async (
  recipient: Address,
  { contract, id, kind, quantity }: SelectedNft,
) => {
  const { address: userAddress } = getAccount(wagmiConfig);

  if (!userAddress) throw new BaseError('You must connect your wallet first');

  const is1155 = kind === 1155;

  const { request } = await simulateContract(wagmiConfig, {
    chainId: DEFAULT_CHAIN_ID,
    abi: is1155 ? erc1155Abi : erc721Abi,
    address: contract as Address,
    functionName: 'safeTransferFrom',
    args: is1155
      ? [userAddress, recipient, BigInt(id), BigInt(quantity), '0x']
      : [userAddress, recipient, BigInt(id)],
  });

  const hash = await writeContract(wagmiConfig, request);
  return verifyTransaction(hash);
};

const verifyTransaction = async (hash: Address) => {
  const receipt = await waitForTransactionReceipt(wagmiConfig, {
    chainId: DEFAULT_CHAIN_ID,
    hash,
  });

  if (receipt.status !== 'success') {
    throw new BaseError('Transaction failed, please try again later');
  }

  return hash;
};
