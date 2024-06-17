import { Interval, Spot } from "@binance/connector-typescript";
import { KLineData } from "klinecharts";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const client = new Spot("", "", { baseURL: BASE_URL });

export async function getTickers() {
  const data = (await client.ticker24hr()) as Ticker[];
  return data;
}

export async function getSymbols() {
  const data = (await client.exchangeInformation()).symbols;
  const symbols = data.filter((item) => item.status === "TRADING");
  return symbols;
}

export async function getOrderBook(symbol: string): Promise<OrderBookData> {
  const data = await fetch(
    `${BASE_URL}/api/v3/depth?symbol=${symbol}&limit=1000`,
    {
      method: "GET",
    }
  );
  if (!data.ok) {
    throw new Error("Failed to fetch order book");
  }
  return data.json();
}
export async function getKlines(symbol: string, interval: Interval) {
  const res = await fetch(
    `${BASE_URL}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`,
    {
      method: "GET",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch klines");
  }
  const data = await res.json();
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
