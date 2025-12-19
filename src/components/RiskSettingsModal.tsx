"use client";

import { useI18n } from "@/i18n/I18nContext";
import { RiskProfileType, useRisk } from "@/lib/RiskContext";
import { X, Check } from "lucide-react";

interface RiskSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RiskSettingsModal({ isOpen, onClose }: RiskSettingsModalProps) {
    const { t } = useI18n();
    const { riskProfile, setRiskProfile } = useRisk();

    if (!isOpen) return null;

    const PROFILES: { id: RiskProfileType; label: string; desc: string; maxDD: string; vix: string }[] = [
        {
            id: 'conservative',
            label: t('risk.settings.conservative.label'),
            desc: t('risk.settings.conservative.desc'),
            maxDD: '5%',
            vix: '> 20'
        },
        {
            id: 'growth',
            label: t('risk.settings.growth.label'),
            desc: t('risk.settings.growth.desc'),
            maxDD: '10%',
            vix: '> 25'
        },
        {
            id: 'aggressive',
            label: t('risk.settings.aggressive.label'),
            desc: t('risk.settings.aggressive.desc'),
            maxDD: '15%',
            vix: '> 30'
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-sm font-black uppercase tracking-tight text-slate-800">{t('risk.settings.title')}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-400"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-500 mb-6 font-medium">
                        {t('risk.settings.desc')}
                    </p>

                    <div className="space-y-3">
                        {PROFILES.map((profile) => (
                            <div
                                key={profile.id}
                                onClick={() => setRiskProfile(profile.id)}
                                className={`
                                    relative p-4 rounded-xl border-2 cursor-pointer transition-all
                                    ${riskProfile === profile.id
                                        ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                                        : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`text-sm font-black uppercase ${riskProfile === profile.id ? 'text-emerald-900' : 'text-slate-800'}`}>
                                        {profile.label}
                                    </h3>
                                    {riskProfile === profile.id && (
                                        <div className="bg-emerald-500 p-0.5 rounded-full">
                                            <Check size={12} className="text-white" />
                                        </div>
                                    )}
                                </div>
                                <p className={`text-[11px] mb-4 font-medium ${riskProfile === profile.id ? 'text-emerald-700' : 'text-slate-500'}`}>
                                    {profile.desc}
                                </p>

                                <div className="flex gap-3 text-[10px] uppercase font-black">
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${riskProfile === profile.id ? 'bg-emerald-100/50 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                                        <span>DRAWDOWN:</span>
                                        <span className="font-black">{profile.maxDD}</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${riskProfile === profile.id ? 'bg-emerald-100/50 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                                        <span>VIX:</span>
                                        <span className="font-black">{profile.vix}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-800 text-white text-[10px] font-black uppercase hover:bg-slate-700 rounded-xl transition-all shadow-lg active:scale-95"
                    >
                        {t('risk.settings.done')}
                    </button>
                </div>
            </div>
        </div>
    );
}
