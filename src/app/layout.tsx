import type { Metadata } from "next";
import {
  Noto_Sans_KR, Noto_Serif_KR, Gowun_Dodum, Gowun_Batang, Jua, Nanum_Pen_Script,
  Do_Hyeon, Song_Myung, Gaegu, Hi_Melody,
  Inter, Playfair_Display, Merriweather, Lora, Montserrat, Poppins, Oswald, Dancing_Script, Caveat, EB_Garamond,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import { getSettings } from "@/lib/settings";
import { getLang } from "@/lib/i18n-server";
import JsonLd from "@/components/JsonLd";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// optional fonts load their files only when actually used on a page (preload off)
const gowunDodum = Gowun_Dodum({ variable: "--font-gowun-dodum", subsets: ["latin"], weight: "400", preload: false });
const gowunBatang = Gowun_Batang({ variable: "--font-gowun-batang", subsets: ["latin"], weight: "400", preload: false });
const jua = Jua({ variable: "--font-jua", subsets: ["latin"], weight: "400", preload: false });
const nanumPen = Nanum_Pen_Script({ variable: "--font-nanum-pen", subsets: ["latin"], weight: "400", preload: false });
const doHyeon = Do_Hyeon({ variable: "--font-do-hyeon", weight: "400" });
const songMyung = Song_Myung({ variable: "--font-song-myung", weight: "400" });
const gaegu = Gaegu({ variable: "--font-gaegu", weight: "400" });
const hiMelody = Hi_Melody({ variable: "--font-hi-melody", weight: "400" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], preload: false });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], preload: false });
const merriweather = Merriweather({ variable: "--font-merriweather", subsets: ["latin"], weight: ["400", "700"], preload: false });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"], preload: false });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], preload: false });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["400", "700"], preload: false });
const oswald = Oswald({ variable: "--font-oswald", subsets: ["latin"], preload: false });
const dancing = Dancing_Script({ variable: "--font-dancing", subsets: ["latin"], preload: false });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], preload: false });
const garamond = EB_Garamond({ variable: "--font-garamond", subsets: ["latin"], preload: false });

const FONT_VARS = [
  gowunDodum, gowunBatang, jua, nanumPen, doHyeon, songMyung, gaegu, hiMelody,
  inter, playfair, merriweather, lora, montserrat, poppins, oswald, dancing, caveat, garamond,
].map((f) => f.variable).join(" ");

export const metadata: Metadata = {
  metadataBase: new URL("https://adkmc.ae"),
  title: {
    default: "아부다비 맑은샘 한인교회 | UAE 아부다비 한인교회",
    template: "%s | 아부다비 맑은샘 한인교회",
  },
  description:
    "UAE 아부다비 한인교회입니다. 주일예배 오전 10:20, St.Andrew's Centre 신관 채플실. 설교 영상, 주보, 교회 일정을 안내합니다. 아부다비 이주·파견 한인 가정을 환영합니다.",
  keywords: [
    "아부다비 한인교회",
    "아부다비 교회",
    "UAE 한인교회",
    "아랍에미리트 한인교회",
    "아부다비 맑은샘교회",
    "두바이 근교 한인교회",
    "Korean church Abu Dhabi",
    "ADKMC",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    url: "https://adkmc.ae",
    siteName: "아부다비 맑은샘 한인교회",
    title: "아부다비 맑은샘 한인교회 | UAE 아부다비 한인교회",
    description:
      "주일예배 오전 10:20, St.Andrew's Centre. 아부다비에 오신 한인 가정을 환영합니다.",
    images: [{ url: "/hero-standrews.jpg", width: 1280, height: 960, alt: "아부다비 맑은샘 한인교회 예배 장소" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "아부다비 맑은샘 한인교회",
    description: "UAE 아부다비 한인교회 · 주일예배 오전 10:20",
    images: ["/hero-standrews.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    google: "BL2tixTXpIvaM1N1lBJW9G2FgWor-8apviS_oP50O3I",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { churchInfo, snsLinks, worshipTimes } = await getSettings();
  const { t } = await getLang();

  return (
    <html lang="ko" className={`${notoSansKr.variable} ${notoSerifKr.variable} ${FONT_VARS} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd churchInfo={churchInfo} snsLinks={snsLinks} worshipTimes={worshipTimes} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer churchInfo={churchInfo} snsLinks={snsLinks} adminLabel={t.common.adminLogin} />
        <FloatingContact />
      </body>
    </html>
  );
}
