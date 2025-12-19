"use client";

import { useI18n } from "@/i18n/I18nContext";
import { X } from "lucide-react";
import { useState } from "react";

interface DeployAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDeploy: (name: string, provider: string, symbol: string, maxPos: number, stopLoss: number) => void;
}

export default function DeployAgentModal({
    isOpen,
    onClose,
    onDeploy
}: DeployAgentModalProps) {
    const { t } = useI18n();
    const [name, setName] = useState("");
    const [provider, setProvider] = useState("");
    const [symbol, setSymbol] = useState("");
    const [maxPos, setMaxPos] = useState(10);
    const [stopLoss, setStopLoss] = useState(5);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (name && provider && symbol) {
            onDeploy(name, provider, symbol, maxPos, stopLoss);
            // Reset fields
            setName("");
            setProvider("");
            setSymbol("");
            setMaxPos(10);
            setStopLoss(5);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white border border-border rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-border bg-slate-50">
                    <h2 className="text-sm font-black uppercase tracking-tight text-slate-800">{t('strategies.deployModal.title')}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-500">
                            {t('strategies.deployModal.name')}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Llama 3 - Bull"
                            className="w-full bg-white border border-border px-3 py-2 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-300 transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-500">
                            {t('strategies.deployModal.provider')}
                        </label>
                        <input
                            type="text"
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            placeholder="e.g. Meta"
                            className="w-full bg-white border border-border px-3 py-2 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-300 transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-500">
                            {t('strategies.deployModal.symbol')}
                        </label>
                        <input
                            type="text"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                            placeholder="e.g. META"
                            className="w-full bg-white border border-border px-3 py-2 rounded-md text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-300 uppercase transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-[10px] uppercase font-bold text-slate-500">
                                {t('strategies.deployModal.maxPos')}
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={maxPos}
                                    onChange={(e) => setMaxPos(Number(e.target.value))}
                                    className="w-full bg-white border border-border px-3 py-2 rounded-md text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                />
                                <span className="text-sm font-black text-slate-800">%</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[10px] uppercase font-bold text-slate-500">
                                {t('strategies.deployModal.stopLoss')}
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={stopLoss}
                                    onChange={(e) => setStopLoss(Number(e.target.value))}
                                    className="w-full bg-white border border-border px-3 py-2 rounded-md text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                />
                                <span className="text-sm font-black text-slate-800">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-slate-50 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-[10px] font-bold uppercase text-slate-500 hover:bg-slate-200 rounded transition-colors"
                    >
                        {t('strategies.deployModal.cancel')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!name || !provider || !symbol}
                        className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase hover:bg-emerald-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/10"
                    >
                        {t('strategies.deployModal.deploy')}
                    </button>
                </div>
            </div>
        </div>
    );
}
