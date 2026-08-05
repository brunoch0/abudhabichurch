"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Field, inputCls, btnCls, btnGhostCls, revalidateSite } from "@/components/admin/ui";
import { SERMON_CATEGORIES } from "@/lib/format";

type Sermon = {
  id?: string;
  title: string;
  preacher: string;
  sermon_date: string;
  youtube_url: string;
  category: string;
  scripture: string | null;
  is_published: boolean;
};

const EMPTY: Sermon = {
  title: "",
  preacher: "최재혁 목사",
  sermon_date: new Date().toISOString().slice(0, 10),
  youtube_url: "",
  category: "sunday",
  scripture: "",
  is_published: true,
};

function ytId(url: string) {
  return url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/)?.[1] ?? "";
}

export default function AdminSermons() {
  const [rows, setRows] = useState<Sermon[]>([]);
  const [form, setForm] = useState<Sermon>(EMPTY);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await createClient()
      .from("sermons")
      .select("*")
      .order("sermon_date", { ascending: false })
      .limit(100);
    setRows(data ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!form.title || !form.youtube_url) {
      alert("제목과 유튜브 링크를 입력해주세요");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const payload = { ...form, youtube_id: ytId(form.youtube_url), scripture: form.scripture || null };
    const { error } = form.id
      ? await supabase.from("sermons").update(payload).eq("id", form.id)
      : await supabase.from("sermons").insert(payload);
    setBusy(false);
    if (error) {
      alert(`저장 실패: ${error.message}`);
      return;
    }
    setForm(EMPTY);
    await load();
    revalidateSite();
  }

  async function remove(id: string) {
    if (!confirm("이 설교를 삭제할까요?")) return;
    await createClient().from("sermons").delete().eq("id", id);
    await load();
    revalidateSite();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-sm font-bold text-ink">{form.id ? "설교 수정" : "새 설교 등록"}</h2>
        <div className="mt-3 space-y-3 rounded-2xl border border-spring-100 bg-white p-5">
          <Field label="유튜브 링크 *">
            <input className={inputCls} value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} placeholder="https://youtu.be/..." />
          </Field>
          <Field label="제목 *">
            <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="설교자">
              <input className={inputCls} value={form.preacher} onChange={(e) => setForm({ ...form, preacher: e.target.value })} />
            </Field>
            <Field label="날짜">
              <input type="date" className={inputCls} value={form.sermon_date} onChange={(e) => setForm({ ...form, sermon_date: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="분류">
              <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {Object.entries(SERMON_CATEGORIES).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </Field>
            <Field label="본문 말씀">
              <input className={inputCls} value={form.scripture ?? ""} onChange={(e) => setForm({ ...form, scripture: e.target.value })} placeholder="창 46:1-6" />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            공개
          </label>
          <div className="flex gap-2">
            <button className={btnCls} disabled={busy} onClick={save}>{form.id ? "수정 저장" : "등록"}</button>
            {form.id && (
              <button className={btnGhostCls} onClick={() => setForm(EMPTY)}>새로 작성</button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-ink">등록된 설교 ({rows.length})</h2>
        <div className="mt-3 max-h-[70vh] divide-y divide-spring-50 overflow-y-auto rounded-2xl border border-spring-100 bg-white">
          {rows.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className="shrink-0 rounded bg-spring-50 px-2 py-0.5 text-[11px] font-bold text-spring-700">
                {SERMON_CATEGORIES[s.category]}
              </span>
              <button className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-ink hover:text-spring-700" onClick={() => setForm(s)}>
                {s.title} {!s.is_published && <span className="text-ink-faint">(비공개)</span>}
              </button>
              <span className="shrink-0 text-xs text-ink-faint">{s.sermon_date}</span>
              <button className="shrink-0 text-xs text-red-400 hover:text-red-600" onClick={() => remove(s.id!)}>삭제</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
