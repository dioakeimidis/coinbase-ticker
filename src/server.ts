import "dotenv/config";

import { CoinbaseTicket } from "./services";

const coinbaseStreamer = new CoinbaseTicket();

coinbaseStreamer.on("message", (message) => {
  console.debug(message);
});

coinbaseStreamer.connect();

/**
 * Shutdown the server gracefully
 *
 */

process.on("SIGINT", () => {
  coinbaseStreamer.disconnect();
  process.exit(0);
});
process.on("SIGTERM", () => {
  coinbaseStreamer.disconnect();
  process.exit(0);
});
