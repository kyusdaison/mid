import { create } from 'zustand';
import { FCChainService } from '../services/fcChainService';

// Define the shape of a Digital Asset
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  balanceUsd: number;
  change24h: number;
  iconColor: string;
}

// Define the shape of a Transaction
export interface Transaction {
  id: string;
  type: 'RECEIVED' | 'SENT' | 'STAKED';
  amount: string;
  date: string;
  status: 'CONFIRMED' | 'LOCKED' | 'PENDING';
  from?: string;
  to?: string;
  contract?: string;
}

// Define the shape of the global Wallet State
interface WalletState {
  isZkpVerified: boolean;
  walletAddress: string;
  fcdid: string;
  totalBalanceUsd: number;
  assets: Asset[];
  transactions: Transaction[];
  
  // Actions
  setZkpVerified: (status: boolean) => void;
  setFcdid: (id: string) => void;
  setAssets: (assets: Asset[]) => void;
  updateTotalBalance: (balance: number) => void;
  addTransaction: (tx: Transaction) => void;
  fetchOnChainData: () => Promise<void>;
  resetWallet: () => void;
}

// The Zustand Store
export const useWalletStore = create<WalletState>((set, get) => ({
  // Initial State
  isZkpVerified: false,
  walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Default hardhat account
  fcdid: 'Unregistered.fc',
  totalBalanceUsd: 0.00,
  
  // Mock Initial Transactions
  transactions: [
    { id: '1', type: 'RECEIVED', amount: '+ 1,500.00 FCC', date: '2026-03-15 · 14:32', status: 'CONFIRMED', from: '@fcb_treasury' },
    { id: '2', type: 'SENT', amount: '- 50.00 FCC', date: '2026-03-14 · 09:12', status: 'CONFIRMED', to: '@alice_fcdid' },
    { id: '3', type: 'STAKED', amount: '- 500.00 FCC', date: '2026-03-10 · 18:45', status: 'LOCKED', contract: 'Gov Bond v2' },
  ],

  // Mock Initial Assets (These will be fetched via Web3 later)
  assets: [
    {
      id: '1',
      name: 'Future Citizen Coin',
      symbol: 'FCC',
      balance: 0.00,
      balanceUsd: 0.00,
      change24h: 0.00,
      iconColor: '#4A8FE7',
    },
    {
      id: '2',
      name: 'Ethereum',
      symbol: 'ETH',
      balance: 12.45,
      balanceUsd: 45201.20,
      change24h: 2.4,
      iconColor: '#627EEA',
    },
    {
      id: '3',
      name: 'Bitcoin',
      symbol: 'BTC',
      balance: 2.1,
      balanceUsd: 142800.00,
      change24h: -1.2,
      iconColor: '#F7931A',
    },
  ],

  // Actions Mutators
  setZkpVerified: (status) => set({ isZkpVerified: status }),
  setFcdid: (id) => set({ fcdid: id }),
  setAssets: (newAssets) => set({ assets: newAssets }),
  updateTotalBalance: (balance) => set({ totalBalanceUsd: balance }),
  addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
  resetWallet: () => set({ 
    isZkpVerified: false, 
    fcdid: 'Unregistered.fc', 
    totalBalanceUsd: 0.00,
    assets: [],
    transactions: [] 
  }),

  // Web3 Binding
  fetchOnChainData: async () => {
    // For local dev, we simulate the first Hardhat account which has FCDIDs minted to it
    const hardhatAccount = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    
    try {
      const balanceEther = await FCChainService.getBalance(hardhatAccount);
      const balanceNumber = parseFloat(balanceEther) || 0;
      
      const ownedDomains = await FCChainService.getOwnedFCDIDs(hardhatAccount);
      const primaryDomain = ownedDomains.length > 0 ? `${ownedDomains[0]}.fc` : 'Unregistered.fc';

      set((state) => {
        const updatedAssets = state.assets.map(a => {
          if (a.symbol === 'FCC') {
            return { ...a, balance: balanceNumber, balanceUsd: balanceNumber * 1.0 }; // Mock 1:1 USD
          }
          return a;
        });

        // Recalculate total
        const total = updatedAssets.reduce((sum, asset) => sum + asset.balanceUsd, 0);

        return {
          fcdid: primaryDomain,
          assets: updatedAssets,
          totalBalanceUsd: total,
        };
      });
    } catch (e) {
      console.error("fetchOnChainData Error: ", e);
    }
  }
}));
