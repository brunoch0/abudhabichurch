"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Field, FileUpload, inputCls, btnCls, btnGhostCls, revalidateSite } from "@/components/admin/ui";

type Banner = {
  id?: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  is_published: boolean;
};

const EMPTY: Banner = {
  title: "",
  description: "",
  image_url: "",
  link_url: "",
  sort_order: 0,
  is_published: true,
};

export default function AdminBanners() {
  const [rows, setRows] = useState<Banner[]>([]);
  const [form, setForm] = useState<Banner>(EMPTY);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await createClient()
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });
    setRows(data ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!form.title || !form.image_url) {
      alert("제목과 이미지를 입력해주세요");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const payload = { ...form, description: form.description || null, link_url: form.link_url || null };
    const { error } = form.id
      ? await supabase.from("banners").update(payload).eq("id", form.id)
      : await supabase.from("banners").insert(payload);
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
    if (!confirm("이 배너를 삭제할까요?")) return;
    await createClient().from("banners").delete().eq("id", id);
    await load();
    revalidateSite();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-sm font-bold text-ink">{form.id ? "배너 수정" : "새 배너 등록"}</h2>
        <p className="mt-1 text-xs text-ink-faint">홈 상단 슬라이드에 노출됩니다 (추후 홈 배너 슬라이드 적용 시)</p>
        <div className="mt-3 space-y-3 rounded-2xl border border-spring-100 bg-white p-5">
          <Field label="이미지 *">
            <div className="flex items-center gap-3">
              <FileUpload folder="banners" accept="image/*" label="이미지 업로드" onUploaded={(url) => setForm({ ...form, image_url: url })} />
              {form.image_url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={form.image_url} alt="" className="h-14 rounded-lg object-cover" />
              )}
            </div>
          </Field>
          <Field label="제목 *">
            <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="설명">
            <input className={inputCls} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="연결 링크 (예: /news/...)">
              <input className={inputCls} value={form.link_url ?? ""} onChange={(e) => setForm({ ...form, link_url: e.target.value })} />
            </Field>
            <Field label="노출 순서 (낮을수록 먼저)">
              <input type="number" className={inputCls} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </Field>
          </div>
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
        <h2 className="text-sm font-bold text-ink">등록된 배너 ({rows.length})</h2>
        <div className="mt-3 divide-y divide-spring-50 rounded-2xl border border-spring-100 bg-white">
          {rows.map((b) => (
            <div key={b.id} className="flex items-center gap-3 px-4 py-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image_url} alt="" className="h-10 w-16 shrink-0 rounded object-cover" />
              <button className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-ink hover:text-spring-700" onClick={() => setForm(b)}>
                {b.title} {!b.is_published && <span className="text-ink-faint">(비공개)</span>}
              </button>
              <button className="shrink-0 text-xs text-red-400 hover:text-red-600" onClick={() => remove(b.id!)}>삭제</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
