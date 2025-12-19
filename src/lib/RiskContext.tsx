"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useStrategies } from "./StrategyContext";

// Types
export type RiskProfileType = 'conservative' | 'growth' | 'aggressive';
export type AlertLevel = 'normal' | 'warning' | 'defense' | 'halt';

export interface RiskMetrics {
    healthScore: number;       // 0-100
    dailyLoss: number;         // Current loss amount
    maxDailyLoss: number;      // Budget limit based on profile
    riskBudgetRemaining: number; // $ value
    currentVix: number;
    exposureRatio: number;     // 0-100%
}

export interface RiskAlert {
    id: string;
    level: AlertLevel;
    message: string;
    timestamp: number;
    active: boolean;
}

interface RiskContextType {
    riskProfile: RiskProfileType;
    setRiskProfile: (profile: RiskProfileType) => void;
    metrics: RiskMetrics;
    alerts: RiskAlert[];
    history: RiskAlert[];
    systemStatus: AlertLevel; // Derived global status
    acknowledgeAlert: (id: string) => void;
    clearHistory: () => void;
}

// Profile Definitions
const PROFILES = {
    conservative: { maxDrawdownPct: 0.05, vixWarning: 20 },
    growth: { maxDrawdownPct: 0.10, vixWarning: 25 },
    aggressive: { maxDrawdownPct: 0.15, vixWarning: 30 }
};

const TOTAL_CAPITAL = 100000; // Mock total capital

const RiskContext = createContext<RiskContextType | undefined>(undefined);

export function RiskProvider({ children }: { children: ReactNode }) {
    const { strategies } = useStrategies();

    // State
    const [riskProfile, setRiskProfile] = useState<RiskProfileType>('growth');
    const [metrics, setMetrics] = useState<RiskMetrics>({
        healthScore: 100,
        dailyLoss: 0,
        maxDailyLoss: 10000,
        riskBudgetRemaining: 10000,
        currentVix: 14.25,
        exposureRatio: 0
    });
    const [alerts, setAlerts] = useState<RiskAlert[]>([]);
    const [history, setHistory] = useState<RiskAlert[]>([]);
    const [systemStatus, setSystemStatus] = useState<AlertLevel>('normal');

    // Persistence for Profile
    useEffect(() => {
        const savedProfile = localStorage.getItem('alphaquant_risk_profile');
        if (savedProfile && ['conservative', 'growth', 'aggressive'].includes(savedProfile)) {
            setRiskProfile(savedProfile as RiskProfileType);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('alphaquant_risk_profile', riskProfile);
    }, [riskProfile]);

    // Core Risk Engine Logic (Mocked Real-time updates)
    useEffect(() => {
        // Run risk calculation every 3 seconds
        const interval = setInterval(() => {
            calculateRiskMetrics();
        }, 3000);

        // Initial calc
        calculateRiskMetrics();

        return () => clearInterval(interval);
    }, [riskProfile, strategies]);

    const calculateRiskMetrics = () => {
        const profileParams = PROFILES[riskProfile];
        const maxBudget = TOTAL_CAPITAL * profileParams.maxDrawdownPct;

        // Mock current daily loss (fluctuating for demo)
        // In real app, this would sum up PnL from strategies
        const baseLoss = 1250; // Mock base
        const volatility = Math.random() * 500 - 250;
        const currentLoss = Math.max(0, baseLoss + volatility);

        const remaining = maxBudget - currentLoss;

        // Calculate Exposure from Strategies
        const activeCount = strategies.filter(s => s.status === 'active').length;
        const exposure = Math.min(100, activeCount * 15); // Assume ~15% per agent

        // Mock VIX fluctuation
        const mockVix = 14 + Math.random() * 2; // Normal range

        // Calculate Health Score (0-100)
        // Factors: Budget Usage, VIX, Exposure
        const budgetUsagePct = currentLoss / maxBudget;
        let score = 100;
        score -= (budgetUsagePct * 40); // Up to 40 pts lost for budget
        score -= (Math.max(0, mockVix - 15) * 2); // VIX penalty
        if (exposure > 80) score -= 10; // High exposure penalty

        setMetrics({
            healthScore: Math.round(Math.max(0, Math.min(100, score))),
            dailyLoss: currentLoss,
            maxDailyLoss: maxBudget,
            riskBudgetRemaining: remaining,
            currentVix: Number(mockVix.toFixed(2)),
            exposureRatio: exposure
        });

        // Evaluate Alerts & System Status
        evaluateSystemState(mockVix, budgetUsagePct, profileParams);
    };

    const evaluateSystemState = (vix: number, budgetUsage: number, params: { vixWarning: number }) => {
        let newStatus: AlertLevel = 'normal';
        const newAlerts: RiskAlert[] = [];
        const timestamp = Date.now();

        // Logic Hierarchy
        if (budgetUsage >= 1.0) {
            newStatus = 'halt';
            newAlerts.push(createAlert('halt', 'Global Circuit Breaker: Max Daily Loss Exceeded', timestamp));
        } else if (vix > 40) {
            newStatus = 'defense';
            newAlerts.push(createAlert('defense', 'High Volatility Defense Mode Active', timestamp));
        } else if (vix > params.vixWarning || budgetUsage > 0.8) {
            newStatus = 'warning';
            if (vix > params.vixWarning) newAlerts.push(createAlert('warning', `VIX Warning: Exceeds ${params.vixWarning}`, timestamp));
            if (budgetUsage > 0.8) newAlerts.push(createAlert('warning', 'Risk Budget Critical (>80%)', timestamp));
        }

        setSystemStatus(newStatus);

        // Only add if not already active (simple dedup)
        if (newAlerts.length > 0) {
            setAlerts(prev => {
                const activeMessages = new Set(prev.filter(a => a.active).map(a => a.message));
                const uniqueNew = newAlerts.filter(a => !activeMessages.has(a.message));

                if (uniqueNew.length === 0) return prev;

                // Add unique new alerts to history as well
                setHistory(prevHistory => [...uniqueNew, ...prevHistory].slice(0, 50)); // Keep last 50 in history

                return [...uniqueNew, ...prev].slice(0, 10); // Keep last 10 active
            });
        }
    };

    const createAlert = (level: AlertLevel, message: string, timestamp: number): RiskAlert => ({
        id: Math.random().toString(36).substr(2, 9),
        level,
        message,
        timestamp,
        active: true
    });

    const acknowledgeAlert = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: false } : a));
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <RiskContext.Provider value={{
            riskProfile,
            setRiskProfile,
            metrics,
            alerts,
            history,
            systemStatus,
            acknowledgeAlert,
            clearHistory
        }}>
            {children}
        </RiskContext.Provider>
    );
}

export function useRisk() {
    const context = useContext(RiskContext);
    if (context === undefined) {
        throw new Error("useRisk must be used within a RiskProvider");
    }
    return context;
}
