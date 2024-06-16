"use client";

import InfoHeader from "@/components/info/info-header";
import { symbolsOptions, tickersOptions } from "@/lib/query-options";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function CoinInfo({ symbol }: { symbol: string }) {
  const { data: coin } = useSuspenseQuery({
    ...symbolsOptions,
    select: (data) => data.find((coin) => coin.symbol === symbol),
  });
  const { data: ticker } = useSuspenseQuery({
    ...tickersOptions,
    select(data) {
      return data.find((ticker) => ticker.symbol === symbol);
    },
  });
  if (!coin || !ticker) return null;
  return (
    <div className="flex flex-col w-full">
      <InfoHeader coin={coin} ticker={ticker} />
      <div className="flex">
        <div className="w-80 flex-shrink-0">orderBook</div>
        <div className="w-full bg-yellow-300">
          <div className="flex flex-col">
            <div className="h-[42px] bg-yellow-400">tab1</div>
            <div className="h-10 bg-yellow-500">tab2</div>
            <div className="h-[440px] bg-yellow-600">chart</div>
          </div>
          <div className="flex flex-col">
            <div className="bg-blue-100 h-12">tab</div>
            <div className="bg-blue-200 h-[295px]">order</div>
          </div>
        </div>
      </div>
    </div>
  );
}
