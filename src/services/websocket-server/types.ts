import type { SymbolPairs, UserCommands } from "../../@types";
import type { WebSocket } from "ws";

export type MetaData = {
  id: string;
  socket: WebSocket;
  command: UserCommands;
  symbol: SymbolPairs | null;
};
