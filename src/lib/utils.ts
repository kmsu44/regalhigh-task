import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function convertMillion(value: number) {
  return value > 10_000_000
    ? (value / 10_000_000).toFixed(2) + "M"
    : value.toFixed(2);
}

export function getTableData({
  symbols,
  tickers,
  sortValue,
  searchTerm,
}: {
  symbols: ExchangeInfo[];
  tickers: Ticker[];
  sortValue: SortValue;
  searchTerm: string;
}): MarketTable[] {
  const data = symbols.map((symbol) => {
    const ticker = tickers.find((item) => item.symbol === symbol.symbol);
    const price = parseFloat(ticker?.lastPrice || "0");
    const tickerVolume = parseFloat(ticker?.volume || "0");
    const volume = tickerVolume * price;
    return {
      symbol: symbol.symbol,
      pair: String(symbol.baseAsset + "/" + symbol.quoteAsset),
      price: price,
      priceChange: parseFloat(ticker?.priceChangePercent || "0"),
      volume: volume || 0,
      isRise: ticker?.isRise,
    };
  });
  if (searchTerm) {
    return data.sort((a, b) => {
      const aStartsWith = a.symbol
        .toLowerCase()
        .startsWith(searchTerm.toLowerCase());
      const bStartsWith = b.symbol
        .toLowerCase()
        .startsWith(searchTerm.toLowerCase());

      if (aStartsWith && !bStartsWith) {
        return -1;
      } else if (!aStartsWith && bStartsWith) {
        return 1;
      } else {
        return a.symbol.localeCompare(b.symbol);
      }
    });
  }
  if (sortValue.sortValue === "pair") {
    return data.sort((a, b) =>
      sortValue.sortDirection === "asc"
        ? a.pair.localeCompare(b.pair)
        : b.pair.localeCompare(a.pair)
    );
  }
  if (sortValue.sortValue === "price") {
    return data.sort((a, b) =>
      sortValue.sortDirection === "asc" ? a.price - b.price : b.price - a.price
    );
  }
  if (sortValue.sortValue === "change") {
    return data.sort((a, b) =>
      sortValue.sortDirection === "asc"
        ? a.priceChange - b.priceChange
        : b.priceChange - a.priceChange
    );
  }
  if (sortValue.sortValue === "volume") {
    return data.sort((a, b) =>
      sortValue.sortDirection === "asc"
        ? a.volume - b.volume
        : b.volume - a.volume
    );
  }
  return data;
}
export function formatNumberWithCommas(value: number) {
  if (value < 1) return value;
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
