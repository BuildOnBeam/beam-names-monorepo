// app/Names/Name.utils.ts
import { z } from 'zod';
import { Address, isAddress } from 'viem';

export const NameSchema = z.object({
    name: z
        .string()
        .min(3, 'Name must be at least 3 characters')
        .regex(/^[a-z0-9-]+$/, 'Name can only contain lowercase letters, numbers, and hyphens'),
    duration: z.number().positive('Duration must be positive').default(31536000), // 1 year
    owner: z.custom<Address>(isAddress, 'Invalid owner address'),
});

export type NameSchema = z.infer<typeof NameSchema>;