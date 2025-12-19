"use client";

import React from "react";

interface ModelIconProps {
    modelId: string;
    className?: string;
    size?: number;
    style?: React.CSSProperties;
}

export default function ModelIcon({ modelId, className = "", size = 16, style }: ModelIconProps) {
    const model = modelId.toLowerCase();

    // Helper to get brand colors if needed, but usually passed via props or CSS
    const getIcon = () => {
        switch (model) {
            case "deepseek":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                );
            case "qwen":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a10 10 0 0 1 10 10" />
                        <path d="M12 12l5 5" />
                    </svg>
                );
            case "gpt":
            case "gpt5":
            case "gpt4":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M2 12h20M5.07 5.07l13.86 13.86M18.93 5.07L5.07 18.93" />
                        <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" />
                    </svg>
                );
            case "claude":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" />
                        <rect x="8" y="8" width="8" height="8" rx="1" fill="currentColor" fillOpacity="0.1" />
                    </svg>
                );
            case "gemini":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 3c.167 4.5 3.5 8.5 8.5 8.5-5 0-8.333 4-8.5 8.5-.167-4.5-3.5-8.5-8.5-8.5 5 0 8.333-4 8.5-8.5Z" fill="currentColor" fillOpacity="0.2" />
                    </svg>
                );
            case "grok":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="m4 4 16 16M4 20 20 4" />
                    </svg>
                );
            case "sp500":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                    </svg>
                );
            default:
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M2 12h20" />
                    </svg>
                );
        }
    };

    return (
        <div className={`flex-shrink-0 flex items-center justify-center ${className}`} style={{ width: size, height: size, ...style }}>
            {getIcon()}
        </div>
    );
}
