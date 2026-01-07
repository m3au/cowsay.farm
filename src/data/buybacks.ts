export interface Buyback {
	date: string;
	amount: string;
	source: "shop" | "nft" | "other";
	txHash?: string;
	usdValue?: number;
}

// Buyback history data
// This will be populated by the buyback automation scripts
// or manually updated until automation is fully set up
const buybacks: Buyback[] = [];

export function getBuybacks(): Buyback[] {
	// Return buybacks in reverse chronological order (newest first)
	return [...buybacks].reverse();
}

export function addBuyback(buyback: Buyback): void {
	buybacks.push(buyback);
}



