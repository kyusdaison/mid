import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Montserrat Digital Residency Programme — Government of Montserrat",
  description: "Official portal for the Montserrat Digital Residency Programme. A sovereign digital identity backed by British Overseas Territory legal standards.",
};

import { Providers } from "@/components/providers/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexMono.variable} ${dmSans.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
