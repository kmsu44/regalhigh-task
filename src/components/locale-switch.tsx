"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Button,
} from "@/components/ui";
import { Globe } from "lucide-react";

export default function LocaleSwitch() {
  const t = useTranslations("header");
  const pathname = usePathname();
  const [, locale, ...segments] = pathname.split("/");
  const localeOptions = [
    { label: "English", value: "en" },
    { label: "한국어", value: "ko" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <Globe size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
        {localeOptions.map((option) => {
          return (
            <Link
              key={option.value}
              href={`/${option.value}/${segments.join("/")}`}
              className={cn({ "text-yellow-300": option.value === locale })}
            >
              <DropdownMenuItem>{option.label}</DropdownMenuItem>
            </Link>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
