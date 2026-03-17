import { createPublicClient, http, formatEther, parseEther } from 'viem';
import { localhost } from 'viem/chains';
import FCDIDRegistryABI from '../contracts/FCDIDRegistry.json';

const FCDID_REGISTRY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// 1. Point to the Local Hardhat Node
const publicClient = createPublicClient({
  chain: localhost,
  transport: http('http://127.0.0.1:8545'),
});

const simulateNetworkDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const FCChainService = {
  /**
   * Fetches real native balance data for an address on the local Hardhat node.
   */
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await publicClient.getBalance({ address: address as `0x${string}` });
      return formatEther(balance);
    } catch (e) {
      console.error('FC Chain RPC Error: ', e);
      return "0.00";
    }
  },

  /**
   * Reads from the deployed FCDIDRegistry contract to verify an FCDID's token ID and owner.
   */
  async resolveFcdid(domainName: string): Promise<string | null> {
    try {
      // nameToTokenId
      const tokenId = await publicClient.readContract({
        address: FCDID_REGISTRY_ADDRESS,
        abi: FCDIDRegistryABI.abi,
        functionName: 'nameToTokenId',
        args: [domainName]
      });

      if (tokenId === 0n) return null; // 0 means not registered

      const ownerStr = await publicClient.readContract({
        address: FCDID_REGISTRY_ADDRESS,
        abi: FCDIDRegistryABI.abi,
        functionName: 'ownerOf',
        args: [tokenId]
      });

      return ownerStr as string;
    } catch (e) {
      console.error('Resolve FCDID Error: ', e);
      return null;
    }
  },

  /**
   * Fetches all registered FCDIDs for a given address using ERC721Enumerable
   */
  async getOwnedFCDIDs(ownerAddress: string): Promise<string[]> {
    try {
      const balance = await publicClient.readContract({
        address: FCDID_REGISTRY_ADDRESS,
        abi: FCDIDRegistryABI.abi,
        functionName: 'balanceOf',
        args: [ownerAddress]
      });

      const ownedNames: string[] = [];
      const numTokens = Number(balance);
      
      for (let i = 0; i < numTokens; i++) {
        const tokenId = await publicClient.readContract({
          address: FCDID_REGISTRY_ADDRESS,
          abi: FCDIDRegistryABI.abi,
          functionName: 'tokenOfOwnerByIndex',
          args: [ownerAddress, BigInt(i)]
        });

        const name = await publicClient.readContract({
          address: FCDID_REGISTRY_ADDRESS,
          abi: FCDIDRegistryABI.abi,
          functionName: 'tokenIdToName',
          args: [tokenId]
        });
        
        ownedNames.push(name as string);
      }
      return ownedNames;
    } catch (e) {
      console.error('getOwnedFCDIDs Error: ', e);
      return [];
    }
  },

  /**
   * Simulates sending a ZKP-signed transaction payload to the network.
   */
  async sendTransaction(toAddress: string, amount: string): Promise<string> {
    await simulateNetworkDelay(1000); // Simulate network overhead
    
    // As it's just a view-only wallet for now, we don't have a local private key loaded into App
    // We return a mock hash
    const mockTxHash = `0xfc${Math.random().toString(16).slice(2, 64).padEnd(62, '0')}`;
    return mockTxHash;
  }
};
