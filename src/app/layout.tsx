import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import { getSettings } from "@/lib/settings";
import { getLang } from "@/lib/i18n-server";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "아부다비 맑은샘 한인교회",
    template: "%s | 아부다비 맑은샘 한인교회",
  },
  description:
    "UAE 아부다비 한인교회. 주일예배, 설교 영상, 주보, 교회 일정 안내. 아부다비 이주·파견 한인 가정을 환영합니다.",
  keywords: ["아부다비 한인교회", "아부다비 교회", "UAE 한인교회", "아랍에미리트 한인교회"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { churchInfo, snsLinks } = await getSettings();
  const { t } = await getLang();

  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer churchInfo={churchInfo} snsLinks={snsLinks} adminLabel={t.common.adminLogin} />
        <FloatingContact />
      </body>
    </html>
  );
}
