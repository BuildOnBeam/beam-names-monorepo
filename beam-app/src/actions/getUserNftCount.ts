'use server';

import {
  GetUsersUserTokensCountV1Params,
  getUsersUserTokensCountV1,
} from '@/api/reservoir-api';
import { Address } from 'viem';

export const getUserNftCount = async ({
  address,
  ...props
}: { address?: Address } & GetUsersUserTokensCountV1Params) => {
  if (!process.env.RESERVOIR_API_KEY)
    throw new Error('RESERVOIR_API_KEY is not set');

  if (!address) throw new Error('Address is required');

  const response = await getUsersUserTokensCountV1(address, props, {
    headers: {
      'x-api-key': process.env.RESERVOIR_API_KEY,
    },
  });

  return response.data;
};
