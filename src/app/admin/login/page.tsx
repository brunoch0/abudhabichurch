"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(mode: "login" | "signup") {
    setBusy(true);
    setError("");
    const supabase = createClient();
    const fn =
      mode === "login"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });
    const { error } = await fn;
    setBusy(false);
    if (error) {
      const raw = error.message || "";
      const msg = raw.includes("Invalid login")
        ? "이메일 또는 비밀번호가 올바르지 않습니다. 처음이시면 '최초 가입'을 눌러주세요."
        : mode === "signup"
          ? "허용되지 않은 이메일입니다. 관리자에게 문의하세요."
          : raw.includes("Email not confirmed")
            ? "이메일 인증이 필요합니다. 받은편지함을 확인해주세요."
            : "로그인에 실패했습니다. 다시 시도해주세요.";
      setError(msg);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit("login");
        }}
        className="w-full max-w-sm rounded-2xl border border-spring-100 bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-bold text-ink">관리자 로그인</h1>
        <p className="mt-1 text-xs text-ink-faint">등록된 관리자 이메일만 사용할 수 있습니다</p>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          className="mt-5 w-full rounded-xl border border-spring-200 px-4 py-2.5 text-sm outline-none focus:border-spring-400"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 (6자 이상)"
          className="mt-3 w-full rounded-xl border border-spring-200 px-4 py-2.5 text-sm outline-none focus:border-spring-400"
        />
        {error && <p className="mt-3 text-sm font-semibold text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-full bg-spring-600 py-2.5 font-semibold text-white disabled:opacity-60"
        >
          로그인
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => submit("signup")}
          className="mt-2 w-full rounded-full border border-spring-200 py-2.5 text-sm font-semibold text-spring-700 disabled:opacity-60"
        >
          최초 가입 (처음 한 번만)
        </button>
      </form>
    </div>
  );
}
