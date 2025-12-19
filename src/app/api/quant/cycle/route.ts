import { NextResponse } from 'next/server';
import { TradingOrchestrator } from '@/lib/llm/orchestrator';
import { DeepSeekAdapter, GPT5Adapter, ClaudeAdapter } from '@/lib/llm/adapters';

export async function GET() {
    // 1. Initialize Adapters
    const adapters = [
        new DeepSeekAdapter(),
        new GPT5Adapter(),
        new ClaudeAdapter(),
    ];

    // 2. Initialize Orchestrator
    const orchestrator = new TradingOrchestrator(adapters);

    // 3. Mock Stock Market Data
    const mockMarketData = {
        nvda_price: 132.45,
        aapl_price: 224.12,
        vix_index: 14.2,
        sp500_trend: "BULLISH",
        time: new Date().toISOString(),
    };

    // 4. Run Cycle
    try {
        const results = await orchestrator.runDecisionCycle(mockMarketData);

        // Convert Map to Object for JSON response
        const output = Object.fromEntries(results);

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            market_data: mockMarketData,
            decisions: output,
        });
    } catch (error) {
        console.error("Quant Cycle Failed:", error);
        return NextResponse.json({ error: "Cycle failed" }, { status: 500 });
    }
}
