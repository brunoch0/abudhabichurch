import type { CSSProperties } from "react";

export const FONT_OPTIONS: { key: string; label: string; stack: string; group: "국문" | "영문" }[] = [
  { key: "sans", label: "고딕 (기본)", stack: "var(--font-noto-sans-kr), sans-serif", group: "국문" },
  { key: "serif", label: "명조", stack: "var(--font-noto-serif-kr), serif", group: "국문" },
  { key: "gowun", label: "고운돋움 (부드러운 고딕)", stack: "var(--font-gowun-dodum), sans-serif", group: "국문" },
  { key: "batang", label: "고운바탕 (부드러운 명조)", stack: "var(--font-gowun-batang), serif", group: "국문" },
  { key: "jua", label: "주아 (둥근 제목체)", stack: "var(--font-jua), sans-serif", group: "국문" },
  { key: "dohyeon", label: "도현 (굵은 제목체)", stack: "var(--font-do-hyeon), sans-serif", group: "국문" },
  { key: "song", label: "송명 (클래식 명조)", stack: "var(--font-song-myung), serif", group: "국문" },
  { key: "pen", label: "나눔손글씨 (펜글씨)", stack: "var(--font-nanum-pen), cursive", group: "국문" },
  { key: "gaegu", label: "개구 (귀여운 손글씨)", stack: "var(--font-gaegu), cursive", group: "국문" },
  { key: "himelody", label: "하이멜로디 (아기자기)", stack: "var(--font-hi-melody), cursive", group: "국문" },
  { key: "inter", label: "Inter (모던 산세리프)", stack: "var(--font-inter), sans-serif", group: "영문" },
  { key: "montserrat", label: "Montserrat (제목용)", stack: "var(--font-montserrat), sans-serif", group: "영문" },
  { key: "poppins", label: "Poppins (둥근 산세리프)", stack: "var(--font-poppins), sans-serif", group: "영문" },
  { key: "oswald", label: "Oswald (컨덴스드)", stack: "var(--font-oswald), sans-serif", group: "영문" },
  { key: "playfair", label: "Playfair Display (클래식 세리프)", stack: "var(--font-playfair), serif", group: "영문" },
  { key: "merriweather", label: "Merriweather (본문 세리프)", stack: "var(--font-merriweather), serif", group: "영문" },
  { key: "lora", label: "Lora (세리프)", stack: "var(--font-lora), serif", group: "영문" },
  { key: "garamond", label: "EB Garamond (고전 세리프)", stack: "var(--font-garamond), serif", group: "영문" },
  { key: "dancing", label: "Dancing Script (필기체)", stack: "var(--font-dancing), cursive", group: "영문" },
  { key: "caveat", label: "Caveat (손글씨)", stack: "var(--font-caveat), cursive", group: "영문" },
];

export type TextStyle = {
  font?: string;
  size?: number; // px
  color?: string;
  opacity?: number; // 0~1
  weight?: "normal" | "bold";
  align?: "left" | "center";
};

export const DEFAULT_STYLE: TextStyle = {
  font: "sans",
  size: 16,
  color: "#4b5768",
  opacity: 1,
  weight: "normal",
  align: "left",
};

export function textStyleToCss(style?: TextStyle): CSSProperties {
  const s = { ...DEFAULT_STYLE, ...style };
  const stacks: Record<string, string> = Object.fromEntries(
    FONT_OPTIONS.map((f) => [f.key, f.stack])
  );
  return {
    fontFamily: stacks[s.font ?? "sans"] ?? stacks.sans,
    fontSize: `${s.size}px`,
    color: s.color,
    opacity: s.opacity,
    fontWeight: s.weight === "bold" ? 700 : 400,
    textAlign: s.align,
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  };
}
