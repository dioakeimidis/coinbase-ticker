import type { SymbolPairs } from "../../@types";
import type { WebSocket } from "ws";

export type MetaData = {
  id: string;
  socket: WebSocket;
  command: string;
  symbols: Set<SymbolPairs>;
  delay: number;
};
