import { GetUsersUserTokensV7Params } from '@/api/reservoir-api';
import { Address } from 'viem';

export type GetUserNftsProps = {
  address?: Address;
} & GetUsersUserTokensV7Params;
