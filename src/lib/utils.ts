import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function convertMillion(value: number) {
  return value > 1_000_000
    ? (value / 1_000_000).toFixed(2) + "M"
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
      price: parseFloat(ticker?.lastPrice || "0"),
      priceChange: parseFloat(ticker?.priceChangePercent || "0"),
      volume: volume || 0,
      isRise: ticker?.isRise,
      tickSizeLength: getTickSizeBySymbol({ symbol }).tickSizeLength,
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
export function formatNumberWithCommas(value: number | string) {
  if (typeof value === "string") {
    value = parseFloat(value);
  }
  if (typeof value !== "number" || isNaN(value)) {
    return "0";
  }
  const fixedValue = value.toFixed(8);
  const parts = fixedValue.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  parts[1] = parts[1].replace(/0+$/, "");
  if (parts[1].length === 0) {
    return parts[0];
  }
  return parts.join(".");
}

export function formatPriceBySymbol({
  symbol,
  price,
}: {
  symbol: ExchangeInfo;
  price: number;
}) {
  const { tickSizeLength } = getTickSizeBySymbol({ symbol });
  return price.toFixed(tickSizeLength);
}
export function formatPriceByTickSizeLength({
  tickSizeLength,
  price,
}: {
  tickSizeLength: number;
  price: number;
}) {
  return price.toFixed(tickSizeLength);
}

export function removeTrailingZeros(num: number) {
  return num.toString().replace(/0+$/, "");
}
export function getTickSizeBySymbol({ symbol }: { symbol: ExchangeInfo }) {
  // @ts-ignore
  const tickSize = symbol.filters.find(
    // @ts-ignore
    (filter) => filter.filterType === "PRICE_FILTER"
  ).tickSize;

  return {
    tickSize,
    tickSizeLength: removeTrailingZeros(tickSize).split(".")[1].length || 2,
  };
}
export function getLotSizeBySymbol({ symbol }: { symbol: ExchangeInfo }) {
  // @ts-ignore
  const lotSize = symbol.filters.find(
    // @ts-ignore
    (filter) => filter.filterType === "LOT_SIZE"
  ).stepSize;

  return {
    lotSize,
    lotSizeLength: removeTrailingZeros(lotSize).split(".")[1].length || 2,
  };
}

export function getValidateOrderInput(
  value: string,
  tickSizeLength: number
): string {
  if (!/^\d*\.?\d*$/.test(value)) return "";
  if (value === ".") return "";
  if (value === "0") return "";

  let newValue = value;
  if (newValue.includes(".")) {
    let [integer, decimal] = newValue.split(".");
    if (decimal.length > tickSizeLength) {
      newValue = `${integer}.${decimal.slice(0, tickSizeLength)}`;
    }
  }

  return newValue;
}
