"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Field, FileUpload, inputCls, btnCls, btnGhostCls, revalidateSite } from "@/components/admin/ui";

type News = {
  id?: string;
  title: string;
  content: string;
  images: string[];
  is_pinned: boolean;
  is_published: boolean;
};

const EMPTY: News = { title: "", content: "", images: [], is_pinned: false, is_published: true };

export default function AdminNews() {
  const [rows, setRows] = useState<(News & { published_at: string })[]>([]);
  const [form, setForm] = useState<News>(EMPTY);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await createClient()
      .from("news")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(100);
    setRows(data ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!form.title || !form.content) {
      alert("제목과 내용을 입력해주세요");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const { error } = form.id
      ? await supabase.from("news").update(form).eq("id", form.id)
      : await supabase.from("news").insert(form);
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
    if (!confirm("이 공지를 삭제할까요?")) return;
    await createClient().from("news").delete().eq("id", id);
    await load();
    revalidateSite();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-sm font-bold text-ink">{form.id ? "공지 수정" : "새 공지 작성"}</h2>
        <div className="mt-3 space-y-3 rounded-2xl border border-spring-100 bg-white p-5">
          <Field label="제목 *">
            <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="내용 *">
            <textarea rows={8} className={inputCls} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </Field>
          <Field label="사진 (선택, 여러 장 가능)">
            <div className="flex flex-wrap items-center gap-2">
              <FileUpload folder="news" accept="image/*" label="사진 추가" onUploaded={(url) => setForm((f) => ({ ...f, images: [...f.images, url] }))} />
              {form.images.map((src) => (
                <span key={src} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <button
                    type="button"
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
                    onClick={() => setForm((f) => ({ ...f, images: f.images.filter((s) => s !== src) }))}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </Field>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" checked={form.is_pinned} onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })} />
              상단 고정
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
              공개
            </label>
          </div>
          <div className="flex gap-2">
            <button className={btnCls} disabled={busy} onClick={save}>{form.id ? "수정 저장" : "등록"}</button>
            {form.id && <button className={btnGhostCls} onClick={() => setForm(EMPTY)}>새로 작성</button>}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-ink">등록된 공지 ({rows.length})</h2>
        <div className="mt-3 divide-y divide-spring-50 rounded-2xl border border-spring-100 bg-white">
          {rows.map((n) => (
            <div key={n.id} className="flex items-center gap-3 px-4 py-2.5">
              {n.is_pinned && <span className="shrink-0 rounded bg-spring-600 px-1.5 py-0.5 text-[10px] font-bold text-white">고정</span>}
              <button className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-ink hover:text-spring-700" onClick={() => setForm(n)}>
                {n.title} {!n.is_published && <span className="text-ink-faint">(비공개)</span>}
              </button>
              <button className="shrink-0 text-xs text-red-400 hover:text-red-600" onClick={() => remove(n.id!)}>삭제</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
