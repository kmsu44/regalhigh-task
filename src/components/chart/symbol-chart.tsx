"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { init, dispose } from "klinecharts";
import { Interval } from "@binance/connector-typescript";
import { klinesOptions } from "@/lib/query-options";
import useKlinesSubscription from "@/hooks/use-klines-subscription";
import { useKlineIntervalState } from "@/atoms/klines/kline-interval-atom";
import { getLotSizeBySymbol, getTickSizeBySymbol } from "@/lib/utils";

export default function SymbolChart({ symbol }: { symbol: ExchangeInfo }) {
  const [klineInterval] = useKlineIntervalState();
  const { data } = useSuspenseQuery(
    klinesOptions({ symbol: symbol.symbol, interval: Interval[klineInterval] })
  );
  const k = useKlinesSubscription({
    symbol: symbol.symbol.toLowerCase(),
    interval: Interval[klineInterval],
  });
  const { tickSizeLength } = getTickSizeBySymbol({
    symbol: symbol,
  });
  const { lotSizeLength } = getLotSizeBySymbol({
    symbol: symbol,
  });
  useEffect(() => {
    if (!data) return;
    const chart = init("chart", {
      locale: "ko",
    });
    chart?.setPriceVolumePrecision(tickSizeLength, lotSizeLength);
    chart?.applyNewData(data);
    return () => {
      dispose("chart");
    };
  }, [data, tickSizeLength, lotSizeLength]);

  return <div id="chart" className="w-full h-[576px]" />;
}
