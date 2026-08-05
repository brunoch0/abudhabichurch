"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Field, inputCls, btnCls, revalidateSite } from "@/components/admin/ui";
import { DEFAULT_STYLE, textStyleToCss, type TextStyle } from "@/lib/textstyle";

// each fixed page exposes its editable text fields (style saved as `<key>_style`)
const PAGE_FIELDS: { slug: string; label: string; fields: { key: string; label: string; rows: number }[] }[] = [
  { slug: "greeting", label: "인사말", fields: [{ key: "body", label: "인사말 본문", rows: 8 }] },
  { slug: "vision", label: "교회 비전", fields: [{ key: "body", label: "비전/소개 본문", rows: 6 }] },
  { slug: "newcomer", label: "새가족 안내", fields: [{ key: "body", label: "환영 문구", rows: 4 }] },
  { slug: "location", label: "오시는 길", fields: [{ key: "directions", label: "상세 안내", rows: 4 }] },
  { slug: "en", label: "English", fields: [{ key: "body", label: "영어 소개", rows: 5 }] },
];

type Content = Record<string, unknown>;

function StyleControls({
  style,
  onChange,
}: {
  style: TextStyle;
  onChange: (s: TextStyle) => void;
}) {
  const s = { ...DEFAULT_STYLE, ...style };
  return (
    <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-spring-50/60 p-3 sm:grid-cols-3">
      <label className="block text-[11px] font-semibold text-ink-soft">
        글씨체
        <select className={`${inputCls} mt-1`} value={s.font} onChange={(e) => onChange({ ...s, font: e.target.value as TextStyle["font"] })}>
          <option value="sans">고딕 (기본)</option>
          <option value="serif">명조</option>
        </select>
      </label>
      <label className="block text-[11px] font-semibold text-ink-soft">
        크기 ({s.size}px)
        <input type="range" min={12} max={36} value={s.size} className="mt-2 w-full" onChange={(e) => onChange({ ...s, size: Number(e.target.value) })} />
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

export default function AdminPages() {
  const [contents, setContents] = useState<Record<string, Content>>({});
  const [active, setActive] = useState(PAGE_FIELDS[0].slug);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    createClient()
      .from("pages")
      .select("slug, content")
      .then(({ data }) => {
        const map: Record<string, Content> = {};
        data?.forEach((r) => (map[r.slug] = r.content ?? {}));
        setContents(map);
      });
  }, []);

  const page = PAGE_FIELDS.find((p) => p.slug === active)!;
  const content = contents[active] ?? {};

  const setField = (key: string, value: unknown) =>
    setContents((c) => ({ ...c, [active]: { ...c[active], [key]: value } }));

  async function save() {
    setBusy(true);
    const next = { ...content, placeholder: false };
    const { error } = await createClient().from("pages").update({ content: next }).eq("slug", active);
    setBusy(false);
    if (error) {
      alert(`저장 실패: ${error.message}`);
      return;
    }
    revalidateSite();
    alert("저장되었습니다. 사이트에 바로 반영됩니다.");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {PAGE_FIELDS.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActive(p.slug)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              active === p.slug ? "bg-spring-600 text-white" : "bg-spring-50 text-ink-soft hover:bg-spring-100"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        {/* editor */}
        <div className="space-y-5 rounded-2xl border border-spring-100 bg-white p-5">
          {page.fields.map((f) => (
            <div key={f.key}>
              <Field label={f.label}>
                <textarea
                  rows={f.rows}
                  className={inputCls}
                  value={String(content[f.key] ?? "")}
                  onChange={(e) => setField(f.key, e.target.value)}
                />
              </Field>
              <StyleControls
                style={(content[`${f.key}_style`] as TextStyle) ?? {}}
                onChange={(s) => setField(`${f.key}_style`, s)}
              />
            </div>
          ))}
          <button className={btnCls} disabled={busy} onClick={save}>
            {busy ? "저장 중..." : "저장 (사이트 반영)"}
          </button>
        </div>

        {/* live preview */}
        <div>
          <p className="mb-2 text-xs font-semibold text-ink-faint">👁 미리보기 — 사이트에 이렇게 보입니다</p>
          <div className="rounded-2xl border border-spring-100 bg-mist p-6">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-spring-950">{page.label}</h2>
              {page.fields.map((f) => (
                <p key={f.key} style={textStyleToCss(content[`${f.key}_style`] as TextStyle)}>
                  {String(content[f.key] ?? "") || "(내용을 입력하면 여기에 표시됩니다)"}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
