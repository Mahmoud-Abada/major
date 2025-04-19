"use client";

import ReduxProvider from "@/store/reduxProvider";
//import type { Metadata } from "next";
import { ToastProvider } from "../components/ui/toast";
import "./globals.css";
import { store } from "../store/store";

/*export const metadata: Metadata = {
  title: "Major",
  description: "major-app, a 'SARL DAAB' product",
};*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <ReduxProvider store={store}>
          <ToastProvider swipeDirection="left">{children}</ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
