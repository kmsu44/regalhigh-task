import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "ko"],
  defaultLocale: "en",
});

export const config = {
  matcher: ["/", "/(ko|en)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
