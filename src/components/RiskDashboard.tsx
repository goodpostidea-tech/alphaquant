"use client";

import { useRisk, AlertLevel } from "@/lib/RiskContext";
import { useI18n } from "@/i18n/I18nContext";
import { Shield, AlertTriangle, Activity, Zap, Info, Settings, History, Trash2 } from "lucide-react";
import { useState } from "react";
import RiskSettingsModal from "./RiskSettingsModal";

export default function RiskDashboard() {
    const { t } = useI18n();
    const { metrics, systemStatus, alerts, history, riskProfile, setRiskProfile, acknowledgeAlert, clearHistory } = useRisk();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'live' | 'history'>('live');

    // Helper to get color by alert level
    const getStatusColor = (level: AlertLevel) => {
        switch (level) {
            case 'normal': return 'text-profit';
            case 'warning': return 'text-yellow-500';
            case 'defense': return 'text-orange-500';
            case 'halt': return 'text-loss';
            default: return 'text-zinc-500';
        }
    };

    const getBgColor = (level: AlertLevel) => {
        switch (level) {
            case 'normal': return 'bg-profit/10 border-profit/20';
            case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
            case 'defense': return 'bg-orange-500/10 border-orange-500/20';
            case 'halt': return 'bg-loss/10 border-loss/20';
            default: return 'bg-zinc-100 border-zinc-200';
        }
    };

    return (
        <div className="h-full flex flex-col bg-white border-l border-border relative">
            <RiskSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            {/* Header */}
            <div className={`p-4 border-b border-border flex items-center justify-between ${getBgColor(systemStatus)}`}>
                <div className="flex items-center gap-3">
                    <Shield className={`w-5 h-5 ${getStatusColor(systemStatus)}`} />
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-tight">{t('risk.title')}</h2>
                        <span className={`text-[10px] font-bold uppercase ${getStatusColor(systemStatus)}`}>
                            {t('risk.systemStatus')}: {t(`risk.status.${systemStatus}`)}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-white/50 border border-black/5 rounded text-[9px] font-bold uppercase text-zinc-500">
                        {t('risk.profile')}: <span className="text-black">{riskProfile}</span>
                    </div>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-1.5 bg-white border border-border hover:bg-zinc-50 rounded transition-colors text-zinc-500 hover:text-black"
                    >
                        <Settings size={14} />
                    </button>
                </div>
            </div>

            {/* Main Metrics */}
            <div className="p-4 grid grid-cols-2 gap-4 border-b border-border bg-zinc-50/50">
                {/* Health Score */}
                <div className="bg-white p-3 rounded-sm border border-border shadow-sm flex flex-col items-center justify-center relative">
                    <span className="text-[10px] font-bold uppercase text-zinc-400 absolute top-2 left-2">{t('risk.healthScore')}</span>
                    <div className="w-16 h-16 rounded-full border-4 border-zinc-100 flex items-center justify-center relative mt-4">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path
                                className={`${metrics.healthScore > 70 ? 'text-profit' : metrics.healthScore > 50 ? 'text-yellow-500' : 'text-loss'}`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeDasharray={`${metrics.healthScore}, 100`}
                            />
                        </svg>
                        <span className="text-xl font-black">{metrics.healthScore}</span>
                    </div>
                </div>

                {/* Risk Budget */}
                <div className="bg-white p-3 rounded-sm border border-border shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase text-zinc-400">{t('risk.dailyRiskBudget')}</span>
                        <Zap size={12} className="text-zinc-300" />
                    </div>
                    <div>
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-lg font-black tracking-tight">${metrics.riskBudgetRemaining.toLocaleString()}</span>
                            <span className="text-[10px] font-medium text-zinc-400">/ ${metrics.maxDailyLoss.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${metrics.riskBudgetRemaining < 2000 ? 'bg-loss' : 'bg-zinc-800'}`}
                                style={{ width: `${(metrics.riskBudgetRemaining / metrics.maxDailyLoss) * 100}%` }}
                            />
                        </div>
                        <span className="text-[9px] text-zinc-400 mt-1 block">
                            {t('risk.used')}: ${(metrics.dailyLoss).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-2 text-center text-[10px] uppercase font-bold text-zinc-500 border-b border-border">
                <div className="p-2 border-r border-border hover:bg-zinc-50 transition-colors">
                    {t('risk.vix')}: <span className={`${metrics.currentVix > 25 ? 'text-loss' : 'text-zinc-800'}`}>{metrics.currentVix.toFixed(2)}</span>
                </div>
                <div className="p-2 hover:bg-zinc-50 transition-colors">
                    {t('risk.exposure')}: <span className={`${metrics.exposureRatio > 80 ? 'text-yellow-500' : 'text-zinc-800'}`}>{metrics.exposureRatio.toFixed(0)}%</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border bg-white">
                <button
                    onClick={() => setActiveTab('live')}
                    className={`flex-1 py-3 text-[10px] font-bold uppercase transition-colors relative ${activeTab === 'live' ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                    {t('risk.liveAlerts')}
                    {activeTab === 'live' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 text-[10px] font-bold uppercase transition-colors relative ${activeTab === 'history' ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                    {t('risk.riskLogs')}
                    {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
                </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-zinc-50/30">
                {activeTab === 'live' ? (
                    <>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase text-zinc-400">{t('risk.activeTriggers')}</span>
                            <span className="text-[10px] font-bold bg-zinc-200 px-1.5 rounded-full text-zinc-600">{alerts.length}</span>
                        </div>

                        {alerts.length === 0 ? (
                            <div className="text-center py-8 opacity-50">
                                <Shield size={24} className="mx-auto mb-2 text-zinc-300" />
                                <p className="text-[10px] text-zinc-400">{t('risk.allSystemsNominal')}</p>
                            </div>
                        ) : (
                            alerts.map(alert => (
                                <div
                                    key={alert.id}
                                    className={`p-3 rounded-sm border flex items-start gap-3 transition-all animate-in slide-in-from-right-2 duration-300 ${alert.active ? 'opacity-100' : 'opacity-50 grayscale'
                                        } ${alert.level === 'halt' ? 'bg-loss/5 border-loss/20' :
                                            alert.level === 'defense' ? 'bg-orange-500/5 border-orange-500/20' :
                                                'bg-yellow-500/5 border-yellow-500/20'
                                        }`}
                                >
                                    <AlertTriangle size={14} className={`mt-0.5 shrink-0 ${getStatusColor(alert.level)}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-bold text-zinc-800 leading-tight">{alert.message}</p>
                                        <span className="text-[9px] text-zinc-400 mt-1 block">
                                            {new Date(alert.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    {alert.active && (
                                        <button
                                            onClick={() => acknowledgeAlert(alert.id)}
                                            className="text-[9px] uppercase font-bold text-zinc-400 hover:text-zinc-800 underline decoration-dotted"
                                        >
                                            {t('risk.ack')}
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase text-zinc-400">{t('risk.eventHistory')}</span>
                            <button onClick={clearHistory} className="text-zinc-400 hover:text-loss transition-colors">
                                <Trash2 size={12} />
                            </button>
                        </div>

                        {history.length === 0 ? (
                            <div className="text-center py-8 opacity-50">
                                <History size={24} className="mx-auto mb-2 text-zinc-300" />
                                <p className="text-[10px] text-zinc-400">{t('risk.noHistoricalEvents')}</p>
                            </div>
                        ) : (
                            history.map(event => (
                                <div
                                    key={event.id}
                                    className="p-3 rounded-sm border bg-white border-border flex items-start gap-3 opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    <div className={`mt-1 w-1.5 h-1.5 rounded-full ${event.level === 'normal' ? 'bg-zinc-300' : getStatusColor(event.level).replace('text-', 'bg-')}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-bold text-zinc-600 leading-tight">{event.message}</p>
                                        <span className="text-[9px] text-zinc-400 mt-1 block">
                                            {new Date(event.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
