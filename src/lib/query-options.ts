import { getSymbols, getTickers } from "@/api/market-api";
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
