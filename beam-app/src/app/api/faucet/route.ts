import {
  checksumAddress,
  http,
  isAddress,
  isHex,
  createWalletClient,
  parseEther,
  parseUnits,
  createPublicClient,
  Address,
} from 'viem';
import { beamTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { redis } from '@/lib/redis';
import { addHours, formatDistanceToNow } from 'date-fns';

const requestAmount = process.env.NEXT_PUBLIC_BEAM_DISTRIBUTION_AMOUNT || '0.5';

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();

    if (!isAddress(requestBody.address)) {
      return Response.json(
        { message: 'Invalid wallet address' },
        {
          status: 422,
        },
      );
    }

    const address = checksumAddress(requestBody.address);
    const recentRequestAt = await redis.get(address);

    if (recentRequestAt) {
      const requestDate = addHours(new Date(recentRequestAt), 24);

      return Response.json(
        {
          message: `You have recently requested Beam already. Please try again ${formatDistanceToNow(requestDate, { addSuffix: true })}`,
        },
        {
          status: 403,
        },
      );
    }

    const hash = await distributeBeam(address);

    // Populate the cache (24 hour retention)
    await redis.set(address, new Date().toISOString(), {
      EX: 60 * 60 * 24,
    });

    return Response.json(
      { hash },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      return Response.json(
        { message: error.message },
        {
          status: 500,
        },
      );
    }

    console.error(error);
    return Response.json(
      { message: 'Unknown error' },
      {
        status: 500,
      },
    );
  }
}

const distributeBeam = async (address: Address) => {
  const chain = beamTestnet;
  const privateKey = process.env.BEAM_DISTRIBUTION_WALLET_PRIVATE_KEY;

  if (!isHex(privateKey)) {
    throw new Error('Private key is not a hex');
  }

  const account = privateKeyToAccount(privateKey);

  const walletClient = createWalletClient({
    account,
    transport: http(),
    chain,
  });

  const client = createPublicClient({
    chain,
    transport: http(),
  });

  const balanceOf = await client.getBalance({ address: account.address });

  if (typeof balanceOf !== 'bigint') {
    throw new Error('Asset native balance invalid');
  }

  if (balanceOf < parseEther(requestAmount)) {
    throw new Error('Insufficient faucet balance');
  }

  return await walletClient.sendTransaction({
    chain,
    to: address,
    value: parseUnits(requestAmount, chain.nativeCurrency.decimals),
  });
};
