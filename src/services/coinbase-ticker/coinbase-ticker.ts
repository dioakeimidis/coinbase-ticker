import { EventEmitter } from "node:stream";

import { ASSET_IDS } from "./constants";

import type { SubscribeAsset, UnsubscribeAsset, ProductIds, TickerModel } from "./types";

export class CoinbaseTicker extends EventEmitter {
  static assetIds = [...ASSET_IDS];

  #assets: Partial<Record<ProductIds, boolean>>;
  #ws: WebSocket | null;
  #reconnectTimeout: NodeJS.Timeout | null;

  constructor() {
    super();
    this.#ws = null;
    this.#reconnectTimeout = null;
    this.#assets = {};
  }

  connect() {
    console.info(`Connecting to => ${process.env.COINBASE_WS_URL}`);
    this.#ws = new WebSocket(process.env.COINBASE_WS_URL!);

    this.#ws.onopen = () => {
      console.info("Connected to Coinbase");
      this.emit("socket-connection");
      // Lets automatically subscribe to ALL assets when connection starts
      for (let asset of CoinbaseTicker.assetIds) {
        this.subscribeAsset(asset);
      }
    };

    this.#ws.onerror = (error: Event) => {
      console.error("WebSocket error occurred:", error);
      this.emit("socket-error", error);

      if (this.#ws?.readyState === WebSocket.OPEN || this.#ws?.readyState === WebSocket.CONNECTING) {
        this.#ws.close(1001, "Reconnecting");
      }

      if (this.#reconnectTimeout) clearTimeout(this.#reconnectTimeout);
      this.#reconnectTimeout = setTimeout(this.connect, 5000);
    };

    this.#ws.onclose = (event) => {
      this.emit("socket-close");
      console.warn(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);

      if (event.code !== 1000) {
        console.log("Attempting to reconnect in 5 seconds...");
        this.#reconnectTimeout = setTimeout(this.connect, 5000);
      }
    };

    this.#ws.onmessage = (event: MessageEvent) => {
      try {
        const message: TickerModel = JSON.parse(event.data.toString());

        if (message.type !== "ticker") return;

        this.emit("message", message);
      } catch (err) {
        console.error("Error parsing incoming message:", err);
      }
    };
  }

  disconnect() {
    console.info("Disconnecting from Coinbase");
    if (this.#reconnectTimeout) clearTimeout(this.#reconnectTimeout);

    if (!this.#ws || this.#ws.readyState !== WebSocket.OPEN) return;

    for (let asset of CoinbaseTicker.assetIds) {
      this.unsubscribeAsset(asset);
    }

    this.#ws.close(1000, "Process terminated");
  }

  subscribeAsset(assetId: ProductIds) {
    if (this.#assets[assetId]) return;

    const asset: SubscribeAsset = {
      type: "subscribe",
      channels: ["level2", "heartbeat", { name: "ticker", product_ids: [assetId] }],
    };

    this.#ws?.send(JSON.stringify(asset));
    this.#assets[assetId] = true;
    this.emit("subscribedTo", { id: assetId });
  }

  unsubscribeAsset(assetId: ProductIds) {
    if (!this.#assets[assetId]) return;

    const asset: UnsubscribeAsset = {
      type: "unsubscribe",
      channels: ["level2", "heartbeat", { name: "ticker", product_ids: [assetId] }],
    };

    this.#ws?.send(JSON.stringify(asset));
    this.#assets[assetId] = undefined;
    this.emit("unsubscribedFrom", { id: assetId });
  }

  listAllStreamingAssets() {
    return Object.keys(this.#assets);
  }
}
