"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './en.json';
import zh from './zh.json';

type Language = 'en' | 'zh';
type Dictionary = typeof en;

interface I18nContextType {
    locale: Language;
    t: (key: string, params?: Record<string, any>) => string;
    setLocale: (locale: Language) => void;
}

const dictionaries: Record<Language, any> = { en, zh };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Language>('en');

    // Load preference from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('locale') as Language;
        if (saved && (saved === 'en' || saved === 'zh')) {
            setLocale(saved);
        }
    }, []);

    const handleSetLocale = (newLocale: Language) => {
        setLocale(newLocale);
        localStorage.setItem('locale', newLocale);
    };

    const t = (path: string, params?: Record<string, any>) => {
        const keys = path.split('.');
        let value = dictionaries[locale];

        for (const key of keys) {
            value = value?.[key];
        }

        if (typeof value !== 'string') return path;

        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                value = (value as string).replace(`{${k}}`, String(v));
            });
        }

        return value as string;
    };

    return (
        <I18nContext.Provider value={{ locale, t, setLocale: handleSetLocale }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}
