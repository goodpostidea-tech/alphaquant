"use client";

import { useI18n } from "@/i18n/I18nContext";
import { useStrategies, AgentStrategy } from "@/lib/StrategyContext";
import { Play, Pause, AlertTriangle, ShieldCheck, TrendingUp, Settings } from "lucide-react";
import { useState } from "react";
import ConfigModal from "./ConfigModal";
import DeployAgentModal from "./DeployAgentModal";

export default function StrategyManagement() {
    const { t } = useI18n();
    const { strategies, marketStatus, toggleStrategyStatus, updateStrategyConfig, addStrategy, pauseAll, resumeAll } = useStrategies();

    const [modalOpen, setModalOpen] = useState(false);
    const [deployModalOpen, setDeployModalOpen] = useState(false);
    const [selectedStrategy, setSelectedStrategy] = useState<AgentStrategy | null>(null);

    const openConfig = (strategy: AgentStrategy) => {
        setSelectedStrategy(strategy);
        setModalOpen(true);
    };

    const handleSaveConfig = (maxPos: number, stopLoss: number) => {
        if (selectedStrategy) {
            updateStrategyConfig(selectedStrategy.id, { maxPos, stopLoss });
            setModalOpen(false);
            setSelectedStrategy(null);
        }
    };

    const handleDeployAgent = (name: string, provider: string, symbol: string, maxPos: number, stopLoss: number) => {
        addStrategy({
            name,
            provider,
            symbol,
            maxPos,
            stopLoss
        });
        setDeployModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* 顶部标题与全局控制 */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">{t('strategies.title')}</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-accent border border-border px-2 py-1 rounded bg-white">
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${marketStatus === 'regular' ? 'bg-profit' : marketStatus === 'closed' ? 'bg-zinc-400' : 'bg-warning'}`} />
                            {t('strategies.marketStatus')}: <span className="text-black">{t(`strategies.session.${marketStatus}`)}</span>
                        </div>
                        <div className="text-[10px] font-bold uppercase text-accent">
                            VIX Index: <span className="text-black">14.25</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={pauseAll}
                        className="flex items-center gap-2 bg-white border border-border px-4 py-2 rounded text-[10px] font-black uppercase text-loss hover:bg-loss/5 transition-colors"
                    >
                        <AlertTriangle size={14} />
                        {t('strategies.pauseAll')}
                    </button>
                    <button
                        onClick={resumeAll}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded text-[10px] font-black uppercase hover:bg-zinc-800 transition-colors"
                    >
                        <Play size={14} className="fill-current" />
                        {t('strategies.resumeAll')}
                    </button>
                </div>
            </div>

            {/* 策略网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {strategies.map((strategy) => (
                    <div key={strategy.id} className="bg-white border border-border rounded-sm shadow-sm overflow-hidden flex flex-col">
                        {/* 卡片头部 */}
                        <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-zinc-50/50">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: strategy.color }} />
                                <span className="text-[11px] font-black uppercase tracking-tight">{strategy.name}</span>
                            </div>
                            <div className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${strategy.status === 'active' ? 'bg-profit/10 border-profit text-profit' :
                                strategy.status === 'paused' ? 'bg-zinc-100 border-zinc-300 text-accent' :
                                    'bg-blue-50 border-blue-200 text-blue-500'
                                } `}>
                                {t(`strategies.${strategy.status}`)}
                            </div>
                        </div>

                        {/* 卡片内容 */}
                        <div className="p-4 space-y-4 flex-1">
                            {/* 核心指标 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[9px] text-accent uppercase font-bold mb-1">Target Symbol</div>
                                    <div className="text-lg font-black">{strategy.symbol}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[9px] text-accent uppercase font-bold mb-1">{t('strategies.perfDrift')}</div>
                                    <div className={`text-lg font-black tabular-nums ${strategy.drift.startsWith('+') ? 'text-profit' : 'text-loss'}`}>
                                        {strategy.drift}
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-zinc-100" />

                            {/* 风险风控参数 */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1.5">
                                        <ShieldCheck size={12} className="text-accent" />
                                        <span className="text-[10px] text-accent font-bold uppercase">{t('strategies.maxPosition')}</span>
                                    </div>
                                    <span className="text-[10px] font-black tabular-nums">{strategy.maxPos}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1.5">
                                        <AlertTriangle size={12} className="text-accent" />
                                        <span className="text-[10px] text-accent font-bold uppercase">{t('strategies.stopLoss')}</span>
                                    </div>
                                    <span className="text-[10px] font-black tabular-nums">{strategy.stopLoss}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1.5">
                                        <TrendingUp size={12} className="text-accent" />
                                        <span className="text-[10px] text-accent font-bold uppercase">{t('strategies.volGate')}</span>
                                    </div>
                                    <span className="text-[10px] font-black tabular-nums">25.0</span>
                                </div>
                            </div>
                        </div>

                        {/* 卡片动作 */}
                        <div className="p-2 border-t border-border bg-zinc-50/30 flex gap-2">
                            <button
                                onClick={() => openConfig(strategy)}
                                className="flex-1 flex justify-center items-center gap-2 p-2 rounded border border-border bg-white text-[10px] font-black uppercase hover:bg-zinc-50 transition-colors"
                            >
                                <Settings size={12} />
                                {t('strategies.config')}
                            </button>
                            {strategy.status === 'active' ? (
                                <button
                                    onClick={() => toggleStrategyStatus(strategy.id)}
                                    className="flex-1 flex justify-center items-center gap-2 p-2 rounded bg-loss text-white text-[10px] font-black uppercase hover:bg-loss/90 transition-colors"
                                >
                                    <Pause size={12} className="fill-current" />
                                    {t('strategies.paused').toUpperCase()}
                                </button>
                            ) : (
                                <button
                                    onClick={() => toggleStrategyStatus(strategy.id)}
                                    className="flex-1 flex justify-center items-center gap-2 p-2 rounded bg-profit text-white text-[10px] font-black uppercase hover:bg-profit/90 transition-colors"
                                >
                                    <Play size={12} className="fill-current" />
                                    {t('strategies.active').toUpperCase()}
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {/* 添加新策略 */}
                <div
                    onClick={() => setDeployModalOpen(true)}
                    className="border border-dashed border-zinc-300 rounded-sm flex flex-col items-center justify-center p-8 opacity-50 hover:opacity-100 transition-opacity cursor-pointer min-h-[300px] bg-zinc-50/50 hover:bg-zinc-50"
                >
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center mb-4">
                        <span className="text-2xl text-zinc-400 font-light">+</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase text-accent tracking-widest">{t('strategies.deployModal.deploy')}</span>
                </div>
            </div>

            {selectedStrategy && (
                <ConfigModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveConfig}
                    initialMaxPos={selectedStrategy.maxPos}
                    initialStopLoss={selectedStrategy.stopLoss}
                    strategyName={selectedStrategy.name}
                />
            )}

            <DeployAgentModal
                isOpen={deployModalOpen}
                onClose={() => setDeployModalOpen(false)}
                onDeploy={handleDeployAgent}
            />
        </div>
    );
}
