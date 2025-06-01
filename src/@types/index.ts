export type SymbolPairs = "BTC-USD" | "ETH-USD" | "LTC-USD";

export type UserCommands = "quit" | "price view" | "m" | "u" | "system";

export type Ticker = "ticker";

export type TickerModel = {
  type: Ticker;
  sequence: number;
  product_id: SymbolPairs;
  price: string;
  open_24h: string;
  volume_24h: string;
  low_24h: string;
  high_24h: number;
  volume_30d: string;
  best_bid: string;
  best_bid_size: string;
  best_ask: string;
  best_ask_size: string;
  side: "buy" | "sell";
  time: string;
  trade_id: number;
  last_size: string;
};
