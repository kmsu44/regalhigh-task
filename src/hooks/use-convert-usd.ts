import { symbolsOptions, tickersOptions } from "@/lib/query-options";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function useConvertUsd({
  price,
  baseAsset,
}: {
  price: string;
  baseAsset: string;
}) {
  const { data: symbol } = useSuspenseQuery({
    ...symbolsOptions,
    select(data) {
      return data.find((coin) => {
        if (coin.baseAsset === baseAsset && coin.quoteAsset === "USDT") {
          return coin;
        }
      });
    },
  });
  const { data: ticker } = useSuspenseQuery({
    ...tickersOptions,
    select(data) {
      return data.find((ticker) => ticker.symbol === symbol?.symbol);
    },
  });
  const usdPrice = parseFloat(ticker?.lastPrice || "0");
  if (!ticker) return usdPrice * parseFloat(price);
  return usdPrice;
}
