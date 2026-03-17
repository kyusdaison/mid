"use client";

import { useEffect, useState } from 'react';
import { formatEther } from 'viem';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { publicClient } from '@/lib/client';
import LoadingState from '@/components/LoadingState';

export default function AddressDetail() {
  const { addr } = useParams();
  const address = addr as `0x${string}`;
  
  const [balance, setBalance] = useState<string>('0');
  const [txCount, setTxCount] = useState<number>(0);
  const [isContract, setIsContract] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    const fetchAddressInfo = async () => {
      try {
        const bal = await publicClient.getBalance({ address });
        setBalance(formatEther(bal));
        
        const count = await publicClient.getTransactionCount({ address });
        setTxCount(count);
        
        const bytecode = await publicClient.getBytecode({ address });
        setIsContract(bytecode !== undefined && bytecode !== '0x');
      } catch (err) {
        console.error("Error fetching address info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddressInfo();
  }, [address]);

  return (
    <div className="pb-12 text-white font-sans selection:bg-[#4A8FE7]/30 selection:text-white">

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
           <Link href="/" className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-colors shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
           </Link>
           <div className="flex-1 min-w-0">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A8FE7] to-indigo-600 flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
               </div>
               <h1 className="text-2xl font-bold tracking-wide truncate">
                 Address
               </h1>
               {isContract && (
                  <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded text-xs font-mono uppercase tracking-widest">
                    Contract
                  </span>
               )}
             </div>
             <p className="text-sm font-mono text-[#4A8FE7] mt-2 block truncate bg-[#4A8FE7]/10 px-3 py-1.5 rounded-lg border border-[#4A8FE7]/20">
               {address}
             </p>
           </div>
        </div>

        {loading ? (
          <LoadingState message="FETCHING ADDRESS..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Overview Card */}
             <div className="bg-[#0F1116] border border-white/5 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] p-6">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                   Overview
                </h2>
                <div className="space-y-6">
                   <div>
                      <div className="text-sm text-gray-500 mb-1">FCC Balance</div>
                      <div className="text-2xl font-mono">{Number(balance).toLocaleString(undefined, { maximumFractionDigits: 4 })} <span className="text-base text-gray-400">FCC</span></div>
                   </div>
                   <div>
                      <div className="text-sm text-gray-500 mb-1">Total Transactions Sent</div>
                      <div className="text-lg font-mono">{txCount}</div>
                   </div>
                </div>
             </div>
             
             {/* Info Card */}
             <div className="bg-[#0F1116] border border-white/5 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] p-6">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                   More Info
                </h2>
                <div className="space-y-6">
                   <div>
                      <div className="text-sm text-gray-500 mb-1">Type</div>
                      <div className="text-md font-mono">{isContract ? 'Smart Contract' : 'Externally Owned Account (EOA)'}</div>
                   </div>
                   <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-gray-400">
                      On a local testnet, limited historical transaction data is indexed by address. 
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
