import { getRequestConfig } from "next-intl/server";

const locales = ["en", "ko"];

export default getRequestConfig(async ({ locale }) => {
  let newLocale = "en";
  if (locales.includes(locale as any)) {
    newLocale = locale;
  }
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
