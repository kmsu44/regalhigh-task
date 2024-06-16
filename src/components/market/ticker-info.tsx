"use client";

import { tickersOptions } from "@/lib/query-options";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import clsx from "clsx";

export default function TickerInfo({
  symbol,
  radio,
}: {
  symbol: string;
  radio: "change" | "volume";
}) {
  // 타입 강제 캐스팅
  const { data } = useSuspenseQuery({
    ...tickersOptions,
    // @ts-ignore
    select: (data) => data?.find((item: Ticker) => item.symbol === symbol),
  }) as { data: Ticker };
  if (!data) return null;
  return (
    <>
      <span
        className={clsx("text-xs w-[70px] text-right", {
          "text-green-500": Number(data.lastPrice) > 0,
          "text-red-500": Number(data.lastPrice) < 0,
        })}
      >
        {Number(data.lastPrice)}
      </span>
      {radio === "change" ? (
        <span
          className={clsx("text-xs w-[130px] text-right", {
            "text-green-500": Number(data.priceChangePercent) > 0,
            "text-red-500": Number(data.priceChangePercent) < 0,
          })}
        >
          {Number(data.priceChangePercent).toFixed(2)}%
        </span>
      ) : (
        <span className="text-xs text-primary text-right w-[130px]">
          {Number(data.volume)}
        </span>
      )}
    </>
  );
}
