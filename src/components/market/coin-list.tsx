"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { FixedSizeList as List } from "react-window";
import { useFavoritesState } from "@/atoms/market/favorites-atom";
import { convertMillion, formatPriceByTickSizeLength } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Star } from "lucide-react";

export default function CoinList({
  data,
  radio,
}: {
  data: MarketTable[];
  radio: "volume" | "change";
}) {
  const [favorites, setFavorites] = useFavoritesState();
  const handleFavorite = (value: string) => {
    setFavorites((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };
  const pathname = usePathname();
  const [prev, locale, trade, coin, ...segments] = pathname.split("/");
  return (
    <List
      height={320}
      itemCount={data.length}
      itemSize={35}
      width={300}
      className="scroll-hide"
    >
      {({ index, style }) => (
        <div style={style} className="hover:bg-secondary">
          <Link
            key={data[index].pair}
            href={`${prev}/${locale}/trade/${
              data[index].symbol
            }/${segments.join("/")}`}
            className="flex items-center w-[300px]"
          >
            <div className="flex items-center w-[120px] justify-start">
              <Button
                variant="ghost"
                className="p-1 z-10"
                onClick={(e) => {
                  e.preventDefault();
                  handleFavorite(data[index].symbol);
                }}
              >
                <Star
                  className={clsx({
                    "w-3 h-3 ": true,
                    "fill-yellow-500": favorites.includes(data[index].symbol),
                  })}
                />
              </Button>
              <p className="text-xs text-primary">{data[index].pair}</p>
            </div>
            <span
              className={clsx("text-xs w-[70px] text-right", {
                "text-primary": data[index].isRise === null,
                "text-green-500": data[index].isRise,
                "text-red-500": data[index].isRise === false,
              })}
            >
              {formatPriceByTickSizeLength({
                tickSizeLength: data[index].tickSizeLength,
                price: data[index].price,
              })}
            </span>
            {radio === "change" ? (
              <span
                className={clsx("text-xs w-[120px] text-right text-primary", {
                  "text-green-500": data[index].priceChange > 0,
                  "text-red-500": data[index].priceChange < 0,
                })}
              >
                {data[index].priceChange.toFixed(2)}%
              </span>
            ) : (
              <span className="text-xs text-primary text-right w-[120px]">
                {convertMillion(data[index].volume)}
              </span>
            )}
          </Link>
        </div>
      )}
    </List>
  );
}
