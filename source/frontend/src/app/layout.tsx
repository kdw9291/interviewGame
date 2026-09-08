import type { Metadata } from "next";
import { Nanum_Myeongjo, Special_Elite } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const nanumMyeongjo = Nanum_Myeongjo({
  variable: "--font-retro-serif",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const specialElite = Special_Elite({
  variable: "--font-retro-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const SITE_NAME = "억까 면접관 살아남기";
const SITE_DESCRIPTION =
  "진실의 면접실 — 상식이 통하지 않는 AI 면접관과의 생존 게임. 뻔뻔함과 순발력으로 합격증을 쟁취하라.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${nanumMyeongjo.variable} ${specialElite.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
