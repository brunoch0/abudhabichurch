"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Field, FileUpload, inputCls, btnCls, btnGhostCls, revalidateSite } from "@/components/admin/ui";
import { DEFAULT_WEB_DATA, type WebBulletinData } from "@/lib/bulletin";

type Bulletin = {
  id?: string;
  title: string;
  issue_no: string | null;
  bulletin_date: string;
  cover_image_url: string | null;
  pdf_url: string | null;
  type: "file" | "web";
  data: WebBulletinData | Record<string, never>;
  is_published: boolean;
};

const EMPTY: Bulletin = {
  title: "",
  issue_no: "",
  bulletin_date: new Date().toISOString().slice(0, 10),
  cover_image_url: null,
  pdf_url: null,
  type: "file",
  data: {},
  is_published: true,
};

export default function AdminBulletins() {
  const [rows, setRows] = useState<Bulletin[]>([]);
  const [form, setForm] = useState<Bulletin>(EMPTY);
  const [busy, setBusy] = useState(false);

  const web = (form.data && "worship_order" in form.data ? form.data : DEFAULT_WEB_DATA) as WebBulletinData;
  const setWeb = (patch: Partial<WebBulletinData>) =>
    setForm((f) => ({ ...f, data: { ...(f.data as WebBulletinData), ...patch } }));

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

  function startWeb() {
    // prefill from the most recent web bulletin so only contents need updating
    const lastWeb = rows.find((r) => r.type === "web");
    setForm({
      ...EMPTY,
      type: "web",
      title: "",
      data: lastWeb ? (lastWeb.data as WebBulletinData) : DEFAULT_WEB_DATA,
    });
  }

  async function save() {
    if (!form.title) {
      alert("제목을 입력해주세요");
      return;
    }
    if (form.type === "file" && !form.pdf_url) {
      alert("주보 파일(PDF 또는 이미지)을 업로드해주세요");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const payload = {
      ...form,
      issue_no: form.issue_no || null,
      data: form.type === "web" ? web : {},
    };
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

  const rowEdit = <T,>(list: T[], i: number, patch: Partial<T>) =>
    list.map((x, j) => (j === i ? { ...x, ...patch } : x));

  return (
    <div className="grid gap-8 xl:grid-cols-2">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-ink">{form.id ? "주보 수정" : "새 주보"}</h2>
          {!form.id && (
            <div className="ml-auto flex gap-1.5">
              <button
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${form.type === "file" ? "bg-spring-600 text-white" : "bg-spring-50 text-ink-soft"}`}
                onClick={() => setForm({ ...EMPTY, type: "file" })}
              >
                파일 업로드형
              </button>
              <button
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${form.type === "web" ? "bg-spring-600 text-white" : "bg-spring-50 text-ink-soft"}`}
                onClick={startWeb}
              >
                웹 주보 작성형
              </button>
            </div>
          )}
        </div>

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

          {form.type === "file" ? (
            <Field label="주보 파일 * (외부에서 만든 이미지 또는 PDF)">
              <div className="flex items-center gap-2">
                <FileUpload
                  folder="bulletins"
                  accept="application/pdf,image/*"
                  onUploaded={(url) => setForm((f) => ({ ...f, pdf_url: url, cover_image_url: url.toLowerCase().endsWith(".pdf") ? f.cover_image_url : url }))}
                />
                {form.pdf_url && <span className="truncate text-xs text-spring-600">업로드됨 ✓</span>}
              </div>
            </Field>
          ) : (
            <div className="space-y-4 border-t border-spring-50 pt-4">
              <p className="text-xs text-ink-faint">
                기존 주보 양식 그대로, 내용만 바꾸면 됩니다. 새 주보를 만들면 지난 웹 주보 내용을 자동으로 불러옵니다.
              </p>
              <Field label="주차 표기 (예: 성령강림 후 제8주)">
                <input className={inputCls} value={web.week_label} onChange={(e) => setWeb({ week_label: e.target.value })} />
              </Field>

              <div>
                <p className="mb-1 text-xs font-semibold text-ink-soft">주일예배 순서 (내용만 입력)</p>
                <div className="space-y-1.5">
                  {web.worship_order.map((r, i) => (
                    <div key={i} className="grid grid-cols-[7rem_1fr_auto] items-center gap-2">
                      <input className={inputCls} value={r.name} onChange={(e) => setWeb({ worship_order: rowEdit(web.worship_order, i, { name: e.target.value }) })} />
                      <input className={inputCls} placeholder="내용 (찬송 번호, 본문, 설교 제목 등)" value={r.content} onChange={(e) => setWeb({ worship_order: rowEdit(web.worship_order, i, { content: e.target.value }) })} />
                      <button className="text-xs text-red-400" onClick={() => setWeb({ worship_order: web.worship_order.filter((_, j) => j !== i) })}>✕</button>
                    </div>
                  ))}
                  <button className={btnGhostCls} onClick={() => setWeb({ worship_order: [...web.worship_order, { name: "", content: "", name_en: "" }] })}>+ 순서 추가</button>
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold text-ink-soft">예배안내</p>
                <div className="space-y-1.5">
                  {web.worship_info.map((r, i) => (
                    <div key={i} className="grid grid-cols-[7rem_1fr_1fr_auto] items-center gap-2">
                      <input className={inputCls} value={r.name} onChange={(e) => setWeb({ worship_info: rowEdit(web.worship_info, i, { name: e.target.value }) })} />
                      <input className={inputCls} placeholder="시간" value={r.time} onChange={(e) => setWeb({ worship_info: rowEdit(web.worship_info, i, { time: e.target.value }) })} />
                      <input className={inputCls} placeholder="장소" value={r.place} onChange={(e) => setWeb({ worship_info: rowEdit(web.worship_info, i, { place: e.target.value }) })} />
                      <button className="text-xs text-red-400" onClick={() => setWeb({ worship_info: web.worship_info.filter((_, j) => j !== i) })}>✕</button>
                    </div>
                  ))}
                  <button className={btnGhostCls} onClick={() => setWeb({ worship_info: [...web.worship_info, { name: "", time: "", place: "" }] })}>+ 행 추가</button>
                </div>
              </div>

              <Field label="맑은샘소식 (새가족 환영 문구 등)">
                <textarea rows={3} className={inputCls} value={web.news_intro} onChange={(e) => setWeb({ news_intro: e.target.value })} />
              </Field>

              <div>
                <p className="mb-1 text-xs font-semibold text-ink-soft">광고 (번호는 자동으로 붙습니다)</p>
                <div className="space-y-2">
                  {web.ads.map((ad, i) => (
                    <div key={i} className="rounded-xl border border-spring-100 p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-spring-600">{i + 1}.</span>
                        <input className={inputCls} placeholder="광고 제목" value={ad.title} onChange={(e) => setWeb({ ads: rowEdit(web.ads, i, { title: e.target.value }) })} />
                        <button className="text-xs text-red-400" onClick={() => setWeb({ ads: web.ads.filter((_, j) => j !== i) })}>✕</button>
                      </div>
                      <textarea rows={2} className={`${inputCls} mt-2`} placeholder="세부 내용" value={ad.body} onChange={(e) => setWeb({ ads: rowEdit(web.ads, i, { body: e.target.value }) })} />
                    </div>
                  ))}
                  <button className={btnGhostCls} onClick={() => setWeb({ ads: [...web.ads, { title: "", body: "" }] })}>+ 광고 추가</button>
                </div>
              </div>

              <Field label="이웃과 함께하는 맑은샘모임">
                <textarea rows={3} className={inputCls} value={web.moim} onChange={(e) => setWeb({ moim: e.target.value })} />
              </Field>
              <Field label="헌금안내">
                <textarea rows={3} className={inputCls} value={web.offering} onChange={(e) => setWeb({ offering: e.target.value })} />
              </Field>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            공개
          </label>
          <div className="flex gap-2">
            <button className={btnCls} disabled={busy} onClick={save}>{form.id ? "수정 저장" : "발행"}</button>
            {form.id && <button className={btnGhostCls} onClick={() => setForm(EMPTY)}>새로 작성</button>}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-ink">등록된 주보 ({rows.length})</h2>
        <div className="mt-3 divide-y divide-spring-50 rounded-2xl border border-spring-100 bg-white">
          {rows.map((b) => (
            <div key={b.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${b.type === "web" ? "bg-spring-100 text-spring-700" : "bg-spring-50 text-ink-faint"}`}>
                {b.type === "web" ? "웹" : "파일"}
              </span>
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
