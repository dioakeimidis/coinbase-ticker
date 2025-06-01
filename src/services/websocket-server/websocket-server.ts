import { WebSocketServer, Server } from "ws";
import { v4 as uuid } from "uuid";

// import { ASSET_IDS } from "../coinbase-ticker";

import type { SymbolPairs, TickerModel } from "../../@types";
import type { MetaData } from "./types";
import { getMatchedView } from "../coinbase-ticker";

export class StreamerServer {
  #wss: Server | null = null;
  #clients: Map<string, MetaData> = new Map();
  STATE: number = 0; // O => Off, 1 => Connecting, 2 => Connected

  #watermark() {
    console.info(`
        ################################################
        🛡️  Server listening on port: ${process.env.SERVER_PORT} 🛡️
        🌐  ws://localhost:${process.env.SERVER_PORT}/ws 🌐
        🟢  StreamerServer is ready for incoming connections 🟢
        ################################################
      `);
  }

  #messageHandler(id: string, message: Buffer) {
    const msg = message.toString();
    console.info(`[${id}] ${msg}`);

    const client = this.#clients.get(id);
    if (!client) return;

    // Clost the connection
    if (msg === "quit") {
      client.socket.close();
      this.#clients.delete(id);
      console.info(`Connection Closed for ${id}`);
      return;
    }

    if (msg.includes("system")) {
      const [command, ms] = msg.split(/\s+/);
      client.command = command as string;
      client.delay = ms ? Number(ms) : 250;
      return;
    }

    if (/^(BTC-USD|ETH-USD|LTC-USD)(\s+[u|m])?$/g.test(msg)) {
      const [symbol] = msg.split(/\s+/);
      client.symbols.add(symbol as SymbolPairs);
      client.command = msg;
    }
  }

  start() {
    this.#wss = new WebSocketServer({ port: Number(process.env.SERVER_PORT)! });

    this.STATE = 1;

    this.#wss.on("listening", () => this.#watermark());

    this.#wss.on("close", () => (this.STATE = 0));

    this.#wss.on("connection", (socket) => {
      this.STATE = 2;

      const id = uuid();

      this.#clients.set(id, { socket, id, command: "", symbols: new Set(), delay: 250 });
      console.info(`Incoming Connection => ${id}`);

      socket.on("message", (message: Buffer) => this.#messageHandler(id, message));
    });
  }

  quit() {
    this.#wss?.close();
  }

  broadcastToAllClients(data: TickerModel) {
    for (const client of this.#clients.values()) {
      const { command, delay, symbols, socket } = client;
      console.debug({ command, delay, symbols });

      if (command === "system") {
        client.command = "";
        socket.send(`You have subscribed to the following products: ${JSON.stringify(Array.from(symbols))}`);
        return;
      }

      if (/^(BTC-USD|ETH-USD|LTC-USD)\s+[u]{1}$/g.test(command)) {
        const [sbl] = command.split(/\s+/);
        symbols.delete(sbl as SymbolPairs);
        client.command = "";
      }

      const shouldSwitchView = /^(BTC-USD|ETH-USD|LTC-USD)\s+[m]{1}$/g.test(command);
      if (symbols.has(data.product_id) && socket.readyState === WebSocket.OPEN) {
        setTimeout(() => socket.send(JSON.stringify(shouldSwitchView ? getMatchedView(data) : data)), client.delay);
      }
    }
  }
}
