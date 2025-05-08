import { isTestnet } from '@/config/isTestnet';
import { beamTestnet, beam } from 'viem/chains';

export const DEFAULT_CHAIN_ID = isTestnet ? beamTestnet.id : beam.id;
