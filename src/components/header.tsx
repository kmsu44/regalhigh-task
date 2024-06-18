import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import ThemeSwitch from "@/components/theme/theme-switch";
import LocaleSwitch from "@/components/locale-switch";
import { Button } from "@/components/ui";
import { ChevronDown } from "lucide-react";
import Logo from "@/assets/icons/logo";

export default function Header() {
  const t = useTranslations("header");
  const locale = useLocale();
  const menu = [
    {
      name: t("buy_crypto"),
      href: `/${locale}/trade`,
      isExpand: false,
    },
    { name: t("markets"), href: `/${locale}`, isExpand: false },
    { name: t("trade"), href: `/${locale}/trade`, isExpand: true },
    { name: t("futures"), href: `/${locale}`, isExpand: true },
    { name: t("earn"), href: `/${locale}`, isExpand: false },
    { name: t("square"), href: `/${locale}`, isExpand: true },
    { name: t("more"), href: `/${locale}`, isExpand: true },
  ];
  return (
    <header className="flex h-16 justify-between items-center px-6 bg-background border-b-2">
      <div className="flex gap-6 items-center">
        <Link href={`/${locale}`}>
          <Logo />
        </Link>
        <div className="hidden lg:flex">
          {menu.map((item) => {
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  key={item.name}
                  variant="link"
                  className="font-semibold"
                >
                  {item.name}
                  {item.isExpand && <ChevronDown className="w-4 h-4" />}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex gap-2 shrink-0 items-center">
        <Button size="sm">{t("log_in")}</Button>
        <Button size="sm">{t("sign_up")}</Button>
        <LocaleSwitch />
        <ThemeSwitch />
      </div>
    </header>
  );
}
