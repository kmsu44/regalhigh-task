import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import RecoilRootWrapper from "@/components/recoil-wrapper";
import ReactQueryProviders from "@/components/react-query-providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "regal-task",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ReactQueryProviders>
          <RecoilRootWrapper>
            <NextIntlClientProvider messages={messages}>
              <ThemeProvider attribute="class" defaultTheme="system">
                <Header />
                {children}
              </ThemeProvider>
            </NextIntlClientProvider>
          </RecoilRootWrapper>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
