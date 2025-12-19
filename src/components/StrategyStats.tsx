"use client";

import { useI18n } from "@/i18n/I18nContext";
import { useStrategies, AgentStrategy } from "@/lib/StrategyContext";
import { Pause } from "lucide-react";

export default function StrategyStats() {
    const { t } = useI18n();
    const { strategies } = useStrategies();

    // Map context strategies to stats. In a real app these stats might come from context or separate API.
    // Here we merge the context status with our mock stat data.
    const agentsWithStats = strategies.filter(s => s.id !== 'system').map(strategy => {
        // Mock dynamic stats based on strategy ID
        return {
            ...strategy,
            confidence: strategy.id === 'deepseek' ? 92 : strategy.id === 'gpt5' ? 85 : strategy.id === 'claude' ? 88 : 76,
            consistency: strategy.id === 'deepseek' ? 98 : strategy.id === 'gpt5' ? 72 : strategy.id === 'claude' ? 94 : 65,
            latency: strategy.id === 'deepseek' ? 450 : strategy.id === 'gpt5' ? 1100 : strategy.id === 'claude' ? 1400 : 900,
        };
    });

    return (
        <div className="bg-white border border-border rounded-sm p-4 h-full">
            <h3 className="text-[10px] font-black uppercase mb-4 tracking-widest text-accent">{t('dashboard.benchmarkTitle')}</h3>

            <div className="space-y-6">
                {agentsWithStats.map(agent => (
                    <div key={agent.id} className={`transition-opacity duration-300 ${agent.status === 'paused' ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-bold uppercase flex items-center gap-2" style={{ color: agent.color }}>
                                {agent.name}
                                {agent.status === 'paused' && <Pause size={10} className="fill-current" />}
                            </span>
                            <span className="text-[10px] text-accent font-mono">{agent.latency}ms / {agent.confidence}% {t('agentStats.conf')}</span>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] uppercase font-bold text-accent shrink-0 w-12">{t('agentStats.confidence')}</span>
                                <div className="flex-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                                    <div className="h-full transition-all duration-1000" style={{ width: `${agent.confidence}%`, backgroundColor: agent.color }} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] uppercase font-bold text-accent shrink-0 w-12">{t('agentStats.stability')}</span>
                                <div className="flex-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                                    <div className="h-full transition-all duration-1000 opacity-50" style={{ width: `${agent.consistency}%`, backgroundColor: agent.color }} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-4 border-t border-border">
                <div className="text-[10px] font-black uppercase mb-2">{t('common.councilConsensus')}</div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-profit flex items-center justify-center text-profit font-black text-xs">
                        74%
                    </div>
                    <div className="text-[10px] leading-tight text-accent">
                        {t('dashboard.consensusNote', { value: t('common.highConjunction') })}
                    </div>
                </div>
            </div>
        </div>
    );
}
