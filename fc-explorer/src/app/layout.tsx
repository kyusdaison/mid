import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FC Chain Block Explorer",
  description: "Real-time block indexing and FCDID registration ledger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${ibmPlexMono.variable} antialiased bg-[#050507] text-[#D4D8E0] min-h-screen selection:bg-[#4A8FE7]/30 selection:text-white flex flex-col`}
      >
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#4A8FE7]/10 rounded-full blur-[150px] mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1E3A8A]/20 rounded-full blur-[150px] mix-blend-screen"></div>
        </div>
        
        <Navbar />
        
        {/* Global Search Header for subpages (hidden on exactly '/' since it has a giant hero search) */}
        <div id="global-search-header" className="hidden w-full border-b border-white/5 bg-gradient-to-b from-[#0F1116]/80 to-[#050507]/50 py-4 px-6 relative z-10 backdrop-blur-md">
           <div className="max-w-7xl mx-auto flex justify-center">
             <SearchBar isGlobal={true} />
           </div>
        </div>

        <div className="flex-1 w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
