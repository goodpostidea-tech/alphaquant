"use client";

import { useI18n } from "@/i18n/I18nContext";
import { Globe, Settings, User as UserIcon, LogOut } from "lucide-react";
import { useState } from "react";
import ModelManagementModal from "./ModelManagementModal";
import AuthModal from "./AuthModal";
import { useAuth } from "@/lib/AuthContext";

export default function TopNavBar() {
    const { t, locale, setLocale } = useI18n();
    const { user, logout } = useAuth();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);

    // Mock account data - in real app, this would come from context
    const accountValue = 156842.50;
    const dailyChange = 3847.20;
    const dailyChangePercent = 2.51;
    const isPositive = dailyChange >= 0;

    return (
        <div className="w-full bg-white text-slate-800 border-b border-border px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
            <ModelManagementModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                onSuccess={(u) => console.log("Login success", u)}
            />
            {/* Left: Branding */}
            <div className="flex items-center gap-6">
                <div className="select-none cursor-pointer group">
                    <div className="text-xl font-black tracking-tighter uppercase italic text-slate-800">
                        Alpha<span className="text-emerald-600 transition-colors group-hover:text-emerald-500">Quant</span>
                    </div>
                    <div className="text-[9px] text-emerald-600 uppercase font-black tracking-widest">
                        Terminal v1.1.0
                    </div>
                </div>
            </div>

            {/* Center: Account Summary */}
            <div className="flex items-center gap-12">
                <div className="text-center group">
                    <div className="text-[10px] text-slate-400 uppercase font-black mb-0.5 tracking-tighter transition-colors group-hover:text-slate-500">
                        {t('common.totalEquities')}
                    </div>
                    <div className="text-2xl font-black tracking-tighter text-slate-800">
                        ${accountValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="text-center group">
                    <div className="text-[10px] text-slate-400 uppercase font-black mb-0.5 tracking-tighter transition-colors group-hover:text-slate-500">
                        {t('common.sessionAlpha')}
                    </div>
                    <div className={`text-xl font-black tracking-tighter ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPositive ? '+' : ''}{dailyChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-[10px] ml-1 opacity-80 font-black">
                            ({isPositive ? '+' : ''}{dailyChangePercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-4">
                {/* Market Status */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
                        Live
                    </span>
                </div>

                {/* Language Toggle */}
                <button
                    onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all active:scale-95"
                >
                    <Globe size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase text-slate-600">
                        {locale === 'en' ? 'EN / 中' : '中 / EN'}
                    </span>
                </button>

                {/* User Account / Auth */}
                {user ? (
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black uppercase text-slate-800 tracking-tighter">{user.name || user.email.split('@')[0]}</span>
                            <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest leading-none">{t('auth.operator')}</span>
                        </div>
                        <button
                            onClick={logout}
                            title={t('auth.logout')}
                            className="p-2 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 rounded-lg transition-all active:scale-95 text-slate-400 hover:text-rose-600"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setAuthModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-900 rounded-lg transition-all active:scale-95 shadow-lg shadow-slate-200"
                    >
                        <UserIcon size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {t('auth.signIn')}
                        </span>
                    </button>
                )}

                {/* Settings */}
                <button
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all active:scale-95 text-slate-400 hover:text-slate-900"
                >
                    <Settings size={16} />
                </button>
            </div>
        </div>
    );
}
