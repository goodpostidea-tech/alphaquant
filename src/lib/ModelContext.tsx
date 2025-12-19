"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AIModel {
    id: string;
    name: string;
    provider: string;
    apiKey?: string;
    endpoint?: string;
    status: 'connected' | 'disconnected' | 'error';
    lastUsed: string;
    color: string;
}

interface ModelContextType {
    models: AIModel[];
    addModel: (model: Omit<AIModel, 'id' | 'status' | 'lastUsed'>) => void;
    removeModel: (id: string) => void;
    updateModel: (id: string, updates: Partial<AIModel>) => void;
    toggleModelStatus: (id: string) => void;
}

const DEFAULT_MODELS: AIModel[] = [
    { id: 'deepseek', name: 'DeepSeek V3.1', provider: 'DeepSeek', status: 'connected', lastUsed: '2 mins ago', color: 'var(--deepseek)' },
    { id: 'qwen', name: 'Qwen 2.5', provider: 'Alibaba', status: 'connected', lastUsed: '5 mins ago', color: 'var(--qwen)' },
    { id: 'gpt4', name: 'GPT-4o', provider: 'OpenAI', status: 'connected', lastUsed: '10 mins ago', color: 'var(--gpt5)' },
    { id: 'claude', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', status: 'connected', lastUsed: '1 hour ago', color: 'var(--claude)' },
    { id: 'gemini', name: 'Gemini 1.5 Pro', provider: 'Google', status: 'connected', lastUsed: '3 hours ago', color: 'var(--gemini)' },
];

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: ReactNode }) {
    const [models, setModels] = useState<AIModel[]>(DEFAULT_MODELS);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const saved = localStorage.getItem('alphaquant_models');
        if (saved) {
            try {
                setModels(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse models", e);
            }
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem('alphaquant_models', JSON.stringify(models));
        }
    }, [models, isClient]);

    const addModel = (newModel: Omit<AIModel, 'id' | 'status' | 'lastUsed'>) => {
        const model: AIModel = {
            ...newModel,
            id: newModel.name.toLowerCase().replace(/\s+/g, '-'),
            status: 'connected',
            lastUsed: 'Just now',
        };
        setModels(prev => [...prev, model]);
    };

    const removeModel = (id: string) => {
        setModels(prev => prev.filter(m => m.id !== id));
    };

    const updateModel = (id: string, updates: Partial<AIModel>) => {
        setModels(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const toggleModelStatus = (id: string) => {
        setModels(prev => prev.map(m => {
            if (m.id === id) {
                return { ...m, status: m.status === 'connected' ? 'disconnected' : 'connected' };
            }
            return m;
        }));
    };

    return (
        <ModelContext.Provider value={{
            models,
            addModel,
            removeModel,
            updateModel,
            toggleModelStatus
        }}>
            {children}
        </ModelContext.Provider>
    );
}

export function useModels() {
    const context = useContext(ModelContext);
    if (context === undefined) {
        throw new Error("useModels must be used within a ModelProvider");
    }
    return context;
}
