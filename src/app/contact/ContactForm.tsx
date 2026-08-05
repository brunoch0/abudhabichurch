"use client";

import { useActionState, useEffect, useState } from "react";
import { dict, pickLang, type Lang } from "@/lib/i18n";
import { submitInquiry, type ContactFormState } from "./actions";

const initialState: ContactFormState = { status: "idle", message: "" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState);
  const [lang, setLang] = useState<Lang>("ko");
  useEffect(() => {
    setLang(pickLang(document.cookie.match(/(?:^|; )lang=([^;]*)/)?.[1]));
  }, []);
  const t = dict[lang].contact;

  if (state.status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-spring-100 bg-white p-10 text-center shadow-sm">
        <p className="text-4xl">✅</p>
        <p className="mt-4 text-lg font-bold text-ink">{t.done}</p>
        <p className="mt-2 text-sm text-ink-soft">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-ink">
            {t.name} <span className="text-red-400">*</span>
          </span>
          <input
            type="text"
            name="name"
            required
            maxLength={100}
            className="mt-1.5 w-full rounded-xl border border-spring-200 px-4 py-2.5 text-sm outline-none focus:border-spring-400"
            placeholder={t.name}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">
            {t.contactField} <span className="text-red-400">*</span>
          </span>
          <input
            type="text"
            name="contact"
            required
            maxLength={100}
            className="mt-1.5 w-full rounded-xl border border-spring-200 px-4 py-2.5 text-sm outline-none focus:border-spring-400"
            placeholder={t.contactPlaceholder}
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="text-sm font-semibold text-ink">{t.email}</span>
        <input
          type="email"
          name="email"
          maxLength={200}
          className="mt-1.5 w-full rounded-xl border border-spring-200 px-4 py-2.5 text-sm outline-none focus:border-spring-400"
          placeholder={t.emailPlaceholder}
        />
      </label>
      <label className="mt-4 block">
        <span className="text-sm font-semibold text-ink">
          {t.message} <span className="text-red-400">*</span>
        </span>
        <textarea
          name="message"
          required
          rows={6}
          maxLength={2000}
          className="mt-1.5 w-full resize-none rounded-xl border border-spring-200 px-4 py-2.5 text-sm outline-none focus:border-spring-400"
          placeholder={t.messagePlaceholder}
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
        {pending ? t.submitting : t.submit}
      </button>
    </form>
  );
}
