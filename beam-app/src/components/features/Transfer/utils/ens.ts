// src/utils/ens.ts
import { createPublicClient, http } from 'viem';
import { namehash } from 'viem/ens';

export const ENS_REGISTRY_ADDRESS = '0x688889c59EA2bc07ecA840b0D78a4aF042c83096';
export const PUBLIC_RESOLVER_ADDRESS = '0x310B595EB6d4356a8B0A61b41D5169B19e1Ee440';

export const ENS_REGISTRY_ABI = [
    {
        constant: true,
        inputs: [{ name: 'node', type: 'bytes32' }],
        name: 'resolver',
        outputs: [{ name: '', type: 'address' }],
        type: 'function',
    },
];

export const PUBLIC_RESOLVER_ABI = [
    {
        constant: true,
        inputs: [{ name: 'node', type: 'bytes32' }],
        name: 'addr',
        outputs: [{ name: '', type: 'address' }],
        type: 'function',
    },
];

export async function resolveBeamName(name: string): Promise<string> {
    try {
        const client = createPublicClient({
            chain: {
                id: 4337,
                name: 'Beam Testnet',
                network: 'beam-testnet',
                nativeCurrency: { name: 'BEAM', symbol: 'BEAM', decimals: 18 },
                rpcUrls: { default: { http: ['https://build.onbeam.com/rpc/testnet'] } },
            },
            transport: http(),
        });

        const node = namehash(name);
        const ensRegistry = {
            address: ENS_REGISTRY_ADDRESS,
            abi: ENS_REGISTRY_ABI,
        };
        const resolverAddr = await client.readContract({
            ...ensRegistry,
            functionName: 'resolver',
            args: [node],
        } as any);

        if (resolverAddr === '0x0000000000000000000000000000000000000000') {
            throw new Error('No resolver set for this name');
        }

        const publicResolver = {
            address: PUBLIC_RESOLVER_ADDRESS,
            abi: PUBLIC_RESOLVER_ABI,
        };
        const addr = await client.readContract({
            ...publicResolver,
            functionName: 'addr',
            args: [node],
        } as any);

        if (addr === '0x0000000000000000000000000000000000000000') {
            throw new Error('No address set for this name');
        }

        return addr as `0x${string}`;
    } catch (error) {
        console.error('Error resolving ENS name:', error);
        throw error;
    }
}