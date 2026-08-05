"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export const inputCls =
  "w-full rounded-xl border border-spring-200 px-3.5 py-2 text-sm outline-none focus:border-spring-400";
export const btnCls =
  "rounded-full bg-spring-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50";
export const btnGhostCls =
  "rounded-full border border-spring-200 px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-spring-50";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

/** upload to the public media bucket, returns public URL */
export function FileUpload({
  folder,
  accept,
  onUploaded,
  label = "파일 업로드",
}: {
  folder: string;
  accept: string;
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          const supabase = createClient();
          const ext = file.name.split(".").pop();
          const path = `${folder}/${Date.now()}.${ext}`;
          const { error } = await supabase.storage.from("media").upload(path, file);
          setBusy(false);
          if (error) {
            alert(`업로드 실패: ${error.message}`);
            return;
          }
          const { data } = supabase.storage.from("media").getPublicUrl(path);
          onUploaded(data.publicUrl);
        }}
      />
      <button type="button" disabled={busy} onClick={() => ref.current?.click()} className={btnGhostCls}>
        {busy ? "업로드 중..." : label}
      </button>
    </>
  );
}

/** ask Next to drop its page cache so public pages show the change immediately */
export async function revalidateSite() {
  await fetch("/api/revalidate", { method: "POST" }).catch(() => {});
}
