'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ethers, Signer } from 'ethers';

// Define the shape of our Web3 context
interface Web3ContextType {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  registeredFCDID: string | null;
  signer: Signer | null;
  setRegisteredFCDID: (fcdid: string | null) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

// Create the context with a default undefined value
const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Provider props
interface Web3ProviderProps {
  children: ReactNode;
}

// The Provider component
export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [registeredFCDID, setRegisteredFCDID] = useState<string | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);

  // function to simulate connecting a wallet using local hardhat node ethers provider
  const connectWallet = async () => {
    try {
      console.log('Connecting to Local Hardhat Node via ethers...');
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      // Use Hardhat Account #0
      const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
      
      setIsConnected(true);
      setAddress(wallet.address);
      setChainId(1337);
      setSigner(wallet);
      
      console.log('Wallet Connected: ', wallet.address);
    } catch (error) {
      console.error('Failed to connect wallet', error);
    }
  };

  // Stub function to disconnect
  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setChainId(null);
    setSigner(null);
    console.log('Wallet Disconnected');
  };

  const value = {
    isConnected,
    address,
    chainId,
    registeredFCDID,
    signer,
    setRegisteredFCDID,
    connectWallet,
    disconnectWallet,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

// Custom hook for easier consumption of the context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
