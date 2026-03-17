"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FCDID_REGISTRY } from '@/lib/config';
import { publicClient } from '@/lib/client';
import { FCDID_ABI as ABI } from '@/lib/abi';
import { formatTimestamp } from '@/lib/utils';
import LoadingState from '@/components/LoadingState';
import NotFoundState from '@/components/NotFoundState';

export default function FCDIDDetail() {
  const params = useParams();
  
  // Clean up domain name string
  const rawName = Array.isArray(params?.name) ? params.name[0] : (params?.name as string) || '';
  const decodedName = decodeURIComponent(rawName).toLowerCase();
  const nameWithoutFc = decodedName.replace(/\.fc$/, ''); // Ensure .fc is removed if present
  const displayDomain = nameWithoutFc ? `${nameWithoutFc}.fc` : '';

  const [loading, setLoading] = useState(true);
  const [domainInfo, setDomainInfo] = useState<{
    tokenId: bigint;
    owner: string;
    expiry: bigint;
    isActive: boolean;
  } | null>(null);

  useEffect(() => {
    if (!nameWithoutFc) {
      setLoading(false);
      setDomainInfo(null);
      return;
    }

    const fetchDomain = async () => {
      try {
        setLoading(true);
        setDomainInfo(null); // Reset domain info

        // Step 1: Get Token ID
        const tokenId = await publicClient.readContract({
          address: FCDID_REGISTRY,
          abi: ABI,
          functionName: 'nameToTokenId',
          args: [nameWithoutFc]
        }) as bigint;

        if (tokenId === BigInt(0)) {
          setDomainInfo(null); // Domain not found/available
          return;
        }

        // Step 2: Get Owner and Expiry
        const [owner, expiry] = await Promise.all([
          publicClient.readContract({
            address: FCDID_REGISTRY,
            abi: ABI,
            functionName: 'ownerOf',
            args: [tokenId]
          }).catch(() => null) as Promise<string | null>,
          publicClient.readContract({
            address: FCDID_REGISTRY,
            abi: ABI,
            functionName: 'tokenExpiry',
            args: [tokenId]
          }).catch(() => BigInt(0)) as Promise<bigint>
        ]);

        if (!owner) {
           setDomainInfo(null); // Owner not found, implies not registered or error
           return;
        }

        const now = BigInt(Math.floor(Date.now() / 1000));
        const isActive = expiry > now;

        setDomainInfo({
          tokenId,
          owner,
          expiry,
          isActive
        });
      } catch (err) {
        setDomainInfo(null);
        console.error("Error fetching domain:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDomain();
  }, [nameWithoutFc]);

  return (
    <div className="pb-12 text-white font-sans selection:bg-[#4A8FE7]/30 selection:text-white">

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
           <Link href="/" className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-colors shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
           </Link>
           <div className="flex-1 min-w-0">
             <div className="flex items-center gap-3">
               <h1 className="text-2xl font-bold tracking-wide break-all">
                 {displayDomain}
               </h1>
             </div>
             <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-mono">FCDID Digital Identity</p>
           </div>
        </div>

        {loading ? (
          <LoadingState message="FETCHING DOMAIN..." />
        ) : !domainInfo ? (
          <NotFoundState title="Domain Not Found" message={<>The FCDID <span className="text-indigo-400">{nameWithoutFc}.fc</span> is currently unregistered.</>} />
        ) : (
          <div className="bg-[#0F1116] border border-white/5 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
              <div>
                <h3 className="text-3xl font-mono text-white font-bold tracking-wider flex items-center gap-3">
                  {displayDomain}
                  {domainInfo.isActive ? (
                    <span className="bg-green-500/10 border border-green-500/30 text-green-400 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest uppercase self-center translate-y-[-2px]">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="bg-red-500/10 border border-red-500/30 text-red-400 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest uppercase self-center translate-y-[-2px]">
                      EXPIRED
                    </span>
                  )}
                </h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 font-mono text-sm">
                <div className="bg-[#030712]/50 p-4 rounded-lg border border-white/5">
                <p className="text-gray-500 text-[11px] mb-1.5 uppercase tracking-widest">Owner Address</p>
                <Link href={`/address/${domainInfo.owner}`} className="text-[#4A8FE7] break-all hover:underline cursor-pointer block">
                    {domainInfo.owner}
                </Link>
                </div>
                <div className="bg-[#030712]/50 p-4 rounded-lg border border-white/5">
                <p className="text-gray-500 text-[11px] mb-1.5 uppercase tracking-widest">Token ID</p>
                <p className="text-white">{domainInfo.tokenId.toString()}</p>
                </div>
                <div className="bg-[#030712]/50 p-4 rounded-lg border border-white/5 md:col-span-2">
                <p className="text-gray-500 text-[11px] mb-1.5 uppercase tracking-widest">Expiry Timestamp</p>
                <p className="text-white">
                    {formatTimestamp(domainInfo.expiry)}
                    <span className="text-gray-500 ml-2">({domainInfo.expiry.toString()})</span>
                </p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
