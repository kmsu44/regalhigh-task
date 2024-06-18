import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Market from "@/components/market/market";
import { getQueryClient } from "@/lib/get-query-client";
import { symbolsOptions, tickersOptions } from "@/lib/query-options";
// import CoinInfo from "@/components/info/coin-info";

export default async function Page({
  params,
}: {
  params: {
    lang: string;
    coin: string;
  };
}) {
  const symbol = params.coin.toUpperCase();
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(symbolsOptions);
  void queryClient.prefetchQuery(tickersOptions);
  return (
    <div className="flex bg-background w-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* {symbol && <CoinInfo symbol={params.coin.toUpperCase()} />} */}
        <div className="h-[357px] max-w-80 flex-shrink-0">
          <Market />
          <div>트레이드</div>
        </div>
      </HydrationBoundary>
    </div>
  );
}
