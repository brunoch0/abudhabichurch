"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Field, FileUpload, inputCls, btnCls, btnGhostCls, revalidateSite } from "@/components/admin/ui";

type Popup = {
  id?: string;
  title: string;
  image_url: string;
  link_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
  is_published: boolean;
};

const EMPTY: Popup = {
  title: "",
  image_url: "",
  link_url: "",
  starts_at: null,
  ends_at: null,
  sort_order: 0,
  is_published: true,
};

export default function AdminPopups() {
  const [rows, setRows] = useState<Popup[]>([]);
  const [form, setForm] = useState<Popup>(EMPTY);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await createClient()
      .from("popups")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setRows(data ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!form.image_url) {
      alert("팝업 이미지를 업로드해주세요");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const payload = {
      ...form,
      link_url: form.link_url || null,
      starts_at: form.starts_at || null,
      ends_at: form.ends_at || null,
    };
    const { error } = form.id
      ? await supabase.from("popups").update(payload).eq("id", form.id)
      : await supabase.from("popups").insert(payload);
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
    if (!confirm("이 팝업을 삭제할까요?")) return;
    await createClient().from("popups").delete().eq("id", id);
    await load();
    revalidateSite();
  }

  async function togglePublish(p: Popup) {
    await createClient().from("popups").update({ is_published: !p.is_published }).eq("id", p.id!);
    await load();
    revalidateSite();
  }

  const today = new Date().toISOString().slice(0, 10);
  const isActive = (p: Popup) =>
    p.is_published && (!p.starts_at || p.starts_at <= today) && (!p.ends_at || p.ends_at >= today);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-sm font-bold text-ink">{form.id ? "팝업 수정" : "새 팝업 등록"}</h2>
        <p className="mt-1 text-xs text-ink-faint">
          홈 화면에 처음 들어올 때 뜨는 공지창입니다. 방문자는 &ldquo;오늘 하루 보지 않기&rdquo;를 누를 수 있습니다.
        </p>
        <div className="mt-3 space-y-3 rounded-2xl border border-spring-100 bg-white p-5">
          <Field label="팝업 이미지 * (포스터 이미지를 그대로 올리시면 됩니다)">
            <div className="flex items-center gap-3">
              <FileUpload
                folder="popups"
                accept="image/*"
                label="이미지 업로드"
                onUploaded={(url) => setForm((f) => ({ ...f, image_url: url }))}
              />
              {form.image_url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={form.image_url} alt="" className="h-16 rounded-lg object-cover" />
              )}
            </div>
          </Field>
          <Field label="제목 (관리용, 화면에는 안 보입니다)">
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="예: 창립기념 감사예배"
            />
          </Field>
          <Field label="클릭 시 이동할 주소 (선택)">
            <input
              className={inputCls}
              value={form.link_url ?? ""}
              onChange={(e) => setForm({ ...form, link_url: e.target.value })}
              placeholder="예: /news  ·  비워두면 이동하지 않습니다"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="노출 시작일 (선택)">
              <input
                type="date"
                className={inputCls}
                value={form.starts_at ?? ""}
                onChange={(e) => setForm({ ...form, starts_at: e.target.value || null })}
              />
            </Field>
            <Field label="노출 종료일 (선택)">
              <input
                type="date"
                className={inputCls}
                value={form.ends_at ?? ""}
                onChange={(e) => setForm({ ...form, ends_at: e.target.value || null })}
              />
            </Field>
          </div>
          <p className="text-xs text-ink-faint">
            * 종료일을 지정하면 그날이 지나면 자동으로 사라집니다. 비워두면 계속 노출됩니다.
          </p>
          <Field label="노출 순서 (숫자가 작을수록 먼저)">
            <input
              type="number"
              className={inputCls}
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            공개 (체크를 풀면 팝업이 뜨지 않습니다)
          </label>
          <div className="flex gap-2">
            <button className={btnCls} disabled={busy} onClick={save}>
              {form.id ? "수정 저장" : "등록"}
            </button>
            {form.id && (
              <button className={btnGhostCls} onClick={() => setForm(EMPTY)}>
                새로 작성
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-ink">등록된 팝업 ({rows.length})</h2>
        <div className="mt-3 space-y-2">
          {rows.length === 0 && (
            <p className="rounded-2xl border border-spring-100 bg-white px-5 py-8 text-center text-sm text-ink-faint">
              등록된 팝업이 없습니다
            </p>
          )}
          {rows.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-spring-100 bg-white p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image_url} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <button
                  className="block truncate text-left text-sm font-semibold text-ink hover:text-spring-700"
                  onClick={() => setForm(p)}
                >
                  {p.title || "(제목 없음)"}
                </button>
                <p className="mt-0.5 text-xs text-ink-faint">
                  {isActive(p) ? (
                    <span className="font-bold text-spring-600">● 노출 중</span>
                  ) : (
                    <span>○ 노출 안 함</span>
                  )}
                  {(p.starts_at || p.ends_at) && ` · ${p.starts_at ?? ""} ~ ${p.ends_at ?? ""}`}
                </p>
              </div>
              <button
                className="shrink-0 rounded-full border border-spring-200 px-3 py-1 text-xs font-semibold text-ink-soft hover:bg-spring-50"
                onClick={() => togglePublish(p)}
              >
                {p.is_published ? "숨기기" : "보이기"}
              </button>
              <button
                className="shrink-0 text-xs text-red-400 hover:text-red-600"
                onClick={() => remove(p.id!)}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
