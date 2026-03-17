"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ isGlobal = false }: { isGlobal?: boolean }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const trimmed = searchQuery.trim();

    if (trimmed.startsWith('0x') && trimmed.length === 42) {
      router.push(`/address/${trimmed}`);
      return;
    }
    if (trimmed.startsWith('0x') && trimmed.length === 66) {
      router.push(`/tx/${trimmed}`);
      return;
    }
    if (/^\d+$/.test(trimmed)) {
      router.push(`/block/${trimmed}`);
      return;
    }

    if (!trimmed.startsWith('0x') && trimmed.includes('.')) {
      router.push(`/fcdid/${trimmed.toLowerCase()}`);
      return;
    }
    
    if (!trimmed.startsWith('0x') && !/^\d+$/.test(trimmed)) {
      router.push(`/fcdid/${trimmed.toLowerCase()}.fc`);
      return;
    }
  };

  return (
    <div className={`relative w-full ${isGlobal ? 'max-w-2xl' : 'max-w-4xl'} flex items-center group`}>
      <select aria-label="Search Filter" className="absolute left-1 top-1 bottom-1 bg-[#0A0C10]/90 backdrop-blur-md border border-white/5 text-[#D4D8E0] text-[12px] font-mono tracking-widest uppercase px-3 rounded-l-[10px] appearance-none cursor-pointer outline-none focus:ring-1 focus:ring-[#4A8FE7] transition-all hover:bg-[#0F1116]">
        <option>All</option>
        <option>Address</option>
        <option>Tokens</option>
        <option>FCDIDs</option>
      </select>
      <div className={`pointer-events-none absolute inset-y-0 ${isGlobal ? 'left-[70px]' : 'left-[70px]'} flex items-center px-2 text-[#6B7280]`}>
         <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
      </div>
      
      <input 
        aria-label="Search Query"
        type="text" 
        placeholder="Search by Address / Txn Hash / Block / FCDID (e.g. alice.fc)" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className={`w-full bg-[#0A0C10]/60 backdrop-blur-xl border border-white/10 text-[#F4F5F7] text-[15px] pl-[106px] pr-16 ${isGlobal ? 'py-2.5 rounded-xl' : 'py-4 rounded-2xl'} shadow-[0_4px_30px_rgba(0,0,0,0.5)] focus:outline-none focus:border-[#4A8FE7] focus:ring-1 focus:ring-[#4A8FE7] focus:shadow-[0_0_20px_rgba(74,143,231,0.2)] transition-all duration-300 font-mono placeholder:font-sans placeholder:text-[#6B7280] group-hover:border-white/20`}
      />
      <button aria-label="Submit Search" onClick={handleSearch} className={`absolute right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-[#1E3A8A] to-[#4A8FE7] hover:opacity-90 shadow-[0_0_10px_rgba(74,143,231,0.3)] hover:shadow-[0_0_20px_rgba(74,143,231,0.6)] text-white px-5 ${isGlobal ? 'rounded-lg' : 'rounded-xl'} flex items-center justify-center transition-all duration-300`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </button>
    </div>
  );
}
