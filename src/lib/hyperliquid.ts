export interface MarketPrice {
    coin: string;
    price: number;
}

export class HyperliquidClient {
    private baseUrl = "https://api.hyperliquid.xyz";

    async getPrices(coins: string[]): Promise<MarketPrice[]> {
        // In a real implementation, this would call the exchange info/meta API
        // and extract prices. For now, we mock.
        return coins.map(coin => ({
            coin,
            price: Math.random() * 100000 // Mock price
        }));
    }

    async executeTrade(params: {
        coin: string;
        side: "LONG" | "SHORT";
        size: number;
        leverage: number;
    }) {
        console.log(`Executing Hyperliquid trade: ${params.side} ${params.size} ${params.coin} @ ${params.leverage}x`);
        // Mock success response
        return {
            status: "success",
            orderId: Math.random().toString(36).substring(7),
            filledPrice: 100000,
            fees: 1.5,
        };
    }
}

export const hyperliquid = new HyperliquidClient();
