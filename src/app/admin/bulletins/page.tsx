"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Field, FileUpload, inputCls, btnCls, btnGhostCls, revalidateSite } from "@/components/admin/ui";

type Bulletin = {
  id?: string;
  title: string;
  issue_no: string | null;
  bulletin_date: string;
  cover_image_url: string | null;
  pdf_url: string;
  is_published: boolean;
};

const EMPTY: Bulletin = {
  title: "",
  issue_no: "",
  bulletin_date: new Date().toISOString().slice(0, 10),
  cover_image_url: null,
  pdf_url: "",
  is_published: true,
};

export default function AdminBulletins() {
  const [rows, setRows] = useState<Bulletin[]>([]);
  const [form, setForm] = useState<Bulletin>(EMPTY);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await createClient()
      .from("bulletins")
      .select("*")
      .order("bulletin_date", { ascending: false })
      .limit(100);
    setRows(data ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!form.title || !form.pdf_url) {
      alert("제목과 주보 파일(PDF 또는 이미지)이 필요합니다");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const payload = { ...form, issue_no: form.issue_no || null };
    const { error } = form.id
      ? await supabase.from("bulletins").update(payload).eq("id", form.id)
      : await supabase.from("bulletins").insert(payload);
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
    if (!confirm("이 주보를 삭제할까요?")) return;
    await createClient().from("bulletins").delete().eq("id", id);
    await load();
    revalidateSite();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-sm font-bold text-ink">{form.id ? "주보 수정" : "새 주보 올리기"}</h2>
        <div className="mt-3 space-y-3 rounded-2xl border border-spring-100 bg-white p-5">
          <Field label="제목 * (예: 주일주보 2026년 7월 26일)">
            <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="호수 (예: 제2026-30호)">
              <input className={inputCls} value={form.issue_no ?? ""} onChange={(e) => setForm({ ...form, issue_no: e.target.value })} />
            </Field>
            <Field label="주보 날짜">
              <input type="date" className={inputCls} value={form.bulletin_date} onChange={(e) => setForm({ ...form, bulletin_date: e.target.value })} />
            </Field>
          </div>
          <Field label="주보 파일 * (PDF 또는 이미지)">
            <div className="flex items-center gap-2">
              <FileUpload
                folder="bulletins"
                accept="application/pdf,image/*"
                onUploaded={(url) => setForm((f) => ({ ...f, pdf_url: url, cover_image_url: url.endsWith(".pdf") ? f.cover_image_url : url }))}
              />
              {form.pdf_url && <span className="truncate text-xs text-spring-600">업로드됨 ✓</span>}
            </div>
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
        <h2 className="text-sm font-bold text-ink">등록된 주보 ({rows.length})</h2>
        <div className="mt-3 divide-y divide-spring-50 rounded-2xl border border-spring-100 bg-white">
          {rows.map((b) => (
            <div key={b.id} className="flex items-center gap-3 px-4 py-2.5">
              <button className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-ink hover:text-spring-700" onClick={() => setForm(b)}>
                {b.title} {!b.is_published && <span className="text-ink-faint">(비공개)</span>}
              </button>
              <span className="shrink-0 text-xs text-ink-faint">{b.bulletin_date}</span>
              <button className="shrink-0 text-xs text-red-400 hover:text-red-600" onClick={() => remove(b.id!)}>삭제</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
