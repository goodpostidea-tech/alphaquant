"use client";

import TopNavBar from "@/components/TopNavBar";
import PriceTickerBar from "@/components/PriceTickerBar";
import AccountValueChart from "@/components/AccountValueChart";
import QuantLog from "@/components/QuantLog";
import CompactStrategyPanel from "@/components/CompactStrategyPanel";
import CompactRiskSidebar from "@/components/CompactRiskSidebar";
import { useI18n } from "@/i18n/I18nContext";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden text-foreground">
      {/* Top Navigation */}
      <TopNavBar />

      {/* Price Ticker */}
      <div className="bg-white/50 border-b border-border backdrop-blur-sm">
        <PriceTickerBar />
      </div>

      {/* Main Content: Enhanced Bloomberg Layout */}
      <div className="flex-1 min-h-0 flex flex-col p-6 gap-6 overflow-hidden">
        {/* Top Section: Large Chart (60% height) */}
        <div className="h-[60%] min-h-[400px] bg-white border border-border rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xs font-black uppercase tracking-wide text-slate-500">
              {t('dashboard.performanceBenchmark')}
            </h2>
            <div className="flex gap-4">
              <span className="text-[10px] text-slate-400 font-black uppercase hover:text-slate-600 cursor-pointer transition-colors">1D</span>
              <span className="text-[10px] text-emerald-600 font-black uppercase border-b-2 border-emerald-500 cursor-pointer pb-0.5">1W</span>
              <span className="text-[10px] text-slate-400 font-black uppercase hover:text-slate-600 cursor-pointer transition-colors">1M</span>
            </div>
          </div>
          <div className="flex-1 p-2">
            <AccountValueChart />
          </div>
        </div>

        {/* Bottom Section: Three Columns (40% height) */}
        <div className="flex-1 min-h-[300px] grid grid-cols-[22fr_48fr_30fr] gap-6 overflow-hidden">
          {/* Left: Compact Strategy Panel */}
          <div className="overflow-hidden rounded-xl shadow-xl shadow-slate-200/50 border border-border bg-white">
            <CompactStrategyPanel />
          </div>

          {/* Center: Live Activity Feed */}
          <div className="overflow-hidden rounded-xl shadow-xl shadow-slate-200/50 border border-border bg-white">
            <QuantLog />
          </div>

          {/* Right: Compact Risk Sidebar */}
          <div className="overflow-hidden rounded-xl shadow-xl shadow-slate-200/50 border border-border bg-white">
            <CompactRiskSidebar />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-3 text-[10px] text-slate-400 flex justify-between uppercase font-black border-t border-border bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span>AlphaQuant Terminal v1.1.0 © 2025</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-slate-300">A NOF1 PROJECT</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="opacity-60">SYSTEM STATUS:</span>
          <span className="text-emerald-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t('footer.marketStatus')}
          </span>
        </div>
      </footer>
    </div>
  );
}
