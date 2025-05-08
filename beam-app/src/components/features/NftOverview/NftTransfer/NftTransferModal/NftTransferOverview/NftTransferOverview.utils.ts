import { SelectedNft } from '@/components/features/NftOverview/NftTransfer';
import {
  DEFAULT_CHAIN_ID,
  TOKENBEAMER_CONTRACT_ADDRESS,
  TOKENBEAMER_ABI,
} from '@/constants';
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig';
import { getAccount, readContract } from '@wagmi/core';
import { Address, BaseError, checksumAddress } from 'viem';

export const getUnapprovedContracts = async (selectedNfts: SelectedNft[]) => {
  const { address: userAddress } = getAccount(wagmiConfig);

  if (!userAddress)
    throw new BaseError('Please connect your wallet to continue');

  const { contracts, kinds } = selectedNfts
    .filter((nft) => !!nft.quantity)
    .reduce(
      (acc, nft) => {
        const contract = checksumAddress(nft.contract as Address);

        if (!acc.contracts.includes(contract)) {
          acc.contracts.push(contract);
          acc.kinds.push(nft.kind);
        }

        return acc;
      },
      { contracts: [] as Address[], kinds: [] as number[] },
    );

  const contractApprovals = await readContract(wagmiConfig, {
    chainId: DEFAULT_CHAIN_ID,
    account: userAddress,
    address: TOKENBEAMER_CONTRACT_ADDRESS,
    abi: TOKENBEAMER_ABI,
    functionName: 'getApprovals',
    args: [
      userAddress as Address,
      TOKENBEAMER_CONTRACT_ADDRESS,
      contracts,
      kinds,
      [],
      [],
    ],
  });

  const unapprovedContracts = contracts.filter(
    (_, index) => !contractApprovals?.[index],
  );

  return unapprovedContracts;
};
