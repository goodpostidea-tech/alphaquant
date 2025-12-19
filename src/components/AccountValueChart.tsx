"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ModelIcon from "./ModelIcon";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const MODELS = [
    { id: "deepseek", name: "DeepSeek V3.1", color: "#8B5CF6", value: 133122.23 },
    { id: "qwen", name: "Qwen 2.5", color: "#3B82F6", value: 122474.46 },
    { id: "sp500", name: "S&P 500", color: "#94A3B8", value: 112000, dashed: true },
    { id: "grok", name: "Grok 1", color: "#F97316", value: 108821.31 },
    { id: "claude", name: "Claude 3.5 Sonnet", color: "#475569", value: 102267.65 },
    { id: "gemini", name: "Gemini 1.5 Pro", color: "#0284C7", value: 93813.48 },
    { id: "gpt5", name: "GPT 4o", color: "#10B981", value: 82773.19 },
];

// Generate more granular timestamps for a 24h view
const generateTimestamps = () => {
    const times = [];
    const now = new Date();
    for (let i = 24; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 60 * 60 * 1000);
        times.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    }
    return times;
};

/**
 * Generates realistic performance data using Geometric Brownian Motion with drift
 * to simulate actual market trends and volatility.
 */
const generateRealisticData = (start: number, end: number, steps: number, volatility: number = 0.02) => {
    const data = [start];
    // Calculate total drift needed to reach 'end' from 'start'
    const totalReturn = end / start - 1;
    const driftPerStep = totalReturn / steps;

    let currentPrice = start;

    for (let i = 1; i < steps; i++) {
        // Simple random walk with bias (drift)
        // Standard normal approx: (Math.random() + Math.random() + Math.random() - 1.5) * 2
        const shock = (Math.random() - 0.5) * 2 * volatility;
        currentPrice = currentPrice * (1 + driftPerStep + shock);
        data.push(currentPrice);
    }
    // Ensure the last point is exactly the current 'value'
    data.push(end);
    return data;
};

export default function AccountValueChart() {
    const labels = generateTimestamps();
    const steps = labels.length;

    const data = {
        labels: labels,
        datasets: MODELS.map((model) => ({
            label: model.name,
            data: generateRealisticData(100000, model.value, steps - 1, model.id === 'sp500' ? 0.005 : 0.015),
            borderColor: model.color,
            backgroundColor: "transparent",
            borderWidth: model.dashed ? 1.5 : 2.5,
            pointRadius: 0,
            tension: 0.1, // Sharper edges for "real" financial data
            borderDash: model.dashed ? [5, 5] : [],
        })),
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                titleColor: "#1e293b",
                bodyColor: "#1e293b",
                borderColor: "#e2e8f0",
                borderWidth: 1,
                padding: 12,
                boxPadding: 4,
                usePointStyle: true,
                callbacks: {
                    label: (context: any) => {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawOnChartArea: false
                },
                ticks: {
                    color: "#94a3b8",
                    font: { size: 9, family: 'IBM Plex Mono' },
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 8
                },
            },
            y: {
                position: 'right' as const,
                grid: {
                    color: "#f1f5f9",
                    drawTicks: false
                },
                border: {
                    display: false
                },
                ticks: {
                    color: "#94a3b8",
                    font: { size: 9, family: 'IBM Plex Mono' },
                    callback: (value: any) => "$" + (value / 1000).toFixed(0) + "k"
                },
            },
        },
    };

    return (
        <div className="relative h-full w-full bg-white px-2 py-4">
            <Line data={data} options={options} />

            {/* Performance Tags */}
            <div className="absolute left-6 top-6 flex flex-wrap gap-2 pointer-events-none">
                {MODELS.filter(m => !m.dashed).slice(0, 3).map(m => (
                    <div key={m.id} className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 px-2 py-1 rounded-md shadow-sm">
                        <ModelIcon modelId={m.id} size={14} style={{ color: m.color }} />
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{m.name}</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-600">
                            +{((m.value / 100000 - 1) * 100).toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-2 left-6 text-[9px] text-slate-300 font-black uppercase tracking-widest">
                Data Simulation: Geometric Brownian Motion (GBM)
            </div>
        </div>
    );
}
