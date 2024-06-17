"use client";

import InfoHeader from "@/components/info/info-header";
import OrderBook from "@/components/order-book/order-book";
import Order from "@/components/order/order";
import useConvertUsd from "@/hooks/use-convert-usd";
import { symbolsOptions, tickersOptions } from "@/lib/query-options";
import { formatNumberWithCommas } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function CoinInfo({ symbol }: { symbol: string }) {
  const { data: coin } = useSuspenseQuery({
    ...symbolsOptions,
    select: (data) => data.find((coin) => coin.symbol === symbol),
  });
  const { data: ticker } = useSuspenseQuery({
    ...tickersOptions,
    select(data) {
      return data.find((ticker) => ticker.symbol === symbol);
    },
  });
  const usdPrice = useConvertUsd({
    price: ticker?.lastPrice || "0",
    baseAsset: coin?.baseAsset || "",
  });
  if (!coin || !ticker) return null;
  return (
    <div className="flex flex-col w-full h-full">
      <InfoHeader coin={coin} ticker={ticker} />
      <div className="flex">
        <OrderBook symbol={coin}>
          <div className="flex w-full items-center">
            <p
              className={clsx("text-xl", {
                "text-green-500": ticker.isRise,
                "text-red-500": !ticker.isRise,
              })}
            >
              {formatNumberWithCommas(ticker.lastPrice)}
            </p>
            {ticker.isRise ? (
              <ArrowUp size={16} color="#22C55E" />
            ) : (
              <ArrowDown size={16} color="#f44444" />
            )}
            <p className="text-xs text-muted-foreground">
              ${formatNumberWithCommas(usdPrice)}
            </p>
          </div>
        </OrderBook>
        <div className="flex flex-col w-full bg-yellow-300 justify-between">
          <div className="h-[42px] bg-yellow-400">tab1</div>
          <div className="h-10 bg-yellow-500">tab2</div>
          <div className="h-[440px] bg-yellow-600">chart</div>
          <Order symbol={coin} />
        </div>
      </div>
    </div>
  );
}
