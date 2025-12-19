"use client";

import { useEffect, useState, useRef } from "react";
import { useI18n } from "@/i18n/I18nContext";
import { useStrategies } from "@/lib/StrategyContext";
import ModelIcon from "./ModelIcon";

interface LogEntry {
    id: string;
    source: string;
    message: string;
    status: 'info' | 'exec' | 'warn' | 'success';
    timestamp: string;
    color?: string;
}

export default function QuantLog() {
    const { t } = useI18n();
    const { strategies } = useStrategies();
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const activeStrategiesRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        const activeSet = new Set(
            strategies
                .filter(s => s.status === 'active')
                .map(s => s.provider)
        );
        activeStrategiesRef.current = activeSet;
    }, [strategies]);

    useEffect(() => {
        const runCycle = async () => {
            try {
                const res = await fetch('/api/quant/cycle');
                const data = await res.json();

                if (data.decisions) {
                    const newEntries: LogEntry[] = [];
                    Object.entries(data.decisions).forEach(([name, res]: [string, any]) => {
                        const isActive = Array.from(activeStrategiesRef.current).some(provider =>
                            name.toLowerCase().includes(provider.toLowerCase())
                        );

                        if (isActive) {
                            newEntries.push({
                                id: Math.random().toString(36).substring(7),
                                source: name,
                                message: res.decision.reasoning,
                                status: res.decision.action === 'HOLD' ? 'info' : 'exec',
                                timestamp: new Date().toLocaleTimeString(),
                                color: name.includes('DeepSeek') ? 'var(--deepseek)' :
                                    name.includes('GPT') ? 'var(--gpt5)' :
                                        name.includes('Claude') ? 'var(--claude)' :
                                            name.includes('Gemini') ? 'var(--gemini)' : 'var(--accent)',
                            });
                        }
                    });

                    if (newEntries.length > 0) {
                        setLogs((prev) => [...prev.slice(-40), ...newEntries]);
                    }
                }
            } catch (e) { }
        };

        runCycle();
        const interval = setInterval(runCycle, 6000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="flex flex-col h-full bg-white font-mono text-[11px] overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 flex justify-between items-center">
                <span className="uppercase tracking-widest text-slate-400 font-black text-[9px]">{t('terminal.liveTerminal')} _</span>
                <div className="flex gap-2 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-slate-400 font-black text-[9px]">{t('terminal.wssConnected')}</span>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth bg-slate-50/20"
            >
                {logs.map((log) => {
                    const modelId = log.source.toLowerCase().includes('deepseek') ? 'deepseek' :
                        log.source.toLowerCase().includes('gpt') ? 'gpt5' :
                            log.source.toLowerCase().includes('claude') ? 'claude' :
                                log.source.toLowerCase().includes('gemini') ? 'gemini' :
                                    log.source.toLowerCase().includes('qwen') ? 'qwen' :
                                        log.source.toLowerCase().includes('grok') ? 'grok' : 'default';

                    return (
                        <div key={log.id} className="flex gap-2 items-start leading-relaxed group">
                            <span className="text-slate-400 shrink-0 font-bold whitespace-nowrap">[{log.timestamp}]</span>
                            <div className="flex items-center gap-1 shrink-0">
                                <ModelIcon modelId={modelId} size={11} style={{ color: log.color }} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                                <span className="font-black transition-opacity group-hover:opacity-100 opacity-80" style={{ color: log.color }}>
                                    {log.source.replace(/[\[\]]/g, '')}
                                </span>
                            </div>
                            <span className={`font-medium ${log.status === 'warn' ? 'text-rose-600' :
                                log.status === 'success' ? 'text-emerald-600' :
                                    'text-slate-600'
                                }`}>
                                {log.message}
                            </span>
                        </div>
                    );
                })}
                {logs.length === 0 && <div className="text-slate-300 animate-pulse font-bold">{t('terminal.initializingTerminal')}</div>}
            </div>
        </div>
    );
}
