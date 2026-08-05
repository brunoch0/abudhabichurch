"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Field, inputCls, btnCls, revalidateSite } from "@/components/admin/ui";
import StyleControls from "@/components/admin/StyleControls";
import { textStyleToCss, type TextStyle } from "@/lib/textstyle";

// each fixed page exposes its editable text fields (style saved as `<key>_style`)
const PAGE_FIELDS: { slug: string; label: string; fields: { key: string; label: string; rows: number }[] }[] = [
  { slug: "greeting", label: "인사말", fields: [{ key: "body", label: "인사말 본문", rows: 8 }] },
  { slug: "vision", label: "교회 비전", fields: [{ key: "body", label: "비전/소개 본문", rows: 6 }] },
  { slug: "newcomer", label: "새가족 안내", fields: [{ key: "body", label: "환영 문구", rows: 4 }] },
  { slug: "location", label: "오시는 길", fields: [{ key: "directions", label: "상세 안내", rows: 4 }] },
  { slug: "en", label: "English", fields: [{ key: "body", label: "영어 소개", rows: 5 }] },
];

type Content = Record<string, unknown>;

export default function AdminPages() {
  const [contents, setContents] = useState<Record<string, Content>>({});
  const [active, setActive] = useState(PAGE_FIELDS[0].slug);
  const [busy, setBusy] = useState(false);
  const [editLang, setEditLang] = useState<"ko" | "en">("ko");

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
      <div className="flex flex-wrap items-center justify-between gap-2">
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
      <div className="flex gap-1">
        {(["ko", "en"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setEditLang(l)}
            className={`rounded-full px-3.5 py-1 text-xs font-bold ${editLang === l ? "bg-spring-600 text-white" : "bg-spring-50 text-ink-soft"}`}
          >
            {l === "ko" ? "한국어" : "English"}
          </button>
        ))}
      </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        {/* editor */}
        <div className="space-y-5 rounded-2xl border border-spring-100 bg-white p-5">
          {page.fields.map((f) => {
            const k = editLang === "en" && page.slug !== "en" ? `${f.key}_en` : f.key;
            return (
              <div key={k}>
                <Field label={editLang === "en" && page.slug !== "en" ? `${f.label} (영어 모드용)` : f.label}>
                  <textarea
                    rows={f.rows}
                    className={inputCls}
                    value={String(content[k] ?? "")}
                    onChange={(e) => setField(k, e.target.value)}
                  />
                </Field>
                <StyleControls
                  style={(content[`${k}_style`] as TextStyle) ?? {}}
                  onChange={(s) => setField(`${k}_style`, s)}
                />
              </div>
            );
          })}
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
              {page.fields.map((f) => {
                const k = editLang === "en" && page.slug !== "en" ? `${f.key}_en` : f.key;
                return (
                  <p key={k} style={textStyleToCss(content[`${k}_style`] as TextStyle)}>
                    {String(content[k] ?? "") || "(내용을 입력하면 여기에 표시됩니다)"}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
