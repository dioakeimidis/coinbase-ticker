import "dotenv/config";

import { CoinbaseTicket, StreamerServer } from "./services";
import { TickerModel } from "./services/coinbase-ticker/types";

// Create Server-Client Websocket Instance
const server = new StreamerServer();

// Create Server-Coinbase Websocket Instance

const coinbaseStreamer = new CoinbaseTicket();

// Connect to Coinbase to start receiving Bids
coinbaseStreamer.connect();

/**
 * Start the WebsocketServer when Coibase Connection is established
 * and only if Server is not live
 */
coinbaseStreamer.on("socket-connection", () => {
  if (!server.STATUS) server.start();
});

coinbaseStreamer.on("message", (message: TickerModel) => {
  console.debug(message);
  if (server.STATUS === 2) server.broadcastToAllClients(message);
});

/**
 * Disconnect from the Coinbase gracefully,
 * when a shutdown signal is raised.
 *
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
