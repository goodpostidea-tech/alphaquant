"use client";

import { useI18n } from "@/i18n/I18nContext";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface ConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (maxPos: number, stopLoss: number) => void;
    initialMaxPos: number;
    initialStopLoss: number;
    strategyName: string;
}

export default function ConfigModal({
    isOpen,
    onClose,
    onSave,
    initialMaxPos,
    initialStopLoss,
    strategyName
}: ConfigModalProps) {
    const { t } = useI18n();
    const [maxPos, setMaxPos] = useState(initialMaxPos);
    const [stopLoss, setStopLoss] = useState(initialStopLoss);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setMaxPos(initialMaxPos);
            setStopLoss(initialStopLoss);
        }
    }, [isOpen, initialMaxPos, initialStopLoss]);

    if (!isOpen) return null;

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
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-tight text-slate-800">{t('strategies.modal.title')}</h2>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{strategyName}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] uppercase font-bold text-slate-500">
                            {t('strategies.maxPosition')}
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
                        <p className="text-[9px] text-slate-400">
                            {t('strategies.modal.maxPosDesc')}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] uppercase font-bold text-slate-500">
                            {t('strategies.stopLoss')}
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
                        <p className="text-[9px] text-slate-400">
                            {t('strategies.modal.stopLossDesc')}
                        </p>
                    </div>
                </div>

                <div className="p-4 border-t border-border bg-slate-50 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-[10px] font-bold uppercase text-slate-500 hover:bg-slate-200 rounded transition-colors"
                    >
                        {t('strategies.modal.cancel')}
                    </button>
                    <button
                        onClick={() => onSave(maxPos, stopLoss)}
                        className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-bold uppercase hover:bg-emerald-700 rounded transition-colors shadow-lg shadow-emerald-500/10"
                    >
                        {t('strategies.modal.save')}
                    </button>
                </div>
            </div>
        </div>
    );
}
