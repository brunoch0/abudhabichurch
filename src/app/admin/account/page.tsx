"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Field, inputCls, btnCls } from "@/components/admin/ui";

export default function AdminAccount() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setEmail(user?.email ?? ""));
  }, []);

  async function changePassword() {
    setMsg(null);
    if (pw.length < 6) {
      setMsg({ ok: false, text: "비밀번호는 6자 이상이어야 합니다." });
      return;
    }
    if (pw !== pw2) {
      setMsg({ ok: false, text: "비밀번호가 서로 일치하지 않습니다." });
      return;
    }
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password: pw });
    setBusy(false);
    if (error) {
      setMsg({ ok: false, text: `변경 실패: ${error.message}` });
      return;
    }
    setPw("");
    setPw2("");
    setMsg({ ok: true, text: "비밀번호가 변경되었습니다. 다음 로그인부터 새 비밀번호를 사용하세요." });
  }

  return (
    <div className="max-w-md">
      <div className="rounded-2xl border border-spring-100 bg-white p-6">
        <h2 className="text-sm font-bold text-ink">내 계정</h2>
        <p className="mt-1 text-sm text-ink-soft">{email}</p>

        <div className="mt-6 space-y-3">
          <Field label="새 비밀번호 (6자 이상)">
            <input type="password" className={inputCls} value={pw} onChange={(e) => setPw(e.target.value)} />
          </Field>
          <Field label="새 비밀번호 확인">
            <input type="password" className={inputCls} value={pw2} onChange={(e) => setPw2(e.target.value)} />
          </Field>
          {msg && (
            <p className={`text-sm font-semibold ${msg.ok ? "text-spring-600" : "text-red-500"}`}>
              {msg.text}
            </p>
          )}
          <button className={btnCls} disabled={busy} onClick={changePassword}>
            {busy ? "변경 중..." : "비밀번호 변경"}
          </button>
        </div>
      </div>
    </div>
  );
}
