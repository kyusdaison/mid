"use client";

import { useEffect, useState } from 'react';
import { formatEther } from 'viem';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { publicClient } from '@/lib/client';
import { formatTimestamp, truncateAddress } from '@/lib/utils';
import LoadingState from '@/components/LoadingState';
import NotFoundState from '@/components/NotFoundState';

export default function BlockDetail() {
  const { number } = useParams();
  const [block, setBlock] = useState<import('viem').Block & { transactions: import('viem').Transaction[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!number) return;
    const fetchBlock = async () => {
      try {
        const blockData = await publicClient.getBlock({
          blockNumber: BigInt(number as string),
          includeTransactions: true,
        });
        setBlock(blockData);
      } catch (err) {
        console.error("Error fetching block:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlock();
  }, [number]);

  return (
    <div className="pb-12 text-white font-sans selection:bg-[#4A8FE7]/30 selection:text-white">

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
           <Link href="/" className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
           </Link>
           <div>
             <h1 className="text-2xl font-bold tracking-wide flex items-center gap-3">
               Block <span className="text-[#4A8FE7] font-mono">#{number}</span>
             </h1>
             <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-mono">FC Chain Explorer</p>
           </div>
        </div>

        {loading ? (
          <LoadingState message="FETCHING BLOCK DATA..." />
        ) : !block ? (
          <NotFoundState title="Block Not Found" message={<>We could not find block <span className="text-[#4A8FE7]">{number}</span> in the current network.</>} />
        ) : (
          <div className="bg-[#0F1116] border border-white/5 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] divide-y divide-white/5">
            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-center hover:bg-white/[0.02] transition-colors">
               <div className="text-sm text-gray-400 flex items-center gap-2 mb-2 md:mb-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Timestamp:
               </div>
               <div className="text-sm text-white flex items-center gap-2">
                 <span className="font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">
                   {Number(block.timestamp)}
                 </span>
                 <span className="text-gray-400">
                    ({formatTimestamp(block.timestamp)})
                 </span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-center hover:bg-white/[0.02] transition-colors">
               <div className="text-sm text-gray-400 flex items-center gap-2 mb-2 md:mb-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  Transactions:
               </div>
               <div className="text-sm text-white">
                 <span className="bg-[#4A8FE7]/10 text-[#4A8FE7] border border-[#4A8FE7]/20 px-2.5 py-1 rounded font-mono font-bold">
                   {block?.transactions?.length || 0} transactions
                 </span>
                 <span className="text-gray-500 ml-3">in this block</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-center hover:bg-white/[0.02] transition-colors">
               <div className="text-sm text-gray-400 flex items-center gap-2 mb-2 md:mb-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                  Miner:
               </div>
               <div className="text-sm text-[#4A8FE7] font-mono break-all">
                 {block.miner}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-center hover:bg-white/[0.02] transition-colors">
               <div className="text-sm text-gray-400 flex items-center gap-2 mb-2 md:mb-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Gas Used:
               </div>
               <div className="text-sm text-white flex items-center gap-2">
                 {Number(block.gasUsed).toLocaleString()}
                  <div className="text-sm text-gray-500">
                    {((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(2)}%
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-center hover:bg-white/[0.02] transition-colors">
               <div className="text-sm text-gray-400 flex items-center gap-2 mb-2 md:mb-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  Gas Limit:
               </div>
               <div className="text-sm text-white">
                 {Number(block.gasLimit).toLocaleString()}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-start hover:bg-white/[0.02] transition-colors">
               <div className="text-sm text-gray-400 flex items-center gap-2 mb-2 md:mb-0 pt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                  Hash:
               </div>
               <div className="text-sm text-gray-300 font-mono break-all bg-white/5 p-3 rounded-lg border border-white/5">
                 {block.hash}
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-start hover:bg-white/[0.02] transition-colors">
               <div className="text-sm text-gray-400 flex items-center gap-2 mb-2 md:mb-0 pt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  Parent Hash:
               </div>
               <div className="text-[13px] text-[#4A8FE7] font-mono break-all hover:underline cursor-pointer">
                 <Link href={`/block/${Number(block.number) - 1}`}>{block.parentHash}</Link>
               </div>
            </div>
          </div>
        )}
        
        {/* Block Transactions List Placeholder */}
        {(block?.transactions?.length ?? 0) > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold tracking-wide mb-4">Transactions</h2>
            <div className="bg-[#0F1116] border border-white/5 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] divide-y divide-white/5">
               {block?.transactions?.map((tx: import('viem').Transaction | string, idx: number) => (
                 <div key={idx} className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center hover:bg-white/[0.02] transition-colors">
                    <div className="col-span-1 md:col-span-2 flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/10">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                       </div>
                       <div className="truncate">
                         <Link href={`/tx/${typeof tx === 'string' ? tx : tx.hash}`} className="text-[#4A8FE7] font-mono text-sm hover:underline cursor-pointer block truncate">
                           {typeof tx === 'string' ? tx : tx.hash}
                         </Link>
                         <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                           Type: {typeof tx === 'string' ? 'Unknown' : tx.type}
                         </div>
                       </div>
                    </div>
                    
                    <div className="truncate text-[12px] font-mono text-gray-400">
                      From: <span className="text-[#4A8FE7]">{typeof tx === 'string' ? '...' : truncateAddress(tx.from || '')}</span><br/>
                      To: <span className="text-[#4A8FE7]">{typeof tx === 'string' ? '...' : tx.to ? truncateAddress(tx.to) : 'Contract Creation'}</span>
                    </div>
                    
                    <div className="text-right">
                       <span className="bg-white/5 text-gray-300 px-2 py-1 rounded text-xs font-mono border border-white/10">
                         {typeof tx === 'string' ? '0' : formatEther(tx.value || BigInt(0))} FCC
                       </span>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
