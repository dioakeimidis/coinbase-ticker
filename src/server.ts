import "dotenv/config";

import { CoinbaseTicker, StreamerServer } from "./services";
import { TickerModel } from "./@types";

// Instaniate our servers
const server = new StreamerServer();
const coinbaseStreamer = new CoinbaseTicker();

/**
 * Start CoinbaseStreamer and when ready
 * start WebSocketServer as well
 */
coinbaseStreamer.connect();
coinbaseStreamer.on("socket-connection", () => {
  if (!server.STATE) server.start();
});

// Pass the messages to the WebsocketServer
coinbaseStreamer.on("message", (message: TickerModel) => {
  if (server.STATE === 2) server.broadcastToAllClients(message);
});

/**
 * Disconnect from the Coinbase gracefully,
 * when a shutdown signal is raised.
 */
process.on("SIGINT", () => {
  server.quit();
  coinbaseStreamer.disconnect();
  process.exit(0);
});

process.on("SIGTERM", () => {
  server.quit();
  coinbaseStreamer.disconnect();
  process.exit(0);
});
