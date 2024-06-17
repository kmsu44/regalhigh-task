import { useState } from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOrderInputAtom } from "@/atoms/order/order-input-atom";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import OrderInputBox from "@/components/ui/order-input-box";
import { ORDER_SUB_TAB_LIST, ORDER_TAB_LIST } from "@/constants/tab-list";
import { getTickSizeBySymbol } from "@/lib/utils";

export default function Order({ symbol }: { symbol: ExchangeInfo }) {
  const { replace } = useRouter();
  const t = useTranslations("order");
  const { tickSizeLength } = getTickSizeBySymbol({ symbol });
  const searchParams = useSearchParams();
  const { data, updateData } = useOrderInputAtom();
  const pathname = usePathname();
  const type = searchParams.get("type") || "spot";
  const [subTabValue, setSubTabValue] = useState<OrderSubTabValue>(
    ORDER_SUB_TAB_LIST[0]
  );
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams();
    params.set("type", value);
    replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="bg-background h-[295px]">
      <Tabs value={type} onValueChange={handleTabChange}>
        <TabsList className="flex w-full justify-start h-12 pt-1 px-0 rounded-none">
          {ORDER_TAB_LIST.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={clsx("w-[120px] h-12", {
                "border-t-2 border-t-yellow-500 rounded-none":
                  type === tab.value,
              })}
            >
              {t(tab.name)}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex gap-4 py-1 px-4 pb-0">
          {ORDER_SUB_TAB_LIST.map((tab) => (
            <button
              key={tab.value}
              className={clsx(
                "text-sm text-muted-foreground font-medium hover:text-yellow-500 py-1",
                {
                  "text-yellow-600": subTabValue.value === tab.value,
                }
              )}
              onClick={() => setSubTabValue(tab)}
            >
              {t(tab.value)}
            </button>
          ))}
        </div>
        <div className="px-4">
          <TabsContent value="spot">
            <div className="flex gap-4">
              <OrderInputBox
                baseAsset={symbol.baseAsset}
                quoteAsset={symbol.quoteAsset}
                type="buy"
                tickSizeLength={tickSizeLength}
                orderInput={data}
                updateData={updateData}
              />
              <OrderInputBox
                baseAsset={symbol.baseAsset}
                quoteAsset={symbol.quoteAsset}
                tickSizeLength={tickSizeLength}
                type="sell"
                orderInput={data}
                updateData={updateData}
              />
            </div>
          </TabsContent>
          <TabsContent value="cross">
            <div>cross</div>
          </TabsContent>
          <TabsContent value="isolated">
            <div>isolated</div>
          </TabsContent>
          <TabsContent value="grid">
            <div>grid</div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
