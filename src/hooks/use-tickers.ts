import { getQueryClient } from "@/lib/get-query-client";
import { tickersOptions } from "@/lib/query-options";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET || "";
export default function useTickerSubscription() {
  const queryClient = getQueryClient();
  const { data, isLoading, isError } = useQuery(tickersOptions);
  useEffect(() => {
    const websocket = new WebSocket(`${SOCKET_URL}/stream?streams=!ticker@arr`);
    websocket.onopen = () => {
      console.log("connected");
    };
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data).data;
      const newData = data.map((item: TickerPayload) => {
        return {
          symbol: item.s,
          priceChange: item.p,
          priceChangePercent: item.P,
          weightedAvgPrice: item.w,
          prevClosePrice: item.x,
          lastPrice: item.c,
          lastQty: item.Q,
          bidPrice: item.b,
          bidQty: item.B,
          askPrice: item.a,
          askQty: item.A,
          openPrice: item.o,
          highPrice: item.h,
          lowPrice: item.l,
          volume: item.v,
          quoteVolume: item.q,
          openTime: item.O,
          closeTime: item.C,
          firstId: item.F,
          lastId: item.L,
          count: item.n,
          eventTime: item.E,
        };
      });
      newData.map((ticker: Ticker) => {
        queryClient.setQueryData(["tickers"], (oldData: Ticker[]) => {
          const newData = [...oldData];
          const index = newData.findIndex(
            (item) => item.symbol === ticker.symbol
          );
          if (index !== -1) {
            newData[index] = ticker;
          }
          return newData;
        });
      });
    };
    return () => {
      websocket.close();
    };
  }, [queryClient]);
  return { data, isLoading, isError };
}
