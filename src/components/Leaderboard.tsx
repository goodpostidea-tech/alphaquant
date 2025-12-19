"use client";

import { useI18n } from "@/i18n/I18nContext";
import { useStrategies } from "@/lib/StrategyContext";
import { Pause } from "lucide-react";

export default function Leaderboard() {
    const { t } = useI18n();
    const { strategies } = useStrategies();

    // In a real app, we would fetch leaderboard stats from an API that correlates with strategy IDs
    // Here we generate deterministic mock stats based on the strategy object
    const leaderboardData = strategies.filter(s => s.id !== 'system').map((s, index) => ({
        ...s,
        rank: index + 1,
        // Mock stats based on ID or index
        sharpe: s.id === 'deepseek' ? 2.15 : s.id === 'qwen' ? 1.84 : 1.5 - (index * 0.2),
        drawdown: s.id === 'deepseek' ? -4.2 : s.id === 'qwen' ? -6.1 : - (8 + index * 2),
        alpha: s.drift, // Use the real drift from context
        value: 10000 + (Math.random() * 5000) // Mock value
    }));

    return (
        <div className="w-full text-[11px]">
            <div className="grid grid-cols-5 bg-zinc-100 border-b border-border px-3 py-2 uppercase font-black text-accent tracking-tighter">
                <div className="col-span-2">{t('table.agent')}</div>
                <div className="text-right">{t('table.sharpe')}</div>
                <div className="text-right">{t('table.maxDD')}</div>
                <div className="text-right">{t('table.alpha')}</div>
            </div>
            <div className="divide-y divide-border">
                {leaderboardData.map((row) => (
                    <div key={row.id} className={`grid grid-cols-5 items-center px-3 py-3 hover:bg-zinc-50 transition-colors ${row.status === 'paused' ? 'opacity-40 grayscale' : ''}`}>
                        <div className="col-span-2 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: row.color }} />
                            <span className="font-bold truncate flex items-center gap-2">
                                {row.name}
                                {row.status === 'paused' && <Pause size={8} className="fill-current" />}
                            </span>
                        </div>
                        <div className="text-right font-mono font-bold">{row.sharpe.toFixed(2)}</div>
                        <div className="text-right font-mono text-loss">{row.drawdown}%</div>
                        <div className={`text-right font-mono ${row.alpha.startsWith('+') ? 'text-profit font-bold' : 'text-accent'}`}>
                            {row.alpha}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 mt-4 bg-zinc-50 border-t border-border">
                <h3 className="text-[10px] font-black uppercase mb-2">{t('exposure.liveRatio')}</h3>
                <div className="flex h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                    {/* Dynamic exposure bar based on active strategies */}
                    {strategies.filter(s => s.status === 'active').map(s => (
                        <div key={s.id} className="h-full" style={{ width: '15%', backgroundColor: s.color }} />
                    ))}
                    <div className="h-full bg-zinc-300 flex-1" />
                </div>
                <div className="flex justify-between text-[9px] mt-1 text-accent font-bold uppercase">
                    <span>{t('exposure.totalCapital')}: $100k</span>
                    <span>{t('exposure.cash')}: {Math.max(0, 100 - (strategies.filter(s => s.status === 'active').length * 15)).toFixed(1)}%</span>
                </div>
            </div>
        </div>
    );
}
