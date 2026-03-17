import { defineChain } from 'viem';

export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? 'http://127.0.0.1:8545';
export const FCDID_REGISTRY = (process.env.NEXT_PUBLIC_FCDID_ADDRESS ?? '0x5FbDB2315678afecb367f032d93F642f64180aa3') as `0x${string}`;
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 1337);

export const fcChain = defineChain({
  id: CHAIN_ID,
  name: 'FC Testnet',
  nativeCurrency: { name: 'FCC', symbol: 'FCC', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
});
