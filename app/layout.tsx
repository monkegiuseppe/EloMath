// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({ subsets: ["latin"] });

// Metadata export is now valid again.
export const metadata: Metadata = {
  title: "EloMath",
  description: "Master advanced mathematics and physics through adaptive learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The `<html>` tag is clean. The toggle will add a class to the body.
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SiteHeader />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}