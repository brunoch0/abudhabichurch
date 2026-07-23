"use client";

import { useActionState } from "react";
import { submitInquiry, type ContactFormState } from "./actions";

const initialState: ContactFormState = { status: "idle", message: "" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState);

  if (state.status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-spring-100 bg-white p-10 text-center shadow-sm">
        <p className="text-4xl">✅</p>
        <p className="mt-4 text-lg font-bold text-ink">접수 완료</p>
        <p className="mt-2 text-sm text-ink-soft">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-ink">
            이름 <span className="text-red-400">*</span>
          </span>
          <input
            type="text"
            name="name"
            required
            maxLength={100}
            className="mt-1.5 w-full rounded-xl border border-spring-200 px-4 py-2.5 text-sm outline-none focus:border-spring-400"
            placeholder="성함을 입력해주세요"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">
            연락처 <span className="text-red-400">*</span>
          </span>
          <input
            type="text"
            name="contact"
            required
            maxLength={100}
            className="mt-1.5 w-full rounded-xl border border-spring-200 px-4 py-2.5 text-sm outline-none focus:border-spring-400"
            placeholder="전화번호 또는 카카오톡 ID"
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="text-sm font-semibold text-ink">이메일 (선택)</span>
        <input
          type="email"
          name="email"
          maxLength={200}
          className="mt-1.5 w-full rounded-xl border border-spring-200 px-4 py-2.5 text-sm outline-none focus:border-spring-400"
          placeholder="답변받을 이메일 주소"
        />
      </label>
      <label className="mt-4 block">
        <span className="text-sm font-semibold text-ink">
          문의 내용 <span className="text-red-400">*</span>
        </span>
        <textarea
          name="message"
          required
          rows={6}
          maxLength={2000}
          className="mt-1.5 w-full resize-none rounded-xl border border-spring-200 px-4 py-2.5 text-sm outline-none focus:border-spring-400"
          placeholder="궁금하신 내용을 자유롭게 적어주세요"
        />
      </label>
      {/* honeypot field — hidden from humans */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {state.status === "error" && (
        <p className="mt-3 text-sm font-semibold text-red-500">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full rounded-full bg-spring-600 py-3 font-semibold text-white transition-colors hover:bg-spring-700 disabled:opacity-60"
      >
        {pending ? "접수 중..." : "문의 보내기"}
      </button>
    </form>
  );
}
