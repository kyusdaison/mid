import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050507]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-[#0F1116] border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(74,143,231,0.2)] group-hover:shadow-[0_0_25px_rgba(74,143,231,0.4)] transition-all duration-300">
            <svg className="w-5 h-5 text-[#D4D8E0] transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-[17px] font-bold tracking-[0.1em] bg-clip-text text-transparent bg-gradient-to-r from-[#F4F5F7] to-[#9CA3AF] group-hover:to-white transition-colors duration-300">FCScan</h1>
            <span className="text-[9px] font-mono tracking-[0.15em] text-[#6BA3ED] border border-[#4A8FE7]/30 bg-[#4A8FE7]/10 px-1.5 py-0.5 rounded-sm uppercase">Official</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-[#9CA3AF] hover:text-[#F4F5F7] transition-colors">Home</Link>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <a href="#" className="text-sm font-medium text-[#9CA3AF] hover:text-[#F4F5F7] transition-colors">Tokens</a>
          <a href="#" className="text-sm font-medium text-[#9CA3AF] hover:text-[#F4F5F7] transition-colors">FCDIDs</a>
          <a href="#" className="text-sm font-medium text-[#9CA3AF] hover:text-[#F4F5F7] transition-colors">APIs</a>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2 text-sm font-medium px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-[#D4D8E0] border border-white/5">
            <div className="w-2 h-2 rounded-full bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse"></div>
            Testnet
          </button>
          
          <button aria-label="Toggle Navigation Menu" className="md:hidden text-[#9CA3AF] hover:text-[#F4F5F7]">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
