"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Field, inputCls, btnCls, revalidateSite } from "@/components/admin/ui";

// each fixed page exposes its editable text fields
const PAGE_FIELDS: { slug: string; label: string; fields: { key: string; label: string; rows: number }[] }[] = [
  { slug: "greeting", label: "인사말", fields: [{ key: "body", label: "인사말 본문", rows: 8 }] },
  { slug: "vision", label: "교회 비전", fields: [{ key: "body", label: "비전/소개 본문", rows: 6 }] },
  { slug: "newcomer", label: "새가족 안내", fields: [{ key: "body", label: "환영 문구", rows: 4 }] },
  { slug: "location", label: "오시는 길", fields: [{ key: "directions", label: "상세 안내", rows: 4 }] },
  { slug: "en", label: "English", fields: [{ key: "body", label: "영어 소개", rows: 5 }] },
];

export default function AdminPages() {
  const [contents, setContents] = useState<Record<string, Record<string, unknown>>>({});
  const [busy, setBusy] = useState("");

  useEffect(() => {
    createClient()
      .from("pages")
      .select("slug, content")
      .then(({ data }) => {
        const map: Record<string, Record<string, unknown>> = {};
        data?.forEach((r) => (map[r.slug] = r.content ?? {}));
        setContents(map);
      });
  }, []);

  async function save(slug: string) {
    setBusy(slug);
    const content = { ...contents[slug], placeholder: false };
    const { error } = await createClient().from("pages").update({ content }).eq("slug", slug);
    setBusy("");
    if (error) {
      alert(`저장 실패: ${error.message}`);
      return;
    }
    revalidateSite();
    alert("저장되었습니다");
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-ink-faint">
        각 페이지의 문구를 수정한 뒤 저장을 누르면 사이트에 바로 반영됩니다.
      </p>
      {PAGE_FIELDS.map((p) => (
        <div key={p.slug} className="rounded-2xl border border-spring-100 bg-white p-5">
          <h2 className="text-sm font-bold text-ink">{p.label}</h2>
          <div className="mt-3 space-y-3">
            {p.fields.map((f) => (
              <Field key={f.key} label={f.label}>
                <textarea
                  rows={f.rows}
                  className={inputCls}
                  value={String(contents[p.slug]?.[f.key] ?? "")}
                  onChange={(e) =>
                    setContents((c) => ({ ...c, [p.slug]: { ...c[p.slug], [f.key]: e.target.value } }))
                  }
                />
              </Field>
            ))}
            <button className={btnCls} disabled={busy === p.slug} onClick={() => save(p.slug)}>
              {busy === p.slug ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
