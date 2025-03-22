import type { Metadata } from "next";
import "./globals.css";


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
      <body>
        {children}
      </body>
    </html>
  );
}
