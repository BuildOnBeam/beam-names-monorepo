import { css } from '@onbeam/styled-system/css';
import { SendStatus } from './TransferSend.types';
import { StatusCircleStatus } from '@/components';
import { SystemStyleObject } from '@onbeam/styled-system/types';
import { TransferSchema } from '@/components/features/Transfer/Transfer.utils';
import {
  BaseError,
  sendTransaction,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig';
import {
  DEFAULT_CHAIN_ID,
  TOKENBEAMER_ABI,
  TOKENBEAMER_CONTRACT_ADDRESS,
} from '@/constants';
import { compareAddresses, safeSwitchChain } from '@onbeam/utils';
import { Address, erc20Abi, parseUnits, zeroAddress } from 'viem';
import { Currency } from '@/helpers';

export const statusMap: Record<SendStatus, StatusCircleStatus> = {
  [SendStatus.PENDING]: 'loading',
  [SendStatus.ERROR]: 'error',
};

export const statusMessageMap: Record<
  SendStatus,
  { description: string; styles: SystemStyleObject }
> = {
  [SendStatus.PENDING]: {
    description: 'Sending tokens...',
    styles: css.raw({ color: 'mono.300' }),
  },
  [SendStatus.ERROR]: {
    description: 'Failed to send tokens, please try again',
    styles: css.raw({ color: 'red.500' }),
  },
};

export const handleTransferTokens = async (
  transactions: TransferSchema['transactions'],
  currencies: Currency[],
) => {
  await safeSwitchChain(wagmiConfig, DEFAULT_CHAIN_ID);

  const totalNativeTokens = transactions
    .flatMap(({ tokens }) => tokens)
    .filter(({ currencyAddress }) =>
      compareAddresses(currencyAddress, zeroAddress),
    )
    .reduce((acc, { amount }) => acc + (amount || 0), 0);

  const transfers = transactions.flatMap(({ recipient, tokens }) =>
    tokens.map(({ amount, currencyAddress }) => {
      const decimals =
        currencies.find((currency) =>
          compareAddresses(currency.address, currencyAddress),
        )?.decimals || 18;

      const isNative = compareAddresses(currencyAddress, zeroAddress);

      return {
        recipient,
        currencyAddress,
        type: isNative ? 0 : 20,
        tokenId: 0n,
        value: parseUnits(String(amount), decimals),
      };
    }),
  );

  /* If there is only one transfer, we can handle it without using the TokenBeamer contract. */
  if (transfers.length === 1) {
    return handleSingleTokenTransfer(transfers[0]);
  }

  const { request } = await simulateContract(wagmiConfig, {
    chainId: DEFAULT_CHAIN_ID,
    abi: TOKENBEAMER_ABI,
    address: TOKENBEAMER_CONTRACT_ADDRESS,
    functionName: 'beamTokens',
    args: [
      transfers.map((transfer) => transfer.recipient),
      transfers.map((transfer) => transfer.currencyAddress),
      transfers.map((transfer) => transfer.type),
      transfers.map((transfer) => transfer.tokenId),
      transfers.map((transfer) => transfer.value),
    ],
    value: parseUnits(String(totalNativeTokens), 18),
  });

  const hash = await writeContract(wagmiConfig, request);
  return verifyTransaction(hash);
};

const handleSingleTokenTransfer = async ({
  recipient,
  currencyAddress,
  value,
}: {
  recipient: Address;
  currencyAddress: Address;
  value: bigint;
}) => {
  const isNative = compareAddresses(currencyAddress, zeroAddress);

  if (isNative) {
    const hash = await sendTransaction(wagmiConfig, {
      chainId: DEFAULT_CHAIN_ID,
      to: recipient,
      value,
    });

    return verifyTransaction(hash);
  }

  const { request } = await simulateContract(wagmiConfig, {
    chainId: DEFAULT_CHAIN_ID,
    abi: erc20Abi,
    address: currencyAddress,
    functionName: 'transfer',
    args: [recipient, value],
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
