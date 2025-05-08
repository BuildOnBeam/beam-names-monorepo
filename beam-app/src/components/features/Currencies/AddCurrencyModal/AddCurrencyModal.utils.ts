import { DEFAULT_CHAIN_ID } from '@/constants';
import { Currency } from '@/helpers';
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig';
import { multicall } from '@wagmi/core';
import { Address, erc20Abi } from 'viem';

export const findCurrency = async (
  address: Address,
): Promise<Currency | undefined> => {
  const contract = {
    address,
    abi: erc20Abi,
  };

  const [{ result: symbol }, { result: name }, { result: decimals }] =
    await multicall(wagmiConfig, {
      chainId: DEFAULT_CHAIN_ID,
      contracts: [
        {
          ...contract,
          functionName: 'symbol',
        },
        {
          ...contract,
          functionName: 'name',
        },
        {
          ...contract,
          functionName: 'decimals',
        },
      ],
    });

  if (!symbol || !name || !decimals) return;

  return {
    address,
    symbol: symbol.replace(/^\$/, ''),
    name,
    decimals,
  };
};
