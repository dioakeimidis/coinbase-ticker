import { WebSocketServer, Server } from "ws";
import { v4 as uuid } from "uuid";

import type { TickerModel } from "../../@types";
import type { MetaData } from "./types";

export class StreamerServer {
  #wss: Server | null = null;
  #clients: Map<string, MetaData> = new Map();
  STATUS: number = 0; // O => Off, 1 => Connecting, 2 => Connected

  #messageHandler(id: string, message: string) {
    console.info(`[${id}] ${message}`);
    console.info(">>>>>>>>>>>>>>>\n");
  }

  start() {
    this.#wss = new WebSocketServer({ port: Number(process.env.SERVER_PORT)! });

    this.STATUS = 1;

    this.#wss.on("listening", () => {
      console.info(`
        ################################################
        🛡️  Server listening on port: ${process.env.SERVER_PORT} 🛡️
        🌐  ws://localhost:${process.env.SERVER_PORT}/ws 🌐
        🟢  StreamerServer is ready for incoming connections 🟢
        ################################################
      `);
    });

    this.#wss.on("connection", (socket) => {
      this.STATUS = 2;
      const id = uuid();
      this.#clients.set(id, { socket, id, command: "price view", symbol: null });
      console.debug("[Incoming Connection]", { id, command: "price view", symbol: null });

      socket.on("message", (message: string) => this.#messageHandler(id, message));

      socket.on("close", () => this.#clients.delete(id));
    });

    this.#wss.on("close", () => {
      this.STATUS = 0;
    });
  }

  quit() {
    this.#wss?.close();
  }

  broadcastToAllClients(data: TickerModel) {
    for (const { socket } of this.#clients.values()) {
      if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(data));
    }
  }
}
