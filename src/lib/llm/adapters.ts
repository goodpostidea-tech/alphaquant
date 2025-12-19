import { LLMResponse, TradingDecision } from './types';

export abstract class LLMAdapter {
    abstract name: string;
    abstract provider: string;

    /**
     * Calls the LLM with the generated prompt
     * @param prompt The full system + user prompt
     */
    abstract callModel(prompt: string): Promise<LLMResponse>;

    /**
     * Helper to parse JSON from AI response
     */
    protected parseJsonResponse(text: string): TradingDecision {
        try {
            // 1. Direct JSON parse
            return JSON.parse(text);
        } catch {
            // 2. Extract from markdown code block
            const match = text.match(/```json\n([\s\S]*?)\n```/);
            if (match) return JSON.parse(match[1]);

            // 3. Find first { and last }
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                return JSON.parse(text.substring(firstBrace, lastBrace + 1));
            }

            throw new Error(`Failed to parse AI response as JSON: ${text.substring(0, 100)}...`);
        }
    }
}

/**
 * Specialized Mock Adapters for the "Council of Agents"
 */

export class DeepSeekAdapter extends LLMAdapter {
    name = "DeepSeek V3.1";
    provider = "DeepSeek";
    async callModel(prompt: string): Promise<LLMResponse> {
        await new Promise(r => setTimeout(r, 800));
        const decision: TradingDecision = {
            action: 'HOLD',
            confidence: 0.92,
            reasoning: "[Equity Scan] NVDA RSI at 68. MACD histogram flattening on 4H. Sector rotation into defensive stocks suggested.",
        };
        return { raw: JSON.stringify(decision), decision, summary: "DeepSeek recommends holding tech positions due to momentum flattening." };
    }
}

export class GPT5Adapter extends LLMAdapter {
    name = "GPT-5";
    provider = "OpenAI";
    async callModel(prompt: string): Promise<LLMResponse> {
        await new Promise(r => setTimeout(r, 1200));
        const decision: TradingDecision = {
            action: 'BUY',
            confidence: 0.75,
            reasoning: "Aggressive breakout spotted on AAPL 15m chart. Moving average convergence supports a long entry before market close.",
        };
        return { raw: JSON.stringify(decision), decision, summary: "GPT-5 is scalping the AAPL breakout." };
    }
}

export class ClaudeAdapter extends LLMAdapter {
    name = "Claude 4.5";
    provider = "Anthropic";
    async callModel(prompt: string): Promise<LLMResponse> {
        await new Promise(r => setTimeout(r, 1500));
        const decision: TradingDecision = {
            action: 'CLOSE_POSITION',
            confidence: 0.88,
            reasoning: "VIX spike detected (+4.2%). Portfolio exposure to TSLA beta is too high for current vol environment. Strategic trim suggested.",
        };
        return { raw: JSON.stringify(decision), decision, summary: "Claude suggests risk reduction in high-beta stocks." };
    }
}

/**
 * Mock Adapter for testing without API keys
 */
export class MockAdapter extends LLMAdapter {
    name = "Mock Trader";
    provider = "System";

    async callModel(prompt: string): Promise<LLMResponse> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const decision: TradingDecision = {
            action: 'HOLD',
            confidence: 100,
            reasoning: "System mock execution. Holding current state for testing.",
        };

        return {
            raw: JSON.stringify(decision),
            decision,
            summary: "Mock adapter is holding position."
        };
    }
}
