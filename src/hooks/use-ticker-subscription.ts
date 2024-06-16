import { getQueryClient } from "@/lib/get-query-client";
import { symbolsOptions, tickersOptions } from "@/lib/query-options";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET || "";
export default function useTickerSubscription() {
  const queryClient = getQueryClient();

  useEffect(() => {
    const websocket = new WebSocket(
      `${SOCKET_URL}/stream?streams=!ticker@arr@3000ms`
    );
    websocket.onopen = () => {
      console.log("connected");
    };
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data).data;
      const newData = data.map((ticker: TickerPayload) => ({
        symbol: ticker.s,
        priceChange: ticker.p,
        priceChangePercent: ticker.P,
        prevClosePrice: ticker.x,
        lastPrice: ticker.c,
        bidPrice: ticker.b,
        bidQty: ticker.B,
        askPrice: ticker.a,
        askQty: ticker.A,
        openPrice: ticker.o,
        highPrice: ticker.h,
        lowPrice: ticker.l,
        volume: ticker.v,
        quoteVolume: ticker.q,
        openTime: ticker.O,
        closeTime: ticker.C,
        firstId: ticker.F,
        lastId: ticker.L,
        count: ticker.n,
        eventTime: ticker.E,
      }));
      queryClient.setQueryData(["tickers"], (oldData: Ticker[]) => {
        const tickersMap = new Map(
          oldData.map((ticker) => [ticker.symbol, ticker])
        );
        newData.forEach((ticker: Ticker) => {
          const lastPrice = tickersMap.get(ticker.symbol)?.lastPrice;
          let isRise = lastPrice
            ? parseFloat(lastPrice) < parseFloat(ticker.lastPrice)
            : null;
          tickersMap.set(ticker.symbol, {
            ...ticker,
            isRise,
          });
        });
        return Array.from(tickersMap.values());
      });
    };
    return () => {
      websocket.close();
    };
  }, [queryClient]);
}
