"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input, Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { MARKET_TAB_LIST } from "@/constants/tab-list";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useFavoritesState } from "@/atoms/market/favorites-atom";
import { useMarketRadioState } from "@/atoms/market/radio-atom";
import { symbolsOptions, tickersOptions } from "@/lib/query-options";
import { useMarketTabState } from "@/atoms/market/tab-atom";
import useTickerSubscription from "@/hooks/use-ticker-subscription";
import CoinList from "@/components/market/coin-list";
import { useMarketSortState } from "@/atoms/market/sort-value";
import { getTableData } from "@/lib/utils";
import { ArrowLeftRight, ArrowUpDown } from "lucide-react";

export default function Market() {
  const t = useTranslations("market");

  const [radio, setRadio] = useMarketRadioState();
  const [marketTab, setMarketTab] = useMarketTabState();
  const [marketSort, setMarketSort] = useMarketSortState();
  const [favorites] = useFavoritesState();
  const [inputValue, setInputValue] = useState("");
  // const { data: symbols } = useSuspenseQuery(symbolsOptions);
  // const { data: tickers } = useSuspenseQuery(tickersOptions) as {
  //   data: Ticker[];
  // };
  // const c = useTickerSubscription();
  // const filteredSymbolsByInput = symbols.filter((symbol) =>
  //   symbol.symbol.toLowerCase().includes(inputValue.toLowerCase())
  // );
  // const filteredSymbolsByTab = symbols.filter((symbol) => {
  //   if (marketTab === "favorites" && favorites.includes(symbol.symbol)) {
  //     return symbol.symbol;
  //   }
  //   if (marketTab === "ALL") {
  //     return symbol.symbol;
  //   }
  //   return symbol.quoteAsset === marketTab;
  // });
  // const tableData = getTableData({
  //   //@ts-ignore
  //   symbols: inputValue === "" ? filteredSymbolsByTab : filteredSymbolsByInput,
  //   tickers,
  //   sortValue: marketSort,
  //   searchTerm: inputValue,
  // });
  const handleSort = (value: "price" | "change" | "volume" | "pair") => {
    if (marketSort.sortValue === value) {
      setMarketSort({
        sortValue: value,
        sortDirection: marketSort.sortDirection === "asc" ? "desc" : "asc",
      });
    } else {
      setMarketSort({
        sortValue: value,
        sortDirection: "asc",
      });
    }
  };
  const handleRadio = () => {
    setRadio(radio === "volume" ? "change" : "volume");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="flex flex-col w-80 h-[420px] py-2 overflow-hidden px-2 border-2 border-secondary rounded">
      <div className="flex w-full items-center h-10 mb-1">
        <Input
          value={inputValue}
          onChange={handleChange}
          placeholder={t("search")}
        />
      </div>
      <Tabs
        value={marketTab}
        onValueChange={(value) => setMarketTab(value)}
        className="flex flex-col overflow-hidden"
      >
        <TabsList className="flex overflow-auto scroll-hide justify-start px-2 mb-2">
          {MARKET_TAB_LIST.map((tab) => (
            <TabsTrigger
              key={String(tab.value + "list")}
              value={tab.value}
              className="bg-transparent text-xs p-1"
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex items-center">
          <div className="w-[120px] flex items-center justify-start gap-1">
            <p className="text-sm font-semibold text-primary text-left">
              {t("pair")}
            </p>
            <ArrowUpDown
              className="w-3 h-3 cursor-pointer"
              onClick={() => handleSort("pair")}
            />
          </div>
          <div className="w-[70px] flex items-center justify-end gap-1">
            <p className="text-sm font-semibold text-primary text-right">
              {t("price")}
            </p>
            <ArrowUpDown
              className="w-3 h-3 cursor-pointer"
              onClick={() => handleSort("price")}
            />
          </div>
          <div className="flex items-center w-[120px] justify-end">
            <p className="text-sm font-semibold text-primary">
              {radio === "change" ? t("change") : t("volume")}
            </p>
            <ArrowUpDown
              className="w-3 h-3 cursor-pointer"
              onClick={() =>
                handleSort(radio === "change" ? "change" : "volume")
              }
            />
            <ArrowLeftRight
              className="w-4 h-4 cursor-pointer"
              onClick={handleRadio}
            />
          </div>
        </div>
      </Tabs>
      {/* <CoinList data={tableData} radio={radio} /> */}
    </div>
  );
}
