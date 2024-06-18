import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const [, locale, ...segments] = request.nextUrl.pathname.split("/");

  if (locale != null && segments.join("/") === "trade") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/trade/BTCUSDT`;
    return NextResponse.redirect(new URL(redirectUrl.href).toString());
  }
  const handleI18nRouting = createIntlMiddleware({
    locales: ["en", "ko"],
    defaultLocale: "en",
  });
  const response = handleI18nRouting(request);
  return response;
}

export const config = {
  matcher: ["/", "/(ko|en)/:path*", "/(ko|en)/trade", "/trade"],
};
