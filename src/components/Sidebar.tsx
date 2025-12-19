"use client";

import {
    BarChart3,
    Terminal,
    ShieldAlert,
    Database,
    Settings,
    Activity,
    Globe
} from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

interface SidebarProps {
    activeTab: string;
    onTabChange: (id: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    const { t, locale, setLocale } = useI18n();

    const NAV_ITEMS = [
        { id: 'dashboard', icon: BarChart3, label: t('common.dashboard') },
        { id: 'strategies', icon: Activity, label: t('common.strategies') },
        { id: 'risk', icon: ShieldAlert, label: t('common.risk') },
    ];

    return (
        <div className="w-16 md:w-48 h-screen bg-white border-r border-border flex flex-col pt-6 pb-4">
            <div className="px-4 mb-8 hidden md:block select-none cursor-pointer" onClick={() => onTabChange('dashboard')}>
                <div className="text-xl font-black tracking-tighter uppercase italic">
                    Alpha<span className="text-accent">Quant</span>
                </div>
                <div className="text-[10px] text-accent uppercase font-bold">V 1.0.4 - BETA</div>
            </div>

            <nav className="flex-1 flex flex-col gap-1 px-2">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`flex items-center gap-3 p-3 rounded transition-colors group ${activeTab === item.id ? 'bg-zinc-100' : 'hover:bg-zinc-50'
                            }`}
                    >
                        <item.icon size={20} className={activeTab === item.id ? 'text-black' : 'text-accent group-hover:text-black'} />
                        <span className={`text-sm font-bold uppercase hidden md:block ${activeTab === item.id ? 'text-black' : 'text-accent group-hover:text-black'
                            }`}>
                            {item.label}
                        </span>
                        {item.id === activeTab && (
                            <div className="ml-auto w-1 h-3 bg-black rounded-full hidden md:block" />
                        )}
                    </button>
                ))}
            </nav>

            <div className="px-2 mt-auto space-y-1">
                <button
                    onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
                    className="flex items-center gap-3 p-3 rounded hover:bg-zinc-100 transition-colors w-full group text-left"
                >
                    <Globe size={20} className="text-accent group-hover:text-black" />
                    <span className="text-sm font-bold uppercase hidden md:block text-accent group-hover:text-black">
                        {locale === 'en' ? 'ZH / EN' : '中 / 英'}
                    </span>
                </button>

                <button className="flex items-center gap-3 p-3 rounded hover:bg-zinc-100 transition-colors w-full group text-left">
                    <Settings size={20} className="text-accent group-hover:text-black" />
                    <span className="text-sm font-bold uppercase hidden md:block text-accent group-hover:text-black">
                        {t('common.settings')}
                    </span>
                </button>
                <div className="h-px bg-border my-4 mx-2" />
                <div className="px-3 py-1 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 flex-shrink-0" />
                    <div className="hidden md:block">
                        <div className="text-[11px] font-bold uppercase leading-none">SCJT User</div>
                        <div className="text-[9px] text-profit uppercase">{t('common.proTier')}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
