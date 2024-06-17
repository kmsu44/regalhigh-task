import { Interval, Spot } from "@binance/connector-typescript";

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

export async function getOrderBook(symbol: string) {
  const data = await fetch(
    `${BASE_URL}/api/v3/depth?symbol=${symbol}&limit=1000`,
    {
      method: "GET",
    }
  );
  return data.json();
}
export async function getKlines(symbol: string, interval: Interval) {
  const data = await client.uiklines(symbol, interval, {
    limit: 1000,
    timeZone: "9",
  });
  const formattedData = data.map((item) => ({
    x: new Date(item[0]),
    y: [item[1], item[2], item[3], item[4], item[8]],
  }));

  return formattedData;
}
