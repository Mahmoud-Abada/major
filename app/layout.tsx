import clsx from "clsx";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import ReduxProviders from "@/store/Providers";
import "@/styles/rtl.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { CalendarProvider } from "../components/calendar/event-calendar/calendar-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const kufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-kufi",
  display: "swap",
});

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale();
  const messages = await getMessages();
  const isRTL = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={clsx(inter.variable, kufi.variable)}
      suppressHydrationWarning
    >
      <body className={clsx(inter.className, isRTL && "font-kufi")}>
        <ReduxProviders>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <AuthProvider>
                <CalendarProvider>{children}</CalendarProvider>
                <Toaster />
              </AuthProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </ReduxProviders>
      </body>
    </html>
  );
}
