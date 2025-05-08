'use server';

import { isAddress } from 'viem';
import { GetUserNftsProps } from './getUserNfts.types';
import { getUsersUserTokensV7 } from '@/api/reservoir-api';

export const getUserNfts = async ({
  address,
  continuation,
  search,
  ...props
}: GetUserNftsProps) => {
  if (!process.env.RESERVOIR_API_KEY)
    throw new Error('RESERVOIR_API_KEY is not set');

  if (!address) throw new Error('Address is required');

  const searchProps = search
    ? isAddress(search)
      ? { contract: search }
      : { search: search.replace(/^#/, '') }
    : {};

  const response = await getUsersUserTokensV7(
    address,
    {
      ...(continuation && { continuation }),
      ...searchProps,
      ...props,
    },
    {
      headers: {
        'x-api-key': process.env.RESERVOIR_API_KEY,
      },
    },
  );

  return response.data;
};
