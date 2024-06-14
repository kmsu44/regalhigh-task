"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import {
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useMarketTabState } from "@/atoms/market/tab-atom";

export default function Market() {
  const t = useTranslations("common");
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [tabValue, setTabValue] = useMarketTabState();
  const tabList = [
    {
      name: "★",
      value: "all",
    },
    {
      name: "USDT",
      value: "usdt",
    },
    {
      name: "BTC",
      value: "btc",
    },
    {
      name: "ETH",
      value: "eth",
    },
    {
      name: "BNB",
      value: "bnb",
    },
    {
      name: "USDC",
      value: "usdc",
    },
    {
      name: "DAI",
      value: "dai",
    },
  ];
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
        value={tabValue}
        onValueChange={(value) => setTabValue(value)}
        className="overflow-hidden"
      >
        <TabsList className="flex overflow-auto scroll-hide justify-start px-2">
          {tabList.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => setTabValue(tab.value)}
              className="bg-transparent px-2"
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabList.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            coinlist
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
