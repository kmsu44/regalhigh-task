"use client";

import { useTranslations } from "next-intl";

export default function TestComponent() {
  const t = useTranslations("header");
  return <div>{t("buy_crypto")}</div>;
}
