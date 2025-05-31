import { TickerModel } from "./types";

export function getMatchedView({ time, product_id, trade_id, price }: TickerModel) {
  return { time, product_id, trade_id, price };
}
