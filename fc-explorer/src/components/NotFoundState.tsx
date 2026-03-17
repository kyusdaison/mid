import React from 'react';

export default function NotFoundState({ title = "Not Found", message }: { title?: string, message?: React.ReactNode }) {
  return (
    <div className="bg-[#0A0E17] border border-white/5 rounded-xl shadow-lg p-16 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>
      <h3 className="text-lg font-mono text-white mb-2">{title}</h3>
      {message && <p className="text-sm text-gray-400">{message}</p>}
    </div>
  );
}
