import { SymbolPairs, Ticker } from "../../@types";

export type { TickerModel } from "../../@types";

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
