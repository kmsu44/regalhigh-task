import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getValidateOrderInput } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface OrderInputBoxProps {
  baseAsset: string;
  quoteAsset: string;
  type: "buy" | "sell";
  orderInput: OrderInputState;
  tickSizeLength: number;
  updateData: (
    type: "sell" | "buy",
    key: keyof OrderInput,
    value: string
  ) => void;
}
export default function OrderInputBox({
  baseAsset,
  quoteAsset,
  type,
  orderInput,
  tickSizeLength,
  updateData,
}: OrderInputBoxProps) {
  const t = useTranslations("order");
  const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = getValidateOrderInput(e.target.value, tickSizeLength);
    if (newValue === null) return;
    updateData(type, "price", newValue);
  };
  return (
    <div className="flex flex-col w-full">
      <div className="flex text-sm text-muted-foreground">
        {t("avbl")} - {type === "buy" ? quoteAsset : baseAsset}
      </div>
      <p className="text-sm shrink-0 text-primary mb-1">
        {t("price")}{" "}
        <span className="text-muted-foreground">({quoteAsset})</span>
      </p>
      <div className="w-full flex gap-2 items-center">
        <Input
          value={orderInput[type].price}
          onChange={onChangePrice}
          className="text-right h-9 w-full"
        />
      </div>
      <p className="text-sm shrink-0 text-primary mb-1">
        {t("amount")}{" "}
        <span className="text-muted-foreground">({baseAsset})</span>
      </p>
      <div className="flex gap-2 items-center mb-2">
        <Input
          value={orderInput[type].amount}
          onChange={onChangePrice}
          className="text-right w-full "
        />
      </div>
      <Button variant="default" className="w-full">
        {t(type)}
      </Button>
    </div>
  );
}
