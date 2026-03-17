"use client";

import { useEffect, useState } from 'react';
import { decodeEventLog, formatEther, formatGwei } from 'viem';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { publicClient } from '@/lib/client';
import { FCDID_ABI as ABI } from '@/lib/abi';
import { formatTimestamp } from '@/lib/utils';
import LoadingState from '@/components/LoadingState';
import NotFoundState from '@/components/NotFoundState';

export default function TxDetail() {
  const { hash } = useParams();
  const [tx, setTx] = useState<import('viem').Transaction | null>(null);
  const [receipt, setReceipt] = useState<import('viem').TransactionReceipt | null>(null);
  
  interface FcdidLogArgs {
    name?: string;
    tokenId?: bigint;
    owner?: string;
    expiry?: bigint;
  }
  const [fcdidLog, setFcdidLog] = useState<FcdidLogArgs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hash) return;
    const fetchTx = async () => {
      try {
        const txData = await publicClient.getTransaction({ hash: hash as `0x${string}` });
        const receiptData = await publicClient.getTransactionReceipt({ hash: hash as `0x${string}` });
        setTx(txData);
        setReceipt(receiptData);
        
        for (const log of receiptData.logs) {
           try {
             // Use type assertion manually below to ignore mismatch
             const decoded = decodeEventLog({
               abi: ABI,
               data: log.data,
               topics: log.topics,
             }) as unknown as { eventName: string; args: FcdidLogArgs };
             
             if (decoded.eventName === 'DomainRegistered') {
                setFcdidLog(decoded.args);
                break;
             }
           } catch { }
        }
      } catch (err) {
        console.error("Error fetching transaction:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, [hash]);

  const gasUsed = receipt?.gasUsed ? Number(receipt.gasUsed) : 0;
  const gasPrice = tx?.gasPrice ? Number(tx.gasPrice) : 0;
  const txFee = gasUsed * gasPrice;

  return (
    <div className="pb-12 text-white font-sans selection:bg-[#4A8FE7]/30 selection:text-white">

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
           <Link href="/" className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
           </Link>
           <div>
             <h1 className="text-2xl font-bold tracking-wide flex items-center gap-3">
               Transaction Details
             </h1>
             <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-mono">FC Chain Explorer</p>
           </div>
        </div>

        {loading ? (
          <LoadingState message="FETCHING TRANSACTION..." />
        ) : !tx || !receipt ? (
          <NotFoundState title="Transaction Not Found" message={<>We could not process the hash: <span className="text-[#4A8FE7]">{hash}</span></>} />
        ) : (
          <div className="bg-[#0F1116] border border-white/5 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] divide-y divide-white/5">
            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-start hover:bg-white/[0.02] transition-colors">
               <div className="text-sm text-gray-400 flex items-center gap-2 mb-2 md:mb-0 pt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                  Transaction Hash:
               </div>
               <div className="text-[13px] text-gray-300 font-mono break-all bg-white/5 p-3 rounded-lg border border-white/5">
                 {tx.hash}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-center hover:bg-white/[0.02] transition-colors">
               <div className="text-sm text-gray-400 flex items-center gap-2 mb-2 md:mb-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Status:
               </div>
               <div>
                  {receipt.status === 'success' ? (
                     <span className="bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 rounded text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 inline-flex">
                       <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                       Success
                     </span>
                  ) : (
                     <span className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 inline-flex">
                       <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                       Reverted
                     </span>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-center hover:bg-white/[0.02] transition-colors">
               <div className="text-sm text-gray-400 flex items-center gap-2 mb-2 md:mb-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  Block:
               </div>
               <div className="text-[13px] text-white flex items-center gap-2">
                 <Link href={`/block/${Number(tx.blockNumber)}`} className="text-[#4A8FE7] font-mono hover:underline cursor-pointer">
                    {Number(tx.blockNumber)}
                 </Link>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-center hover:bg-white/[0.02] transition-colors">
               <div className="text-sm text-gray-400 flex items-center gap-2 mb-2 md:mb-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  From:
               </div>
               <div className="text-[13px] text-[#4A8FE7] font-mono break-all">
                 <Link href={`/address/${tx.from}`} className="hover:underline">{tx.from}</Link>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-center hover:bg-white/[0.02] transition-colors">
               <div className="text-sm text-gray-400 flex items-center gap-2 mb-2 md:mb-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  To:
               </div>
               <div className="text-[13px] text-[#4A8FE7] font-mono break-all flex items-center gap-2">
                 {tx.to ? <Link href={`/address/${tx.to}`} className="hover:underline">{tx.to}</Link> : "Contract Base"}
                 {tx.to && <span className="bg-white/5 border border-white/10 text-gray-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-sans">Contract</span>}
               </div>
            </div>

            {fcdidLog && (
              <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-start hover:bg-white/[0.02] transition-colors bg-indigo-500/5">
                 <div className="text-sm text-indigo-400 flex items-center gap-2 mb-2 md:mb-0 pt-1 font-bold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    FCDID Registration:
                 </div>
                 <div className="bg-[#030712]/50 border border-indigo-500/20 rounded-xl p-6 shadow-inner">
                    <div className="flex items-center gap-3 mb-4 border-b border-indigo-500/10 pb-4">
                      <h4 className="text-xl font-mono text-white font-bold tracking-wider">{fcdidLog.name}.fc</h4>
                      <span className="bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-widest border border-green-500/20">Minted</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                      <div>
                        <p className="text-gray-500 mb-1 uppercase">Token ID</p>
                        <p className="text-white">{fcdidLog.tokenId ? fcdidLog.tokenId.toString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1 uppercase">Owner</p>
                        <p className="text-[#4A8FE7] truncate"><Link href={`/address/${fcdidLog.owner}`} className="hover:underline">{fcdidLog.owner}</Link></p>
                      </div>
                      <div className="sm:col-span-2">
                          {formatTimestamp(fcdidLog.expiry || '')}
                      </div>
                    </div>
                 </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-center hover:bg-white/[0.02] transition-colors border-t border-white/5">
               <div className="text-sm text-gray-400 flex items-center gap-2 mb-2 md:mb-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Value:
               </div>
               <div className="text-[13px] text-white flex items-center gap-2 font-mono">
                 <span className="bg-white/5 border border-white/5 px-2 py-1 rounded">
                   {formatEther(tx.value || BigInt(0))} FCC
                 </span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-center hover:bg-white/[0.02] transition-colors">
               <div className="text-sm text-gray-400 flex items-center gap-2 mb-2 md:mb-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Transaction Fee:
               </div>
               <div className="text-[13px] text-white flex items-center gap-2 font-mono">
                 {formatEther(BigInt(Math.floor(txFee)))} FCC
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] p-6 items-center hover:bg-white/[0.02] transition-colors border-b-0">
               <div className="text-sm text-gray-400 flex items-center gap-2 mb-2 md:mb-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                  Gas Price:
               </div>
               <div className="text-[13px] text-white flex items-center gap-2 font-mono">
                 {formatGwei(BigInt(gasPrice))} Gwei
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
