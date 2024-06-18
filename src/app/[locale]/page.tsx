import { unstable_setRequestLocale } from "next-intl/server";

export default async function Page({
  params: { locale },
}: {
  params: {
    locale: string;
  };
}) {
  unstable_setRequestLocale(locale);
  return (
    <main>
      <h1>page</h1>
    </main>
  );
}
