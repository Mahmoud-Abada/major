import ReduxProviders from "@/lib/redux/Providers";
import { ReactNode } from "react";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import ThemeToggle from "../components/common/theme-toggle";
import LanguageSwitcher from "../components/common/language-switcher";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const kufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-kufi",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={`${inter.variable} ${kufi.variable}`}
    >
      <body>
        <ReduxProviders>
        <LanguageSwitcher />
        <ThemeToggle/>
        {children}
        </ReduxProviders>
      </body>
    </html>
  );
}
