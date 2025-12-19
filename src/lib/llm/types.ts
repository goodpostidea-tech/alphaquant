export type TradingAction = 'BUY' | 'SELL' | 'HOLD' | 'CLOSE_POSITION';
export type MarketSide = 'LONG' | 'SHORT';

export interface ExitPlan {
    target_price?: number;
    stop_loss?: number;
    conditions?: string;
}

export interface TradingDecision {
    action: TradingAction;
    coin?: string;
    direction?: MarketSide;
    size_usd?: number;
    leverage?: number;
    confidence: number;
    reasoning: string;
    exit_plan?: ExitPlan;
}

export interface LLMResponse {
    raw: string;
    decision: TradingDecision;
    summary: string;
}
