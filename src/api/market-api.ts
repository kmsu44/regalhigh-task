import { Interval, Spot } from "@binance/connector-typescript";
import { KLineData } from "klinecharts";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const client = new Spot("", "", { baseURL: BASE_URL });

export async function getTickers(): Promise<Ticker[]> {
  const res = await fetch(`${BASE_URL}/api/v3/ticker/24hr`, {
    method: "GET",
    cache: "no-cache",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch tickers");
  }
  return res.json();
}

export async function getSymbols(): Promise<ExchangeInfo[]> {
  const res = await fetch(`${BASE_URL}/api/v3/exchangeInfo`, {
    method: "GET",
    cache: "no-cache",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch symbols");
  }
  const data = await res.json();
  //@ts-ignore
  const symbols = data.symbols.filter((item) => item.status === "TRADING");
  return symbols;
}

export async function getOrderBook(symbol: string): Promise<OrderBookData> {
  const data = await fetch(
    `${BASE_URL}/api/v3/depth?symbol=${symbol}&limit=1000`,
    {
      method: "GET",
      cache: "no-cache",
    }
  );
  if (!data.ok) {
    throw new Error("Failed to fetch order book");
  }
  return data.json();
}
export async function getKlines(
  symbol: string,
  interval: Interval,
  startTime?: number,
  endTime?: number
) {
  const url = `${BASE_URL}/api/v3/klines`;
  const params = new URLSearchParams({
    symbol,
    interval,
    limit: "1000",
  });
  if (startTime) {
    params.set("startTime", startTime.toString());
  }
  if (endTime) {
    params.set("endTime", endTime.toString());
  }
  const res = await fetch(`${url}?${params.toString()}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch klines");
  }
  const data = (await res.json()) as KLineData[];
  const klines = data.map((item) => ({
    timestamp: item[0],
    open: item[1],
    high: item[2],
    low: item[3],
    close: item[4],
    volume: item[5],
    closeTime: item[6],
    quoteVolume: item[7],
    numberOfTrades: item[8],
    takerBuyBaseAssetVolume: item[9],
    takerBuyQuoteAssetVolume: item[10],
  }));
  return klines;
}
