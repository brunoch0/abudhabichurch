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
    <html lang="ko" className={`${notoSansKr.variable} ${notoSerifKr.variable} ${FONT_VARS} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer churchInfo={churchInfo} snsLinks={snsLinks} adminLabel={t.common.adminLogin} />
        <FloatingContact />
      </body>
    </html>
  );
}
