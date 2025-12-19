import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alpha Quant | Autonomous Trading",
  description: "AI-Driven Quantitative Trading Terminal",
};

import { I18nProvider } from "@/i18n/I18nContext";
import { StrategyProvider } from "@/lib/StrategyContext";
import { RiskProvider } from '@/lib/RiskContext';
import { ModelProvider } from '@/lib/ModelContext';
import { AuthProvider } from '@/lib/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexMono.variable} font-mono antialiased`}
      >
        <AuthProvider>
          <I18nProvider>
            <ModelProvider>
              <StrategyProvider>
                <RiskProvider>
                  {children}
                </RiskProvider>
              </StrategyProvider>
            </ModelProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
