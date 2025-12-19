"use client";

import { useI18n } from "@/i18n/I18nContext";
import { useModels, AIModel } from "@/lib/ModelContext";
import { X, Plus, Trash2, ShieldCheck, ShieldAlert, Key, Globe, LayoutGrid, List, Settings } from "lucide-react";
import { useState } from "react";
import ModelIcon from "./ModelIcon";

interface ModelManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ModelManagementModal({ isOpen, onClose }: ModelManagementModalProps) {
    const { t } = useI18n();
    const { models, addModel, removeModel, toggleModelStatus } = useModels();
    const [view, setView] = useState<'list' | 'add'>('list');

    // New model state
    const [newName, setNewName] = useState("");
    const [newProvider, setNewProvider] = useState("");
    const [newApiKey, setNewApiKey] = useState("");
    const [newEndpoint, setNewEndpoint] = useState("");

    if (!isOpen) return null;

    const handleAdd = () => {
        if (newName && newProvider) {
            addModel({
                name: newName,
                provider: newProvider,
                apiKey: newApiKey,
                endpoint: newEndpoint,
                color: 'var(--accent)'
            });
            setNewName("");
            setNewProvider("");
            setNewApiKey("");
            setNewEndpoint("");
            setView('list');
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
            <div className="relative bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-tight text-slate-800">
                            {view === 'list' ? t('models.title') : t('models.addTitle')}
                        </h2>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">
                            {view === 'list' ? t('models.desc') : t('models.addDesc')}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-400"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs / Controls */}
                {view === 'list' && (
                    <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-white">
                        <div className="flex gap-4">
                            <span className="text-[10px] font-black text-emerald-600 border-b-2 border-emerald-500 pb-1 cursor-pointer uppercase">{t('models.activeModels')}</span>
                            <span className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer uppercase transition-colors">{t('models.endpointMetrics')}</span>
                        </div>
                        <button
                            onClick={() => setView('add')}
                            className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
                        >
                            <Plus size={12} />
                            {t('models.addBtn')}
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 bg-slate-50/20">
                    {view === 'list' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {models.map((model) => (
                                <div key={model.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                                <ModelIcon modelId={model.id} size={24} style={{ color: model.color }} />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-black text-slate-800 uppercase leading-none mb-1">{model.name}</h3>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{model.provider}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeModel(model.id)}
                                            className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-[9px] uppercase font-bold">
                                            <span className="text-slate-400">{t('models.status')}</span>
                                            <span className={`flex items-center gap-1 ${model.status === 'connected' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                {model.status === 'connected' ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                                                {model.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-[9px] uppercase font-bold">
                                            <span className="text-slate-400">{t('models.lastActive')}</span>
                                            <span className="text-slate-600">{model.lastUsed}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={() => toggleModelStatus(model.id)}
                                            className={`flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg border transition-all ${model.status === 'connected'
                                                ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200'
                                                }`}
                                        >
                                            {model.status === 'connected' ? t('models.disconnect') : t('models.connect')}
                                        </button>
                                        <button className="px-3 py-1.5 bg-slate-50 text-slate-400 hover:text-slate-800 border border-slate-200 rounded-lg transition-all">
                                            <Settings size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="max-w-md mx-auto space-y-6 py-4">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1.5">
                                        <LayoutGrid size={12} /> {t('models.name')}
                                    </label>
                                    <input
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="e.g. GPT-4o"
                                        className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1.5">
                                        <ShieldCheck size={12} /> {t('models.provider')}
                                    </label>
                                    <input
                                        value={newProvider}
                                        onChange={(e) => setNewProvider(e.target.value)}
                                        placeholder="e.g. OpenAI"
                                        className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1.5">
                                        <Key size={12} /> {t('models.apiKey')}
                                    </label>
                                    <input
                                        type="password"
                                        value={newApiKey}
                                        onChange={(e) => setNewApiKey(e.target.value)}
                                        placeholder="sk-..."
                                        className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1.5">
                                        <Globe size={12} /> {t('models.endpoint')}
                                    </label>
                                    <input
                                        value={newEndpoint}
                                        onChange={(e) => setNewEndpoint(e.target.value)}
                                        placeholder="https://api.openai.com/v1"
                                        className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => setView('list')}
                                    className="flex-1 py-3 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    {t('models.cancel')}
                                </button>
                                <button
                                    onClick={handleAdd}
                                    disabled={!newName || !newProvider}
                                    className="flex-1 py-3 bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl hover:bg-slate-700 disabled:opacity-50 transition-all shadow-xl active:scale-95"
                                >
                                    {t('models.connectBtn')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">{t('models.systemOptimal')}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-800 text-white text-[10px] font-black uppercase hover:bg-slate-700 rounded-xl transition-all shadow-lg active:scale-95"
                    >
                        {t('models.done')}
                    </button>
                </div>
            </div>
        </div>
    );
}
