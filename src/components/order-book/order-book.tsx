"use client";

import clsx from "clsx";
import { ChevronDown, Ellipsis } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { FixedSizeList as List } from "react-window";
import {
  BuyBookIcon,
  OrderBookIcon,
  SellBookIcon,
} from "@/assets/icons/order-book-icon";
import { useOrderInputAtom } from "@/atoms/order/order-input-atom";
import { Button } from "@/components/ui";
import { ORDER_BOOK_LAYOUT } from "@/constants/order-book-layout";
import useOrderBookSubscription from "@/hooks/use-order-book-subscription";

import {
  formatNumberWithCommas,
  formatPriceBySymbol,
  formatPriceByTickSizeLength,
  getLotSizeBySymbol,
  getSumOfAmountArrayByOrderBook,
  getTickSizeBySymbol,
} from "@/lib/utils";
export default function OrderBook({
  symbol,
  children,
}: {
  symbol: ExchangeInfo;
  children: React.ReactNode;
}) {
  const data = useOrderBookSubscription({ symbol: symbol.symbol });
  const t = useTranslations("orderBook");
  const [layoutOption, setLayoutOption] = useState<OrderBookLayout>("order");
  const { tickSize, tickSizeLength } = getTickSizeBySymbol({ symbol });
  const { lotSizeLength } = getLotSizeBySymbol({ symbol });
  const { setData: setOrderInput } = useOrderInputAtom();
  const askRef = useRef(null);
  const bidRef = useRef(null);
  const asks = Array.from(data.asks)
    .sort((a, b) => {
      return parseFloat(b[0]) - parseFloat(a[0]);
    })
    .map((ask) => {
      let price = parseFloat(ask[1][0]);
      let amount = parseFloat(ask[1][1]);
      let total = formatNumberWithCommas(price * amount);
      return {
        price: formatPriceBySymbol({
          symbol: symbol,
          price: parseFloat(ask[1][0]),
        }),
        amount: amount,
        total: total,
      };
    });
  const bids = Array.from(data.bids)
    .sort((a, b) => {
      return parseFloat(b[0]) - parseFloat(a[0]);
    })
    .map((bid) => {
      let price = parseFloat(bid[1][0]);
      let amount = parseFloat(bid[1][1]);
      let total = formatNumberWithCommas(price * amount);
      return {
        price: formatPriceBySymbol({
          symbol: symbol,
          price: parseFloat(bid[1][0]),
        }),
        amount: amount,
        total: total,
      };
    });

  const asksSumAmountArray = getSumOfAmountArrayByOrderBook(
    [...asks].reverse()
  );
  const bidsSumAmountArray = getSumOfAmountArrayByOrderBook(bids);
  const handleRowClick = (
    type: "sell" | "buy",
    price: string,
    amount: number
  ) => {
    if (type === "buy") {
      setOrderInput({
        buy: {
          price: price,
          amount: "",
        },
        sell: {
          price: price,
          amount: formatPriceByTickSizeLength({
            price: amount,
            tickSizeLength: lotSizeLength,
          }),
        },
      });
    } else {
      setOrderInput({
        buy: {
          price: price,
          amount: formatPriceByTickSizeLength({
            price: amount,
            tickSizeLength: lotSizeLength,
          }),
        },
        sell: {
          price: price,
          amount: "",
        },
      });
    }
  };

  useEffect(() => {
    if (layoutOption === "order") {
      //@ts-ignore
      askRef.current?.scrollToItem(asks.length - 1);
      //@ts-ignore
      bidRef.current?.scrollToItem(0);
    }
  }, [data]);

  return (
    <div className="flex flex-col w-80 flex-shrink-0 border-2 border-secondary px-4">
      <div className="flex h-[42px] justify-between items-center pt-1">
        <p className="font-medium text-sm text-primary">{t("order_book")}</p>
        <Button className="w-4 h-4" variant="ghost" size="icon">
          <Ellipsis />
        </Button>
      </div>
      <div className="flex items-center justify-between mt-3 mb-1">
        <div className="flex gap-3 items-center">
          <button
            onClick={() => {
              setLayoutOption("order");
              //@ts-ignore
              askRef.current?.scrollToItem(asks.length - 1);
              //@ts-ignore
              bidRef.current?.scrollToItem(0);
            }}
          >
            <OrderBookIcon />
          </button>
          <button
            onClick={() => {
              setLayoutOption("buy");
            }}
          >
            <BuyBookIcon />
          </button>
          <button
            onClick={() => {
              setLayoutOption("sell");
            }}
          >
            <SellBookIcon />
          </button>
        </div>
        <div className="flex">
          <p className="text-xs">
            {parseFloat(tickSize).toFixed(tickSizeLength)}
          </p>
          <ChevronDown size={16} />
        </div>
      </div>
      <div className="flex justify-between h-5 items-center">
        <p className="text-xs text-muted-foreground">
          {t("price")}({symbol.quoteAsset})
        </p>
        <p className="text-xs text-muted-foreground">
          {t("amount")}({symbol.baseAsset})
        </p>
        <p className="text-xs text-muted-foreground">{t("total")}</p>
      </div>
      <List
        ref={askRef}
        height={ORDER_BOOK_LAYOUT[layoutOption].sellHeight}
        itemCount={asks.length}
        itemSize={20}
        width={288}
        className={clsx({
          "no-scroll": layoutOption === "order",
        })}
      >
        {({ index, style }) => {
          return (
            <div style={style}>
              <button
                className="flex justify-between w-full"
                onClick={() => {
                  handleRowClick(
                    "sell",
                    asks[index].price,
                    asksSumAmountArray[asks.length - index - 1]
                  );
                }}
              >
                <p className="text-xs text-red-500 w-24 text-left">
                  {asks[index].price}
                </p>
                <p className="text-xs text-right w-24">{asks[index].amount}</p>
                <p className="text-xs text-right w-24">{asks[index].total}</p>
              </button>
            </div>
          );
        }}
      </List>
      {children}
      <List
        ref={bidRef}
        height={ORDER_BOOK_LAYOUT[layoutOption].buyHeight}
        itemCount={bids.length}
        itemSize={20}
        width={288}
        className={clsx({
          "no-scroll": layoutOption === "order",
        })}
      >
        {({ index, style }) => {
          return (
            <div style={style}>
              <button
                className="flex justify-between w-full"
                onClick={() => {
                  handleRowClick(
                    "buy",
                    bids[index].price,
                    bidsSumAmountArray[index]
                  );
                }}
              >
                <p className="text-xs text-green-500 w-24 text-left">
                  {bids[index].price}
                </p>
                <p className="text-xs text-right w-24">
                  {formatNumberWithCommas(bids[index].amount)}
                </p>
                <p className="text-xs text-right w-24">{bids[index].total}</p>
              </button>
            </div>
          );
        }}
      </List>
    </div>
  );
}
