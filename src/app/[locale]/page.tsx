import { getLocale } from "next-intl/server";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default async function Page() {
  const locale = await getLocale();
  return (
    <main>
      <h1>page</h1>
      <Link href={`${locale}/trade/btcusdt`} />
    </main>
  );
}
