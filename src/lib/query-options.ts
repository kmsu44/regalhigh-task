import { getKlines, getSymbols, getTickers } from "@/api/market-api";
import { Interval } from "@binance/connector-typescript";
import { queryOptions } from "@tanstack/react-query";

export const tickersOptions = queryOptions({
  queryKey: ["tickers"],
  queryFn: () => getTickers(),
  staleTime: Infinity,
});

export const symbolsOptions = queryOptions({
  queryKey: ["symbols"],
  queryFn: () => getSymbols(),
  staleTime: Infinity,
});
export const klinesOptions = ({
  symbol,
  interval,
}: {
  symbol: string;
  interval: Interval;
}) => {
  return queryOptions({
    queryKey: ["klines", symbol, Interval[interval as keyof typeof Interval]],
    queryFn: () =>
      getKlines(symbol, Interval[interval as keyof typeof Interval]),
    staleTime: Infinity,
  });
};
