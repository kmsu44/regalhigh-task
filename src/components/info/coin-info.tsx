"use client";

import clsx from "clsx";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Suspense } from "react";
import { useKlineIntervalState } from "@/atoms/klines/kline-interval-atom";
import SymbolChart from "@/components/chart/symbol-chart";
import InfoHeader from "@/components/info/info-header";
import OrderBook from "@/components/order-book/order-book";
import Order from "@/components/order/order";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui";
import useConvertUsd from "@/hooks/use-convert-usd";
import { symbolsOptions, tickersOptions } from "@/lib/query-options";
import { formatNumberWithCommas } from "@/lib/utils";
import { Interval } from "@binance/connector-typescript";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [klineInterval, setKlineInterval] = useKlineIntervalState();

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
        <div className="flex flex-col w-full justify-between">
          <Tabs
            className="h-[42px]"
            value={klineInterval}
            onValueChange={(value) => {
              setKlineInterval(value as Interval);
            }}
          >
            <TabsList>
              <TabsTrigger value="1s">1s</TabsTrigger>
              <TabsTrigger value="15m">15m</TabsTrigger>
              <TabsTrigger value="1h">1H</TabsTrigger>
              <TabsTrigger value="4h">4H</TabsTrigger>
              <TabsTrigger value="1d">1D</TabsTrigger>
              <TabsTrigger value="1w">1W</TabsTrigger>
            </TabsList>
          </Tabs>
          <Suspense fallback={<Skeleton className="w-full h-[576px]" />}>
            <SymbolChart symbol={coin} />
          </Suspense>
          <Order symbol={coin} />
        </div>
      </div>
    </div>
  );
}
