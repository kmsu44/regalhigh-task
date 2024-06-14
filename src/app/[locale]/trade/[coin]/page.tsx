import Market from "@/components/market/market";

export default function Page({
  params,
}: {
  params: {
    lang: string;
    coin: string;
  };
}) {
  return (
    <div className="bg-background">
      <Market />
    </div>
  );
}
