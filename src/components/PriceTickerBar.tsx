"use client";

import { useEffect, useState } from "react";
import { Search, Activity, ChevronRight, Zap } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

const STOCKS = ["NVDA", "AAPL", "MSFT", "TSLA"];

export default function PriceTickerBar() {
    const { t } = useI18n();
    const [prices, setPrices] = useState<Record<string, number>>({
        NVDA: 132.45,
        AAPL: 224.12,
        MSFT: 415.89,
        TSLA: 258.33,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setPrices((prev) => {
                const next = { ...prev };
                STOCKS.forEach((coin) => {
                    const change = (Math.random() - 0.5) * (prev[coin] * 0.0005);
                    next[coin] = prev[coin] + change;
                });
                return next;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-white/80 backdrop-blur-md border-b border-border h-12 flex items-center px-4 justify-between gap-6 z-50">
            {/* Left: Breadcrumbs */}
            <div className="flex items-center gap-2 text-[11px] font-bold text-accent uppercase tracking-tighter shrink-0">
                <span>{t('topNav.home')}</span>
                <ChevronRight size={12} className="text-zinc-300" />
                <span className="text-slate-800">{t('topNav.terminal')}</span>
            </div>

            {/* Center: Search & Market Sentiment */}
            <div className="flex-1 max-w-2xl flex items-center gap-6">
                {/* Search Bar */}
                <div className="hidden md:flex flex-1 items-center gap-2 bg-zinc-100 rounded px-3 py-1.5 border border-transparent focus-within:border-zinc-300 transition-all">
                    <Search size={14} className="text-accent" />
                    <input
                        type="text"
                        placeholder={t('topNav.searchPlaceholder')}
                        className="bg-transparent border-none outline-none text-[11px] w-full text-slate-800 placeholder:text-zinc-400 font-bold"
                    />
                    <div className="text-[9px] bg-white border border-border px-1.5 py-0.5 rounded text-accent">TAB</div>
                </div>

                {/* Sentiment */}
                <div className="hidden lg:flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-black uppercase text-accent tracking-widest">{t('topNav.sentiment')}</span>
                    <div className="flex h-1.5 w-24 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                        <div className="h-full bg-profit" style={{ width: '74%' }} />
                    </div>
                    <span className="text-[10px] font-black text-profit uppercase">{t('topNav.bullish')}</span>
                </div>
            </div>

            {/* Right: Network & Prices */}
            <div className="flex items-center gap-6 shrink-0 font-bold text-[11px] uppercase tracking-tighter">
                {/* Ticker */}
                <div className="hidden xl:flex items-center gap-4">
                    {STOCKS.map(coin => (
                        <div key={coin} className="flex gap-1.5 tabular-nums">
                            <span className="text-zinc-400">{coin}</span>
                            <span className="text-slate-800">${prices[coin].toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                        </div>
                    ))}
                </div>

                <div className="w-px h-4 bg-border" />

                {/* Global Stats */}
                <div className="flex items-center gap-6">
                    <div className="flex gap-2">
                        <span className="text-zinc-400">{t('common.totalEquities')}</span>
                        <span className="text-slate-800 tabular-nums">$62,456.90</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-zinc-400">{t('common.sessionAlpha')}</span>
                        <span className="text-profit tabular-nums">+4.12%</span>
                    </div>
                </div>

                <div className="w-px h-4 bg-border" />

                {/* Network Status */}
                <div className="flex items-center gap-2 text-zinc-400">
                    <Zap size={12} className="text-profit fill-profit opacity-80" />
                    <span>14ms</span>
                </div>
            </div>
        </div>
    );
}
