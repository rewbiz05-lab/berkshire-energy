import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://berkshireenergy.info"),
  title: {
    default: "Berkshire Energy — Solar & Battery for Arizona Homes",
    template: "%s · Berkshire Energy",
  },
  description:
    "Berkshire Energy designs, installs, and backs custom solar & battery storage systems for Arizona homeowners — lower, predictable energy bills for decades.",
  openGraph: {
    title: "Berkshire Energy — Own Your Power",
    description:
      "Custom solar & battery storage for Arizona homes. Lock in lower energy bills and stay powered through outages.",
    url: "https://berkshireenergy.info",
    siteName: "Berkshire Energy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
