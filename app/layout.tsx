import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/store/reduxProvider";


export const metadata: Metadata = {
  title: "Major",
  description: "major-app, a 'SARL DAAB' product",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
