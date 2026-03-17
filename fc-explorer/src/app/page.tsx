"use client";

import React, { useEffect, useState } from 'react';
import { FCDID_REGISTRY } from '@/lib/config';
import { publicClient } from '@/lib/client';
import { truncateAddress } from '@/lib/utils';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

const FCDID_REGISTRY_ADDRESS = FCDID_REGISTRY;

function Explorer() {
  const [latestBlock, setLatestBlock] = useState<number | null>(null);
  const [recentBlocks, setRecentBlocks] = useState<import('viem').Block[]>([]);
  
  interface FCDIDLog {
    args: {
        name?: string;
        tokenId?: bigint;
        owner?: string;
        expiry?: bigint;
    };
    blockNumber?: bigint;
    transactionHash?: string;
  }
  const [logs, setLogs] = useState<FCDIDLog[]>([]);
  const [now, setNow] = useState<number>(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const blockNumber = await publicClient.getBlockNumber();
        if (latestBlock === Number(blockNumber)) return; // Skip if same
        
        setLatestBlock(Number(blockNumber));
        
        // Fetch up to 6 recent blocks
        const blocks = [];
        for(let i = 0; i < 6; i++) {
            if (Number(blockNumber) - i >= 0) {
                const b = await publicClient.getBlock({ blockNumber: blockNumber - BigInt(i) });
                blocks.push(b);
            }
        }
        setRecentBlocks(blocks);

        // Fetch recent FCDID registrations
        const eventLogs = await publicClient.getLogs({
          address: FCDID_REGISTRY_ADDRESS,
          events: [
            {
              type: 'event',
              name: 'DomainRegistered',
              inputs: [
                { type: 'string', name: 'name', indexed: false },
                { type: 'uint256', name: 'tokenId', indexed: true },
                { type: 'address', name: 'owner', indexed: true },
                { type: 'uint256', name: 'expiry', indexed: false },
              ]
            }
          ],
          fromBlock: BigInt(0),
          toBlock: blockNumber
        });
        
        setLogs(eventLogs.reverse());
      } catch (e) {
        console.error("RPC Error:", e);
      }
    };
    
    fetchLatest();
    const interval = setInterval(() => {
      fetchLatest();
      setNow(Math.floor(Date.now() / 1000));
    }, 3000);
    return () => clearInterval(interval);
  }, [latestBlock]);

  // Helper to format timestamps briefly
  const timeAgo = (timestampSeconds: bigint) => {
    const seconds = now - Number(timestampSeconds);
    if (seconds < 60) return `${Math.max(1, seconds)} secs ago`;
    const mins = Math.floor(seconds / 60);
    return `${mins} min${mins > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    // Hide global search header on Home page since Home has the big Hero Search
    const el = document.getElementById('global-search-header');
    if (el) el.style.display = 'none';
    return () => {
       if (el) el.style.display = 'block';
    }
  }, []);

  return (
    <div className="relative w-full">



      {/* Hero / Search Section */}
      <div className="border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Global Stats Grid (Etherscan Style) */}
          <div className="relative mb-10">
            <div className="absolute -top-3 right-0 bg-[#1E3A8A]/30 border border-[#4A8FE7]/30 text-[#4A8FE7] text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-widest z-10 flex items-center gap-1.5 shadow-[0_0_10px_rgba(74,143,231,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A8FE7] animate-pulse"></span>
              Simulated Data
            </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Latest Block & Network */}
            <div className="col-span-1 lg:col-span-2 bg-[#0F1116] border border-white/5 rounded-xl p-4 flex relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
               <div className="absolute -right-6 top-2 bg-[#1E3A8A]/40 border border-[#4A8FE7]/50 text-[#4A8FE7] text-[8px] font-mono px-6 py-0.5 rotate-45 tracking-widest uppercase shadow-[0_0_15px_rgba(74,143,231,0.4)] animate-pulse">LIVE</div>
               <div className="w-1/2 pr-4 border-r border-white/5 flex flex-col justify-center">
                 <p className="text-[10px] text-[#9CA3AF] font-mono uppercase tracking-[0.15em] mb-1">Latest Block</p>
                 <div className="flex items-end gap-2">
                   <span className="text-xl font-mono text-[#D4D8E0]">{latestBlock || '...'}</span>
                 </div>
               </div>
               <div className="w-1/2 pl-4 flex flex-col justify-center">
                 <p className="text-[10px] text-[#9CA3AF] font-mono uppercase tracking-[0.15em] mb-1">Network</p>
                 <div className="flex items-end gap-2">
                   <span className="text-xl font-mono text-[#D4D8E0]">FC Testnet</span>
                 </div>
               </div>
            </div>

             {/* Block Gas & Total FCDIDs */}
            <div className="col-span-1 lg:col-span-2 bg-[#0F1116] border border-white/5 rounded-xl p-4 flex relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
               <div className="absolute -right-6 top-2 bg-[#1E3A8A]/40 border border-[#4A8FE7]/50 text-[#4A8FE7] text-[8px] font-mono px-6 py-0.5 rotate-45 tracking-widest uppercase shadow-[0_0_15px_rgba(74,143,231,0.4)] animate-pulse">LIVE</div>
               <div className="w-1/2 pr-4 border-r border-white/5 flex flex-col justify-center">
                 <p className="text-[10px] text-[#9CA3AF] font-mono uppercase tracking-[0.15em] mb-1">Latest Block Gas</p>
                 <div className="flex items-end gap-2">
                   <span className="text-xl font-mono text-[#D4D8E0]">{recentBlocks[0]?.gasUsed?.toString() || '0'}</span>
                 </div>
               </div>
               <div className="w-1/2 pl-4 flex flex-col justify-center">
                 <p className="text-[10px] text-[#9CA3AF] font-mono uppercase tracking-[0.15em] mb-1">Total FCDIDs</p>
                 <div className="flex items-end gap-2">
                   <span className="text-xl font-mono text-[#6BA3ED]">{logs.length}</span>
                 </div>
               </div>
            </div>
          </div>
          </div>

          <h2 className="text-[26px] md:text-[32px] font-bold tracking-tight mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">The Sovereign FC Chain Explorer</span>
          </h2>
          
          {/* Main Search Bar */}
          <SearchBar isGlobal={false} />
        </div>
      </div>

      {/* Main Content: Split Columns */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-6">
          {/* Main User Requested Stats Bar */}
          <div className="w-16 h-[2px] bg-gradient-to-r from-[#4A8FE7] to-transparent mb-2"></div>
          <div className="bg-[#0F1116] border border-white/5 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] p-4 flex flex-col sm:flex-row items-center justify-between text-sm font-mono text-[#D4D8E0] gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[#9CA3AF] uppercase tracking-[0.15em] text-[11px]">最新区块号</span>
              <span className="text-[#6BA3ED] font-semibold">{latestBlock || '...'}</span>
            </div>
            
            <div className="h-4 w-[1px] bg-[#6B7280]/30 hidden sm:block"></div>
            
            <div className="flex items-center gap-3">
              <span className="text-[#9CA3AF] uppercase tracking-[0.15em] text-[11px]">网络状态</span>
              <span className="text-[#34D399] font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse"></span>
                FC Testnet
              </span>
            </div>
            
            <div className="h-4 w-[1px] bg-[#6B7280]/30 hidden sm:block"></div>
            
            <div className="flex items-center gap-3">
              <span className="text-[#9CA3AF] uppercase tracking-[0.15em] text-[11px]">FCDID生态数</span>
              <span className="text-[#6BA3ED] font-semibold">{logs.length}</span>
            </div>
          </div>  

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Latest Blocks Column */}
          <div className="bg-[#0F1116] border border-white/5 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col h-[520px]">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h2 className="text-sm font-semibold text-[#D4D8E0] tracking-[0.15em] uppercase flex items-center gap-2">
                <svg className="w-4 h-4 text-[#6BA3ED]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11v9h-5v-6h-4v6H5v-9m14 0L12 3 5 11" /></svg>
                Latest Blocks
              </h2>
              <button className="text-[#4A8FE7] hover:text-[#6BA3ED] text-[11px] font-mono tracking-widest uppercase transition-colors">View All &rarr;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="divide-y divide-white/5">
                {recentBlocks.map((block, idx) => (
                  <div key={idx} className="p-4 flex items-center hover:bg-[#14161D] border-l-2 border-transparent hover:border-[#4A8FE7] transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-lg bg-[#0A0C10] flex items-center justify-center mr-4 group-hover:bg-[#4A8FE7]/10 transition-colors border border-white/5">
                      <span className="text-[#D4D8E0] font-mono text-sm leading-none flex items-center justify-center pt-[2px]">Bk</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <Link href={`/block/${block.number}`} className="text-[#4A8FE7] hover:text-[#6BA3ED] font-mono text-[15px] font-medium transition-colors">
                          {block.number?.toString()}
                        </Link>
                        <span className="text-[#9CA3AF] text-xs font-mono">{timeAgo(block.timestamp)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#9CA3AF] text-[13px] font-mono">
                          Fee Recipient <Link href={`/address/${block.miner}`} className="text-[#4A8FE7] hover:text-[#6BA3ED] transition-colors">{truncateAddress(block.miner || '')}</Link>
                        </span>
                        <span className="text-[#D4D8E0] text-[13px] font-mono">{block.transactions.length} txns</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {recentBlocks.length === 0 && (
                  <div className="p-8 text-center text-gray-500 font-mono text-xs">
                    FETCHING BLOCKS...
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-3 border-t border-white/5 bg-[#0A0E17]/80 rounded-b-xl hidden">
              <button className="w-full py-2 bg-[#4A8FE7]/10 hover:bg-[#4A8FE7]/20 text-[#4A8FE7] text-xs font-semibold tracking-widest uppercase rounded transition-colors">
                View All Blocks →
              </button>
            </div>
          </div>

          {/* Latest Transactions Column */}
          <div className="bg-[#0F1116] border border-white/5 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col h-[520px]">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h2 className="text-sm font-semibold text-[#D4D8E0] tracking-[0.15em] uppercase flex items-center gap-2">
                <svg className="w-4 h-4 text-[#89B8F4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Latest Registrations
              </h2>
              <button className="text-[#4A8FE7] hover:text-[#6BA3ED] text-[11px] font-mono tracking-widest uppercase transition-colors">View All &rarr;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="divide-y divide-white/5">
                {logs.map((log, idx) => (
                  <div key={idx} className="p-4 flex items-center hover:bg-[#14161D] border-l-2 border-transparent hover:border-[#6BA3ED] transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1E3A8A]/40 to-[#4A8FE7]/20 flex items-center justify-center mr-4 border border-[#4A8FE7]/30 group-hover:border-[#4A8FE7]/60 transition-colors shadow-[0_0_10px_rgba(74,143,231,0.1)]">
                      <span className="text-[#F4F5F7] font-bold text-[13px] leading-none text-center">ID</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <Link href={`/fcdid/${log.args?.name}.fc`} className="text-[#D4D8E0] hover:text-[#F4F5F7] font-bold text-[15px] transition-colors">
                          {log.args?.name}.fc
                        </Link>
                        <span className="bg-[#1E3A8A]/30 text-[#6BA3ED] border border-[#4A8FE7]/20 text-[10px] font-mono px-2 py-0.5 rounded tracking-wider uppercase">Live</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#9CA3AF] text-[13px] font-mono">
                          Owner <Link href={`/address/${log.args?.owner}`} className="text-[#4A8FE7] hover:text-[#6BA3ED] transition-colors">{truncateAddress(log.args?.owner || '')}</Link>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {logs.length === 0 && (
                  <div className="p-8 text-center text-gray-500 font-mono text-xs">
                    WAITING FOR EVENTS...
                  </div>
                )}
              </div>
            </div>
            
            {/* View All Button Removed */}
          </div>
          
          </div>
        </div>
      </main>
    </div>
  );
}

export default Explorer;
