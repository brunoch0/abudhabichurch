"use client";

import { inputCls } from "@/components/admin/ui";
import { DEFAULT_STYLE, FONT_OPTIONS, type TextStyle } from "@/lib/textstyle";

export default function StyleControls({
  style,
  onChange,
  base,
}: {
  style: TextStyle;
  onChange: (s: TextStyle) => void;
  /** per-field starting point (e.g. white bold for hero text) */
  base?: TextStyle;
}) {
  const s = { ...DEFAULT_STYLE, ...base, ...style };
  return (
    <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-spring-50/60 p-3 sm:grid-cols-3">
      <label className="block text-[11px] font-semibold text-ink-soft">
        글씨체
        <select className={`${inputCls} mt-1`} value={s.font} onChange={(e) => onChange({ ...s, font: e.target.value })}>
          {(["국문", "영문"] as const).map((group) => (
            <optgroup key={group} label={group}>
              {FONT_OPTIONS.filter((f) => f.group === group).map((f) => (
                <option key={f.key} value={f.key}>{f.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <label className="block text-[11px] font-semibold text-ink-soft">
        크기 ({s.size}px)
        <input type="range" min={12} max={64} value={s.size} className="mt-2 w-full" onChange={(e) => onChange({ ...s, size: Number(e.target.value) })} />
      </label>
      <label className="block text-[11px] font-semibold text-ink-soft">
        색상
        <input type="color" value={s.color} className="mt-1 h-9 w-full cursor-pointer rounded-lg border border-spring-200 bg-white" onChange={(e) => onChange({ ...s, color: e.target.value })} />
      </label>
      <label className="block text-[11px] font-semibold text-ink-soft">
        투명도 ({Math.round((s.opacity ?? 1) * 100)}%)
        <input type="range" min={20} max={100} value={Math.round((s.opacity ?? 1) * 100)} className="mt-2 w-full" onChange={(e) => onChange({ ...s, opacity: Number(e.target.value) / 100 })} />
      </label>
      <label className="block text-[11px] font-semibold text-ink-soft">
        굵기
        <select className={`${inputCls} mt-1`} value={s.weight} onChange={(e) => onChange({ ...s, weight: e.target.value as TextStyle["weight"] })}>
          <option value="normal">보통</option>
          <option value="bold">굵게</option>
        </select>
      </label>
      <label className="block text-[11px] font-semibold text-ink-soft">
        정렬
        <select className={`${inputCls} mt-1`} value={s.align} onChange={(e) => onChange({ ...s, align: e.target.value as TextStyle["align"] })}>
          <option value="left">왼쪽</option>
          <option value="center">가운데</option>
        </select>
      </label>
    </div>
  );
}
