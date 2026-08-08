"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Field, inputCls, btnCls, btnGhostCls, revalidateSite } from "@/components/admin/ui";
import StyleControls from "@/components/admin/StyleControls";
import { textStyleToCss, type TextStyle } from "@/lib/textstyle";

type ListItemDef = { key: string; label: string; textarea?: boolean };
type PageDef = {
  slug: string;
  label: string;
  fields: { key: string; label: string; rows: number }[];
  list?: { key: string; label: string; item: ListItemDef[] };
};

// each fixed page exposes its editable text fields (style saved as `<key>_style`)
const PAGE_FIELDS: PageDef[] = [
  { slug: "greeting", label: "인사말", fields: [{ key: "body", label: "인사말 본문", rows: 8 }] },
  {
    slug: "vision",
    label: "교회 비전",
    fields: [{ key: "body", label: "비전/소개 본문", rows: 6 }],
    list: {
      key: "cards",
      label: "비전 카드 (3개 권장)",
      item: [
        { key: "emoji", label: "이모지" },
        { key: "title", label: "제목" },
        { key: "desc", label: "설명", textarea: true },
      ],
    },
  },
  {
    slug: "newcomer",
    label: "새가족 안내",
    fields: [{ key: "body", label: "환영 문구", rows: 4 }],
    list: {
      key: "steps",
      label: "새가족 단계 안내",
      item: [
        { key: "title", label: "단계 제목" },
        { key: "desc", label: "설명", textarea: true },
      ],
    },
  },
  { slug: "location", label: "오시는 길", fields: [{ key: "directions", label: "상세 안내", rows: 4 }] },
  { slug: "en", label: "English", fields: [{ key: "body", label: "영어 소개", rows: 5 }] },
];

type Content = Record<string, unknown>;
type ListRow = Record<string, string>;

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
  const list = page.list;
  const content = contents[active] ?? {};
  const listRows = (list ? ((content[list.key] as ListRow[]) ?? []) : []) as ListRow[];

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

  const langSuffix = (key: string) => (editLang === "en" && page.slug !== "en" ? `${key}_en` : key);

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
            const k = langSuffix(f.key);
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

          {/* list section (cards / steps) — shared across languages */}
          {list && editLang === "ko" && (
            <div className="border-t border-spring-50 pt-4">
              <p className="mb-2 text-xs font-semibold text-ink-soft">{list.label}</p>
              <div className="space-y-3">
                {listRows.map((row, i) => (
                  <div key={i} className="rounded-xl border border-spring-100 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-spring-600">{i + 1}</span>
                      <div className="flex gap-2">
                        {i > 0 && (
                          <button
                            className="text-xs text-ink-faint hover:text-ink"
                            onClick={() => {
                              const next = [...listRows];
                              [next[i - 1], next[i]] = [next[i], next[i - 1]];
                              setField(list.key, next);
                            }}
                          >
                            ▲ 위로
                          </button>
                        )}
                        <button
                          className="text-xs text-red-400 hover:text-red-600"
                          onClick={() => setField(list.key, listRows.filter((_, j) => j !== i))}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 space-y-2">
                      {list.item.map((it) =>
                        it.textarea ? (
                          <textarea
                            key={it.key}
                            rows={2}
                            className={inputCls}
                            placeholder={it.label}
                            value={row[it.key] ?? ""}
                            onChange={(e) =>
                              setField(list.key, listRows.map((r, j) => (j === i ? { ...r, [it.key]: e.target.value } : r)))
                            }
                          />
                        ) : (
                          <input
                            key={it.key}
                            className={inputCls}
                            placeholder={it.label}
                            value={row[it.key] ?? ""}
                            onChange={(e) =>
                              setField(list.key, listRows.map((r, j) => (j === i ? { ...r, [it.key]: e.target.value } : r)))
                            }
                          />
                        )
                      )}
                    </div>
                  </div>
                ))}
                <button
                  className={btnGhostCls}
                  onClick={() => setField(list.key, [...listRows, Object.fromEntries(list.item.map((it) => [it.key, ""]))])}
                >
                  + 항목 추가
                </button>
                {listRows.length === 0 && (
                  <p className="text-xs text-ink-faint">
                    * 항목을 추가하지 않으면 현재 사이트의 기본 내용이 그대로 표시됩니다
                  </p>
                )}
              </div>
            </div>
          )}

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
                const k = langSuffix(f.key);
                return (
                  <p key={k} style={textStyleToCss(content[`${k}_style`] as TextStyle)}>
                    {String(content[k] ?? "") || "(내용을 입력하면 여기에 표시됩니다)"}
                  </p>
                );
              })}
              {list && listRows.length > 0 && (
                <div className="mt-5 space-y-3">
                  {listRows.map((row, i) => (
                    <div key={i} className="rounded-xl border border-spring-100 p-4">
                      <p className="font-bold text-ink">
                        {row.emoji ? `${row.emoji} ` : `${i + 1}. `}
                        {row.title}
                      </p>
                      {row.desc && <p className="mt-1 text-sm text-ink-soft">{row.desc}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
