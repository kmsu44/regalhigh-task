import { getOrderBook } from "@/api/market-api";
import { useEffect, useState } from "react";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET || "";

type EventBuffer = {
  asks: Map<string, [string, string]>;
  bids: Map<string, [string, string]>;
};

export default function useOrderBookSubscription({
  symbol,
}: {
  symbol: string;
}): EventBuffer {
  const [eventBuffer, setEventBuffer] = useState<EventBuffer>({
    asks: new Map(),
    bids: new Map(),
  });
  useEffect(() => {
    const getOrderBookData = async () => {
      const newOrderBook = await getOrderBook(symbol);
      const newEventBuffer = { ...eventBuffer };

      newOrderBook.asks.forEach((ask: string[]) => {
        if (ask[1] === "0.00000000") {
          newEventBuffer.asks.delete(ask[0]);
        }
        newEventBuffer.asks.set(ask[0], [ask[0], ask[1]]);
      });
      newOrderBook.bids.forEach((bid: string[]) => {
        if (bid[1] === "0.00000000") {
          newEventBuffer.bids.delete(bid[0]);
        }
        newEventBuffer.bids.set(bid[0], [bid[0], bid[1]]);
      });
      setEventBuffer(newEventBuffer);
    };
    const websocket = new WebSocket(
      `${SOCKET_URL}/ws/${symbol.toLowerCase()}@depth`
    );
    websocket.onopen = () => {
      console.log("connected");
    };
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const dataFormat = {
        firstUpdateId: data.U,
        lastUpdateId: data.u,
        asks: data.a,
        bids: data.b,
      } as {
        firstUpdateId: number;
        lastUpdateId: number;
        asks: [string, string][];
        bids: [string, string][];
      };
      const newEventBuffer = { ...eventBuffer };
      dataFormat.asks.forEach((ask) => {
        if (ask[1] === "0.00000000") {
          newEventBuffer.asks.delete(ask[0]);
        } else {
          newEventBuffer.asks.set(ask[0], [ask[0], ask[1]]);
        }
      });
      dataFormat.bids.forEach((bid) => {
        if (bid[1] === "0.00000000") {
          newEventBuffer.bids.delete(bid[0]);
        } else {
          newEventBuffer.bids.set(bid[0], [bid[0], bid[1]]);
        }
      });
      setEventBuffer(newEventBuffer);
    };
    getOrderBookData();
    return () => {
      websocket.close();
    };
  }, [symbol]);
  return eventBuffer;
}
