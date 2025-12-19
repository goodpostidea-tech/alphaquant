"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AgentStrategy {
    id: string;
    name: string;
    provider: string;
    status: 'active' | 'paused' | 'initializing';
    symbol: string;
    drift: string;
    maxPos: number;
    stopLoss: number;
    color: string;
}

interface StrategyContextType {
    strategies: AgentStrategy[];
    marketStatus: 'regular' | 'pre' | 'after' | 'closed';
    toggleStrategyStatus: (id: string) => void;
    updateStrategyConfig: (id: string, config: Partial<AgentStrategy>) => void;
    addStrategy: (strategy: Omit<AgentStrategy, 'id' | 'drift' | 'color' | 'status'>) => void;
    pauseAll: () => void;
    resumeAll: () => void;
}

const DEFAULT_STRATEGIES: AgentStrategy[] = [
    { id: 'deepseek', name: 'DeepSeek V3.1', provider: 'DeepSeek', status: 'active', symbol: 'NVDA', drift: '+0.45%', maxPos: 25, stopLoss: 5, color: 'var(--deepseek)' },
    { id: 'qwen', name: 'Qwen3 Max', provider: 'Alibaba', status: 'active', symbol: 'AAPL', drift: '+0.12%', maxPos: 20, stopLoss: 4, color: 'var(--qwen)' },
    { id: 'grok', name: 'Grok 4', provider: 'xAI', status: 'paused', symbol: 'TSLA', drift: '-1.20%', maxPos: 15, stopLoss: 8, color: 'var(--grok)' },
    { id: 'claude', name: 'Claude 4.5', provider: 'Anthropic', status: 'active', symbol: 'MSFT', drift: '+0.05%', maxPos: 20, stopLoss: 3, color: 'var(--claude)' },
    { id: 'gemini', name: 'Gemini 2.5', provider: 'Google', status: 'initializing', symbol: 'AMZN', drift: '0.00%', maxPos: 10, stopLoss: 10, color: 'var(--gemini)' },
    { id: 'gpt5', name: 'GPT-5', provider: 'OpenAI', status: 'active', symbol: 'GOOGL', drift: '-0.32%', maxPos: 30, stopLoss: 6, color: 'var(--gpt5)' },
];

const StrategyContext = createContext<StrategyContextType | undefined>(undefined);

export function StrategyProvider({ children }: { children: ReactNode }) {
    const [strategies, setStrategies] = useState<AgentStrategy[]>(DEFAULT_STRATEGIES);
    const [marketStatus, setMarketStatus] = useState<'regular' | 'pre' | 'after' | 'closed'>('regular');
    const [isClient, setIsClient] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        setIsClient(true);
        const saved = localStorage.getItem('alphaquant_strategies');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge saved data with default structure to handle schema updates
                // Also includes any new strategies added by the user that were saved
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setStrategies(parsed);
                }
            } catch (e) {
                console.error("Failed to parse strategies", e);
            }
        }
    }, []);

    // Persist strategies to local storage whenever they change
    useEffect(() => {
        if (isClient) {
            localStorage.setItem('alphaquant_strategies', JSON.stringify(strategies));
        }
    }, [strategies, isClient]);

    const toggleStrategyStatus = (id: string) => {
        setStrategies(prev => prev.map(s => {
            if (s.id === id) {
                return { ...s, status: s.status === 'active' ? 'paused' : 'active' };
            }
            return s;
        }));
    };

    const updateStrategyConfig = (id: string, config: Partial<AgentStrategy>) => {
        setStrategies(prev => prev.map(s => {
            if (s.id === id) {
                return { ...s, ...config };
            }
            return s;
        }));
    };

    const addStrategy = (newStrategy: Omit<AgentStrategy, 'id' | 'drift' | 'color' | 'status'>) => {
        const id = newStrategy.name.toLowerCase().replace(/\s+/g, '-');
        const strategy: AgentStrategy = {
            ...newStrategy,
            id,
            status: 'initializing',
            drift: '0.00%',
            color: 'var(--accent)', // Default color
        };
        setStrategies(prev => [...prev, strategy]);
    };

    const pauseAll = () => {
        setStrategies(prev => prev.map(s => ({ ...s, status: 'paused' })));
    };

    const resumeAll = () => {
        setStrategies(prev => prev.map(s => ({ ...s, status: 'active' })));
    };

    return (
        <StrategyContext.Provider value={{
            strategies,
            marketStatus,
            toggleStrategyStatus,
            updateStrategyConfig,
            addStrategy,
            pauseAll,
            resumeAll
        }}>
            {children}
        </StrategyContext.Provider>
    );
}

export function useStrategies() {
    const context = useContext(StrategyContext);
    if (context === undefined) {
        throw new Error("useStrategies must be used within a StrategyProvider");
    }
    return context;
}
