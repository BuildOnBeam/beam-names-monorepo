'use server';

import { getCollectionsV7, GetCollectionsV7Params } from '@/api/reservoir-api';

export const getCollections = async (props: GetCollectionsV7Params) => {
  if (!process.env.RESERVOIR_API_KEY)
    throw new Error('RESERVOIR_API_KEY is not set');

  const response = await getCollectionsV7(props, {
    headers: {
      'x-api-key': process.env.RESERVOIR_API_KEY,
    },
  });

  return response.data;
};
