import { SymbolPairs } from "../../@types";

type Ticker = "ticker";

export type ProductIds = SymbolPairs;

export type Channels = ("level2" | "heartbeat" | { name: Ticker; product_ids: SymbolPairs[] })[];

export type SubscribeAsset = {
  type: "subscribe";
  channels: Channels;
};

export type UnsubscribeAsset = {
  type: "unsubscribe";
  channels: Channels;
};

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
