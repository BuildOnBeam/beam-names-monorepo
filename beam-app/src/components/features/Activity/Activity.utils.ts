import { listTransactions, ListTransactionsParams } from '@/api/glacier-api';
import { DEFAULT_CHAIN_ID } from '@/constants';
import { Address } from 'viem';

type Props = {
  address?: Address;
} & ListTransactionsParams;

export const getActivities = async ({
  address,
  pageToken,
  ...props
}: Props) => {
  if (!address) throw new Error('Address is required');

  const response = await listTransactions(
    DEFAULT_CHAIN_ID.toString(),
    address,
    {
      ...(pageToken && { pageToken }),
      ...props,
    },
  );

  if (!('transactions' in response.data))
    throw new Error('No transactions found');

  return response.data;
};
