import { Spot } from "@binance/connector-typescript";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const client = new Spot("", "", { baseURL: BASE_URL });

export async function getTickers(symbol?: string) {
  const options = {
    symbol: symbol,
  };
  return client.ticker24hr(options);
}

export async function getSymbols() {
  const data = (await client.exchangeInformation()).symbols;
  const symbols = data.filter((item) => item.status === "TRADING");
  return symbols;
}
