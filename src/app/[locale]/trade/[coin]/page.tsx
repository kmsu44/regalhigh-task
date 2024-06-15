import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Market from "@/components/market/market";
import { getQueryClient } from "@/lib/get-query-client";
import { symbolsOptions, tickersOptions } from "@/lib/query-options";

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
    <div className="bg-background">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Market />
      </HydrationBoundary>
    </div>
  );
}
