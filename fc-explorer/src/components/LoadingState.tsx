import React from 'react';

export default function LoadingState({ message = "LOADING..." }: { message?: string }) {
  return (
    <div className="bg-[#0A0E17] border border-white/5 rounded-xl shadow-lg p-16 flex flex-col items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#4A8FE7]/30 border-t-[#4A8FE7] animate-spin mb-4"></div>
      <div className="text-gray-400 font-mono text-xs tracking-widest uppercase">{message}</div>
    </div>
  );
}
