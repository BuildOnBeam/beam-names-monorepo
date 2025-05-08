import { TransferSchema } from '@/components/features/Transfer/Transfer.utils';
import {
  DEFAULT_CHAIN_ID,
  TOKENBEAMER_CONTRACT_ADDRESS,
  TOKENBEAMER_ABI,
} from '@/constants';
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig';
import { getAccount, readContract } from '@wagmi/core';
import {
  Address,
  BaseError,
  checksumAddress,
  parseUnits,
  zeroAddress,
} from 'viem';
import { compareAddresses } from '@onbeam/utils';
import { Currency } from '@/helpers';

export const getUnapprovedContracts = async (
  transactions: TransferSchema['transactions'],
  currencies: Currency[],
) => {
  const { address: userAddress } = getAccount(wagmiConfig);

  if (!userAddress)
    throw new BaseError('Please connect your wallet to continue');

  const tokens = transactions
    .flatMap(({ tokens }) => tokens)
    .reduce<{ address: Address; amount: number }[]>(
      (acc, { currencyAddress, amount }) => {
        const existing = acc.find(({ address }) =>
          compareAddresses(address, currencyAddress),
        );

        if (existing) {
          existing.amount += amount || 0;
        } else {
          acc.push({
            address: checksumAddress(currencyAddress),
            amount: amount || 0,
          });
        }

        return acc;
      },
      [],
    )
    .filter(({ address }) => !compareAddresses(address, zeroAddress));

  if (!tokens.length) return [];

  const parsedAmounts = tokens.map((token) =>
    parseUnits(
      String(token.amount),
      currencies.find((currency) =>
        compareAddresses(currency.address, token.address),
      )?.decimals || 18,
    ),
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
      tokens.map((token) => token.address),
      tokens.map(() => 20),
      [],
      parsedAmounts,
    ],
  });

  const unapprovedContracts = tokens.filter(
    (_, index) => !contractApprovals?.[index],
  );

  return unapprovedContracts;
};
