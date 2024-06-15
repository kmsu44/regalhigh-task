import { Spot } from "@binance/connector-typescript";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const client = new Spot("", "", { baseURL: BASE_URL });

export async function getTickers(): Promise<Ticker[]> {
  return client.ticker24hr() as Promise<Ticker[]>;
}

export async function getSymbols() {
  const data = (await client.exchangeInformation()).symbols;
  return data;
}
