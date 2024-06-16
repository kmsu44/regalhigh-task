import { useFavoritesState } from "@/atoms/market/favorites";
import { Button } from "@/components/ui";
import useConvertUsd from "@/hooks/use-convert-usd";
import { formatNumberWithCommas } from "@/lib/utils";
import clsx from "clsx";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

interface InfoHeaderProps {
  coin: ExchangeInfo;
  ticker: Ticker;
}

export default function InfoHeader({ coin, ticker }: InfoHeaderProps) {
  const t = useTranslations("info");
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
  const usdPrice = useConvertUsd({
    price: ticker.lastPrice,
    baseAsset: coin.baseAsset,
  });

  return (
    <div className="flex w-full h-14 items-center justify-between px-4">
      <div className="flex items-center gap-2 flex-shrink-0 w-full overflow-hidden">
        <Button
          variant="outline"
          onClick={() => {
            handleFavorite(coin.symbol);
          }}
          className="w-6 h-6 p-1"
        >
          <Star
            className={clsx({
              "w-4 h-4": true,
              "fill-yellow-500": favorites.includes(coin.symbol),
            })}
          />
        </Button>
        <div className="text-xl text-primary font-medium flex-shrink-0 ">
          {coin.baseAsset}/{coin.quoteAsset}
        </div>
        <div className="flex items-center gap-2 overflow-scroll scroll-hide">
          <div>
            <p
              className={clsx("text-xl text-primary text-nowrap", {
                "text-green-500": ticker.isRise,
                "text-red-500": !ticker.isRise,
              })}
            >
              {formatNumberWithCommas(ticker.lastPrice)}
            </p>
            <p className="text-xs text-primary">
              ${formatNumberWithCommas(usdPrice)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 text-nowrap">
              {t("24h_change")}
            </p>
            <p
              className={clsx("text-xs", {
                "text-green-500": ticker.isRise,
                "text-red-500": !ticker.isRise,
              })}
            >
              {ticker.priceChangePercent}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 text-nowrap">
              {t("24h_high")}
            </p>
            <p className="text-primary text-xs">
              {formatNumberWithCommas(ticker.highPrice)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 text-nowrap">
              {t("24h_low")}
            </p>
            <p className="text-primary text-xs">
              {formatNumberWithCommas(ticker.lowPrice)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 text-nowrap">
              {t("24h_volume")}({coin.baseAsset})
            </p>
            <p className="text-primary text-xs">
              {formatNumberWithCommas(ticker.volume)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 text-nowrap">
              {t("24h_volume")}({coin.quoteAsset})
            </p>
            <p className="text-primary text-xs">
              {formatNumberWithCommas(ticker.volume)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
