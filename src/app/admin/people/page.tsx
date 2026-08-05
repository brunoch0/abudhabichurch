"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Field, FileUpload, inputCls, btnCls, btnGhostCls, revalidateSite } from "@/components/admin/ui";

type Member = { role: string; name: string; phone?: string; photo_url?: string };

export default function AdminPeople() {
  const [members, setMembers] = useState<Member[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    createClient()
      .from("pages")
      .select("content")
      .eq("slug", "people")
      .maybeSingle()
      .then(({ data }) => {
        const c = data?.content as { members?: Member[] } | null;
        setMembers(c?.members ?? []);
      });
  }, []);

  const edit = (i: number, patch: Partial<Member>) =>
    setMembers(members.map((m, j) => (j === i ? { ...m, ...patch } : m)));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= members.length) return;
    const next = [...members];
    [next[i], next[j]] = [next[j], next[i]];
    setMembers(next);
  };

  async function save() {
    setBusy(true);
    const { error } = await createClient()
      .from("pages")
      .update({ content: { members, placeholder: false } })
      .eq("slug", "people");
    setBusy(false);
    if (error) {
      alert(`저장 실패: ${error.message}`);
      return;
    }
    revalidateSite();
    alert("저장되었습니다. 사이트에 바로 반영됩니다.");
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-ink">섬기는 사람들 ({members.length}명)</h2>
        <button
          className={btnGhostCls}
          onClick={() => setMembers([...members, { role: "", name: "", phone: "" }])}
        >
          + 사람 추가
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {members.map((m, i) => (
          <div key={i} className="rounded-2xl border border-spring-100 bg-white p-4">
            <div className="flex items-start gap-4">
              <div className="shrink-0 text-center">
                {m.photo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={m.photo_url} alt="" className="h-20 w-20 rounded-full object-cover" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-spring-100 text-2xl">
                    👤
                  </div>
                )}
                <div className="mt-2 flex flex-col gap-1">
                  <FileUpload
                    folder="people"
                    accept="image/*"
                    label={m.photo_url ? "사진 변경" : "사진 첨부"}
                    onUploaded={(url) => edit(i, { photo_url: url })}
                  />
                  {m.photo_url && (
                    <button className="text-xs text-red-400" onClick={() => edit(i, { photo_url: undefined })}>
                      사진 삭제
                    </button>
                  )}
                </div>
              </div>

              <div className="grid flex-1 gap-3 sm:grid-cols-3">
                <Field label="직분 (예: 담임목사, 장로)">
                  <input className={inputCls} value={m.role} onChange={(e) => edit(i, { role: e.target.value })} />
                </Field>
                <Field label="이름">
                  <input className={inputCls} value={m.name} onChange={(e) => edit(i, { name: e.target.value })} />
                </Field>
                <Field label="연락처 (선택)">
                  <input className={inputCls} value={m.phone ?? ""} onChange={(e) => edit(i, { phone: e.target.value })} />
                </Field>
              </div>

              <div className="flex shrink-0 flex-col gap-1 text-xs">
                <button className="text-ink-soft hover:text-spring-700" onClick={() => move(i, -1)}>▲</button>
                <button className="text-ink-soft hover:text-spring-700" onClick={() => move(i, 1)}>▼</button>
                <button
                  className="mt-2 text-red-400 hover:text-red-600"
                  onClick={() => confirm(`${m.name || "이 항목"}을(를) 삭제할까요?`) && setMembers(members.filter((_, j) => j !== i))}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className={`${btnCls} mt-5`} disabled={busy} onClick={save}>
        {busy ? "저장 중..." : "저장 (사이트 반영)"}
      </button>
    </div>
  );
}
