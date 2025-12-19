"use client";

import { useStrategies } from "@/lib/StrategyContext";
import { useI18n } from "@/i18n/I18nContext";
import { Pause, Play, Settings, Plus } from "lucide-react";
import { useState } from "react";
import ConfigModal from "@/components/ConfigModal";
import DeployAgentModal from "@/components/DeployAgentModal";
import ModelIcon from "@/components/ModelIcon";

export default function CompactStrategyPanel() {
    const { t } = useI18n();
    const { strategies, toggleStrategyStatus, pauseAll, resumeAll, updateStrategyConfig, addStrategy } = useStrategies();

    const [configModalOpen, setConfigModalOpen] = useState(false);
    const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);
    const [deployModalOpen, setDeployModalOpen] = useState(false);

    const handleOpenConfig = (id: string) => {
        setSelectedStrategyId(id);
        setConfigModalOpen(true);
    };

    const handleSaveConfig = (max: number, sl: number) => {
        if (selectedStrategyId) {
            updateStrategyConfig(selectedStrategyId, {
                maxPos: max,
                stopLoss: sl
            });
        }
        setConfigModalOpen(false);
    };

    const handleDeployAgent = (name: string, provider: string, symbol: string, maxPos: number, stopLoss: number) => {
        addStrategy({ name, provider, symbol, maxPos, stopLoss });
        setDeployModalOpen(false);
    };

    const currentStrategy = selectedStrategyId ? strategies.find(s => s.id === selectedStrategyId) : null;

    return (
        <div className="h-full bg-white flex flex-col">
            {/* Modals */}
            {currentStrategy && (
                <ConfigModal
                    isOpen={configModalOpen}
                    onClose={() => setConfigModalOpen(false)}
                    onSave={handleSaveConfig}
                    initialMaxPos={currentStrategy.maxPos}
                    initialStopLoss={currentStrategy.stopLoss}
                    strategyName={currentStrategy.name}
                />
            )}
            <DeployAgentModal
                isOpen={deployModalOpen}
                onClose={() => setDeployModalOpen(false)}
                onDeploy={handleDeployAgent}
            />

            {/* Header */}
            <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[11px] font-black uppercase tracking-tight text-slate-800">
                        {t('strategies.title')}
                    </h3>
                    <button
                        onClick={() => setDeployModalOpen(true)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        title="Deploy New Agent"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                {/* Global Controls */}
                <div className="flex gap-2">
                    <button
                        onClick={pauseAll}
                        className="flex-1 px-2 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 text-[9px] font-bold uppercase rounded-md transition-colors flex items-center justify-center gap-1 border border-amber-200/50"
                    >
                        <Pause size={10} />
                        {t('strategies.pauseAll')}
                    </button>
                    <button
                        onClick={resumeAll}
                        className="flex-1 px-2 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-[9px] font-bold uppercase rounded-md transition-colors flex items-center justify-center gap-1 border border-emerald-200/50"
                    >
                        <Play size={10} />
                        {t('strategies.resumeAll')}
                    </button>
                </div>
            </div>

            {/* Agent List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-slate-50/30">
                {strategies.map((strategy) => (
                    <div
                        key={strategy.id}
                        className={`w-full p-2 rounded-lg border transition-all ${strategy.status === 'active'
                            ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                            : 'bg-slate-50 border-slate-200/50 opacity-60'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <button
                                onClick={() => toggleStrategyStatus(strategy.id)}
                                className="flex items-center gap-2 flex-1 min-w-0"
                            >
                                <div className="relative">
                                    <ModelIcon modelId={strategy.id} size={16} style={{ color: strategy.color }} className="opacity-80" />
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-white ${strategy.status === 'active' ? 'bg-profit' : 'bg-slate-300'}`} />
                                </div>
                                <span className="text-[11px] font-bold truncate text-slate-800">
                                    {strategy.name}
                                </span>
                            </button>
                            <div className="flex items-center gap-1">
                                {strategy.status === 'paused' && (
                                    <Pause size={10} className="text-amber-500 flex-shrink-0" />
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenConfig(strategy.id);
                                    }}
                                    className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-slate-900"
                                    title="Configure"
                                >
                                    <Settings size={12} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-[9px] text-slate-500 font-medium">
                            <span className="truncate">{strategy.symbol}</span>
                            <span className="font-mono bg-slate-100 px-1 rounded">{strategy.maxPos}%</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Stats */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-[9px] uppercase font-bold text-slate-400">
                <div className="flex justify-between mb-1">
                    <span>{t('strategies.active')}:</span>
                    <span className="text-emerald-600 font-black">
                        {strategies.filter(s => s.status === 'active').length}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>{t('strategies.paused')}:</span>
                    <span className="text-amber-500 font-black">
                        {strategies.filter(s => s.status === 'paused').length}
                    </span>
                </div>
            </div>
        </div>
    );
}
