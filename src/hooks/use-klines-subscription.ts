import { getQueryClient } from "@/lib/get-query-client";
import { Interval } from "@binance/connector-typescript";
import { KLineData } from "klinecharts";
import { useEffect } from "react";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET || "";
export default function useKlinesSubscription({
  symbol,
  interval,
}: {
  symbol: string;
  interval: Interval;
}) {
  const queryClient = getQueryClient();

  useEffect(() => {
    const websocket = new WebSocket(
      `${SOCKET_URL}/ws/${symbol}@kline_${interval}`
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
      queryClient.setQueryData(
        [
          "klines",
          symbol.toUpperCase(),
          Interval[interval as keyof typeof Interval],
        ],
        (oldData: KLineData[]) => {
          const newKlines = [...oldData, newData];
          return newKlines;
        }
      );
    };
    return () => {
      websocket.close();
    };
  }, [queryClient, interval, symbol]);
}
