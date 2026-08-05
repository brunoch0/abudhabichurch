"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Field, inputCls, btnCls, btnGhostCls, revalidateSite } from "@/components/admin/ui";

const CATEGORIES: Record<string, string> = {
  general: "일반",
  worship: "예배",
  education: "교육",
  community: "공동체",
  mission: "선교",
};

type Ev = {
  id?: string;
  title: string;
  description: string | null;
  location: string | null;
  category: string;
  starts_at: string;
  ends_at: string | null;
  is_published: boolean;
};

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

const EMPTY: Ev = {
  title: "",
  description: "",
  location: "",
  category: "general",
  starts_at: "",
  ends_at: null,
  is_published: true,
};

export default function AdminCalendar() {
  const [rows, setRows] = useState<Ev[]>([]);
  const [form, setForm] = useState<Ev>(EMPTY);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await createClient()
      .from("calendar_events")
      .select("*")
      .order("starts_at", { ascending: false })
      .limit(100);
    setRows(data ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!form.title || !form.starts_at) {
      alert("제목과 시작 일시를 입력해주세요");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const payload = {
      ...form,
      description: form.description || null,
      location: form.location || null,
      starts_at: new Date(form.starts_at).toISOString(),
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
    };
    const { error } = form.id
      ? await supabase.from("calendar_events").update(payload).eq("id", form.id)
      : await supabase.from("calendar_events").insert(payload);
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
    if (!confirm("이 일정을 삭제할까요?")) return;
    await createClient().from("calendar_events").delete().eq("id", id);
    await load();
    revalidateSite();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-sm font-bold text-ink">{form.id ? "일정 수정" : "새 일정 등록"}</h2>
        <div className="mt-3 space-y-3 rounded-2xl border border-spring-100 bg-white p-5">
          <Field label="제목 *">
            <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="시작 일시 *">
              <input type="datetime-local" className={inputCls} value={toLocalInput(form.starts_at) || form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
            </Field>
            <Field label="종료 일시 (선택)">
              <input type="datetime-local" className={inputCls} value={toLocalInput(form.ends_at)} onChange={(e) => setForm({ ...form, ends_at: e.target.value || null })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="장소">
              <input className={inputCls} value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Field>
            <Field label="분류">
              <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {Object.entries(CATEGORIES).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="설명">
            <textarea rows={3} className={inputCls} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            공개
          </label>
          <div className="flex gap-2">
            <button className={btnCls} disabled={busy} onClick={save}>{form.id ? "수정 저장" : "등록"}</button>
            {form.id && <button className={btnGhostCls} onClick={() => setForm(EMPTY)}>새로 작성</button>}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-ink">등록된 일정 ({rows.length})</h2>
        <div className="mt-3 divide-y divide-spring-50 rounded-2xl border border-spring-100 bg-white">
          {rows.map((ev) => (
            <div key={ev.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className="shrink-0 rounded bg-spring-50 px-2 py-0.5 text-[11px] font-bold text-spring-700">
                {CATEGORIES[ev.category] ?? ev.category}
              </span>
              <button className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-ink hover:text-spring-700" onClick={() => setForm(ev)}>
                {ev.title}
              </button>
              <span className="shrink-0 text-xs text-ink-faint">{new Date(ev.starts_at).toLocaleDateString("ko-KR")}</span>
              <button className="shrink-0 text-xs text-red-400 hover:text-red-600" onClick={() => remove(ev.id!)}>삭제</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
