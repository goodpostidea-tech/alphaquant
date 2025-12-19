"use client";

import { useRisk, AlertLevel } from "@/lib/RiskContext";
import { useI18n } from "@/i18n/I18nContext";
import { Shield, AlertTriangle, Settings } from "lucide-react";
import { useState } from "react";
import RiskSettingsModal from "./RiskSettingsModal";

export default function CompactRiskSidebar() {
    const { t } = useI18n();
    const { metrics, systemStatus, alerts, riskProfile } = useRisk();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const getStatusColor = (level: AlertLevel) => {
        switch (level) {
            case 'normal': return 'text-emerald-500';
            case 'warning': return 'text-amber-500';
            case 'defense': return 'text-orange-500';
            case 'halt': return 'text-rose-500';
            default: return 'text-slate-400';
        }
    };

    return (
        <div className="h-full bg-white flex flex-col">
            <RiskSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            {/* Header */}
            <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${getStatusColor(systemStatus)}`} />
                    <h3 className="text-[11px] font-black uppercase tracking-tight text-slate-800">
                        {t('risk.title')}
                    </h3>
                </div>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400 hover:text-slate-900"
                >
                    <Settings size={14} />
                </button>
            </div>

            {/* Metrics */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/30">
                {/* Health Score */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-[9px] font-bold uppercase text-slate-400 mb-2">
                        {t('risk.healthScore')}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="text-3xl font-black tracking-tighter text-slate-800">
                                {metrics.healthScore}
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${metrics.healthScore > 70 ? 'bg-emerald-500' :
                                        metrics.healthScore > 50 ? 'bg-amber-500' : 'bg-rose-500'
                                        }`}
                                    style={{ width: `${metrics.healthScore}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Risk Budget */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-[9px] font-bold uppercase text-slate-400 mb-2">
                        {t('risk.dailyBudget')}
                    </div>
                    <div className="text-xl font-black tracking-tight mb-1 text-slate-800">
                        ${metrics.riskBudgetRemaining.toLocaleString()}
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${metrics.riskBudgetRemaining < 2000 ? 'bg-rose-500' : 'bg-slate-500'
                                }`}
                            style={{ width: `${(metrics.riskBudgetRemaining / metrics.maxDailyLoss) * 100}%` }}
                        />
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1 font-medium">
                        {t('risk.used')}: ${metrics.dailyLoss.toLocaleString()}
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm text-center">
                        <div className="text-[9px] font-bold uppercase text-slate-400 mb-1">
                            {t('risk.vix')}
                        </div>
                        <div className={`text-lg font-black ${metrics.currentVix > 25 ? 'text-rose-500' : 'text-slate-800'}`}>
                            {metrics.currentVix.toFixed(1)}
                        </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm text-center">
                        <div className="text-[9px] font-bold uppercase text-slate-400 mb-1">
                            {t('risk.exposure')}
                        </div>
                        <div className={`text-lg font-black ${metrics.exposureRatio > 80 ? 'text-amber-500' : 'text-slate-800'}`}>
                            {metrics.exposureRatio.toFixed(0)}%
                        </div>
                    </div>
                </div>

                {/* Active Alerts */}
                {alerts.filter(a => a.active).length > 0 && (
                    <div className="space-y-1">
                        <div className="text-[9px] font-bold uppercase text-slate-400 mb-1">
                            {t('risk.liveAlerts')}
                        </div>
                        {alerts.filter(a => a.active).slice(0, 3).map(alert => (
                            <div
                                key={alert.id}
                                className="p-2 rounded-lg border border-rose-100 bg-rose-50/50 flex items-start gap-2"
                            >
                                <AlertTriangle size={12} className="text-rose-500 mt-0.5 flex-shrink-0" />
                                <p className="text-[10px] text-rose-900 leading-tight flex-1 font-medium">
                                    {alert.message}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-[9px] uppercase font-bold text-slate-400">
                <div className="flex justify-between">
                    <span>{t('risk.profile')}:</span>
                    <span className="text-slate-800 font-black tracking-tight">{riskProfile}</span>
                </div>
            </div>
        </div>
    );
}
