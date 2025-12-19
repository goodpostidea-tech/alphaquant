"use client";

import { useState } from "react";
import { X, Mail, Lock, User, ShieldCheck, ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const { t } = useI18n();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
        const body = mode === 'login' ? { email, password } : { email, password, name };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || t('common.error'));
            }

            onSuccess(data.user);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Branding Accent */}
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-slate-800 w-full" />

                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 mb-4 shadow-sm">
                            <ShieldCheck size={24} className="text-slate-800" />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">
                            {mode === 'login' ? t('auth.title') : t('auth.regTitle')}
                        </h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            {t('auth.desc')}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-slate-50 p-1 rounded-xl mb-6">
                        <button
                            onClick={() => { setMode('login'); setError(null); }}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-tight rounded-lg transition-all ${mode === 'login' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {t('auth.signIn')}
                        </button>
                        <button
                            onClick={() => { setMode('register'); setError(null); }}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-tight rounded-lg transition-all ${mode === 'register' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {t('auth.register')}
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                                    <User size={12} /> {t('auth.name')}
                                </label>
                                <input
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('auth.namePlaceholder')}
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                                <Mail size={12} /> {t('auth.email')}
                            </label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('auth.emailPlaceholder')}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                                <Lock size={12} /> {t('auth.password')}
                            </label>
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('auth.passPlaceholder')}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                                <p className="text-[10px] text-rose-600 font-bold uppercase text-center">{error}</p>
                            </div>
                        )}

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-4 bg-slate-800 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-700 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? t('auth.loading') : (mode === 'login' ? t('auth.enter') : t('auth.create'))}
                            {!loading && <ArrowRight size={14} />}
                        </button>
                    </form>
                </div>

                <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        {t('auth.secure')}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-800 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}
