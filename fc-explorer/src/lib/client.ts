import { createPublicClient, http } from 'viem';
import { RPC_URL, fcChain } from './config';

export const publicClient = createPublicClient({
  chain: fcChain,
  transport: http(RPC_URL)
});
