import type { CSSProperties } from "react";

export type TextStyle = {
  font?: "sans" | "serif";
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
  return {
    fontFamily:
      s.font === "serif"
        ? "var(--font-noto-serif-kr), 'Nanum Myeongjo', serif"
        : "var(--font-noto-sans-kr), sans-serif",
    fontSize: `${s.size}px`,
    color: s.color,
    opacity: s.opacity,
    fontWeight: s.weight === "bold" ? 700 : 400,
    textAlign: s.align,
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  };
}
