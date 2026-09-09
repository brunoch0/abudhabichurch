"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type Popup = {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
};

const HIDE_KEY = "popup-hidden-until";

export default function PopupNotice({ popups }: { popups: Popup[] }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (popups.length === 0) return;
    // "오늘 하루 보지 않기" is stored per popup-set so a new notice still shows
    const raw = localStorage.getItem(HIDE_KEY);
    if (raw) {
      try {
        const { until, ids } = JSON.parse(raw) as { until: number; ids: string[] };
        const sameSet = ids.join(",") === popups.map((p) => p.id).join(",");
        if (sameSet && Date.now() < until) return;
      } catch {
        // malformed value — just show the popup
      }
    }
    setOpen(true);
  }, [popups]);

  if (!open || popups.length === 0) return null;

  const current = popups[Math.min(idx, popups.length - 1)];

  function close() {
    setOpen(false);
  }

  function hideForToday() {
    localStorage.setItem(
      HIDE_KEY,
      JSON.stringify({
        until: Date.now() + 24 * 60 * 60 * 1000,
        ids: popups.map((p) => p.id),
      })
    );
    setOpen(false);
  }

  const image = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={current.image_url}
      alt={current.title || "교회 공지"}
      className="w-full object-contain"
    />
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={current.title || "교회 공지"}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {current.link_url ? (
            <Link href={current.link_url} onClick={close}>
              {image}
            </Link>
          ) : (
            image
          )}

          <button
            type="button"
            onClick={close}
            aria-label="닫기"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
          >
            ✕
          </button>

          {popups.length > 1 && (
            <>
              <button
                type="button"
                aria-label="이전"
                onClick={() => setIdx((i) => (i - 1 + popups.length) % popups.length)}
                className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="다음"
                onClick={() => setIdx((i) => (i + 1) % popups.length)}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
              >
                ›
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {popups.map((p, i) => (
                  <span
                    key={p.id}
                    className={`h-1.5 w-1.5 rounded-full ${i === idx ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-spring-100 px-4 py-3">
          <button
            type="button"
            onClick={hideForToday}
            className="text-sm text-ink-faint hover:text-ink-soft"
          >
            오늘 하루 보지 않기
          </button>
          <button
            type="button"
            onClick={close}
            className="rounded-full bg-spring-600 px-5 py-2 text-sm font-semibold text-white hover:bg-spring-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
