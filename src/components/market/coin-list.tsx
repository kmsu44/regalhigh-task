import { useTranslations } from "next-intl";
import { useFavoritesState } from "@/atoms/market/favorites";
import { useMarketRadioState } from "@/atoms/market/radioword";
import { Button } from "@/components/ui";
import { ArrowLeftRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CoinList() {
  const [favorites, setFavorites] = useFavoritesState();
  const [radio, setRadio] = useMarketRadioState();
  const t = useTranslations("market");
  const handleFavorite = (value: string) => {
    setFavorites((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== "usdt");
      } else {
        return [...prev, "usdt"];
      }
    });
  };
  const handleRadio = () => {
    setRadio(radio === "volume" ? "change" : "volume");
  };

  return <div>table</div>;
}
