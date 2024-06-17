"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { init, dispose, KLineData } from "klinecharts";
import { Interval } from "@binance/connector-typescript";
import { klinesOptions } from "@/lib/query-options";
import { useKlineIntervalState } from "@/atoms/klines/kline-interval-atom";
import { getLotSizeBySymbol, getTickSizeBySymbol } from "@/lib/utils";
import { getQueryClient } from "@/lib/get-query-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET || "";

export default function SymbolChart({ symbol }: { symbol: ExchangeInfo }) {
  const [klineInterval] = useKlineIntervalState();
  const { data } = useSuspenseQuery(
    klinesOptions({ symbol: symbol.symbol, interval: Interval[klineInterval] })
  );
  const queryClient = getQueryClient();
  const { tickSizeLength } = getTickSizeBySymbol({
    symbol: symbol,
  });
  const { lotSizeLength } = getLotSizeBySymbol({
    symbol: symbol,
  });
  useEffect(() => {
    if (!data) return;
    const chart = init("chart");
    const websocket = new WebSocket(
      `${SOCKET_URL}/ws/${symbol.symbol.toLowerCase()}@kline_${
        Interval[klineInterval]
      }`
    );
    websocket.onopen = () => {
      console.log("connected");
    };
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newData = {
        timestamp: data.k.t,
        open: data.k.o,
        high: data.k.h,
        low: data.k.l,
        close: data.k.c,
        volume: data.k.v,
        closeTime: data.k.c,
        quoteVolume: data.k.q,
        numberOfTrades: data.k.n,
        takerBuyBaseAssetVolume: data.k.V,
        takerBuyQuoteAssetVolume: data.k.Q,
      };
      chart?.updateData(newData);
      queryClient.setQueryData(
        ["klines", symbol.symbol, klineInterval],
        (oldData: KLineData[]) => {
          if (oldData[oldData.length - 1].timestamp === newData.timestamp) {
            oldData[oldData.length - 1] = newData;
            return oldData;
          }
          const newKlines = [...oldData, newData];
          return newKlines;
        }
      );
    };
    chart?.setPriceVolumePrecision(tickSizeLength, lotSizeLength);
    chart?.applyNewData(data, true);
    return () => {
      dispose("chart");
      websocket.close();
    };
  }, [klineInterval, symbol]);

  return <div id="chart" className="w-full h-[576px]" />;
}
