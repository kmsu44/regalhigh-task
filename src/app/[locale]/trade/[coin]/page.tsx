import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Market from "@/components/market/market";
import { getQueryClient } from "@/lib/get-query-client";
import { symbolsOptions, tickersOptions } from "@/lib/query-options";
import CoinInfo from "@/components/info/coin-info";

export default function Page({
  params,
}: {
  params: {
    lang: string;
    coin: string;
  };
}) {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(symbolsOptions);
  void queryClient.prefetchQuery(tickersOptions);
  return (
    <div className="flex bg-background">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CoinInfo />
        <div className="h-[357px] max-w-80">
          <Market />
          <div>트레이드</div>
        </div>
      </HydrationBoundary>
    </div>
  );
}
