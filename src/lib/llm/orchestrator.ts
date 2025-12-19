import { LLMAdapter } from './adapters';
import { LLMResponse } from './types';

export class TradingOrchestrator {
    private adapters: Map<string, LLMAdapter> = new Map();

    constructor(adapters: LLMAdapter[]) {
        adapters.forEach(a => this.adapters.set(a.name, a));
    }

    async runDecisionCycle(marketData: any): Promise<Map<string, LLMResponse>> {
        const results = new Map<string, LLMResponse>();

        // In a real scenario, this would gather account states, etc.
        const prompt = this.generatePrompt(marketData);

        const calls = Array.from(this.adapters.values()).map(async (adapter) => {
            try {
                const response = await adapter.callModel(prompt);
                results.set(adapter.name, response);
            } catch (error) {
                console.error(`Error in model ${adapter.name}:`, error);
            }
        });

        await Promise.allSettled(calls);
        return results;
    }

    private generatePrompt(marketData: any): string {
        // Basic prompt template as described in 11-MCP服务功能与提示词分析.md
        return `
# MARKET DATA
${JSON.stringify(marketData, null, 2)}

# YOUR TASK
Analyze the data and decide whether to BUY, SELL, or HOLD.
Response in JSON format.
    `;
    }
}
