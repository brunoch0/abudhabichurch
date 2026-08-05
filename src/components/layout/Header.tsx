"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { dict, pickLang, type Lang } from "@/lib/i18n";

function readLang(): Lang {
  if (typeof document === "undefined") return "ko";
  return pickLang(document.cookie.match(/(?:^|; )lang=([^;]*)/)?.[1]);
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("ko");

  useEffect(() => {
    setLang(readLang());
  }, []);

  const t = dict[lang];

  const NAV = [
    {
      label: t.nav.about,
      href: "/about",
      children: [
        { label: t.nav.aboutGreeting, href: "/about" },
        { label: t.nav.aboutPeople, href: "/about/people" },
        { label: t.nav.aboutWorship, href: "/about/worship" },
        { label: t.nav.aboutLocation, href: "/about/location" },
        { label: t.nav.aboutNewcomer, href: "/about/newcomer" },
      ],
    },
    {
      label: t.nav.worship,
      href: "/sermons",
      children: [{ label: t.nav.sermons, href: "/sermons" }],
    },
    {
      label: t.nav.news_group,
      href: "/news",
      children: [
        { label: t.nav.news, href: "/news" },
        { label: t.nav.bulletins, href: "/bulletins" },
        { label: t.nav.calendar, href: "/calendar" },
      ],
    },
    { label: t.nav.contact, href: "/contact", children: [] },
  ];

  function toggleLang() {
    const next = lang === "ko" ? "en" : "ko";
    document.cookie = `lang=${next}; path=/; max-age=31536000`;
    setLang(next);
    setOpen(false);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-spring-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-malgeunsaem.png"
            alt="맑은샘교회 로고"
            className="h-10 w-11 rounded-lg bg-black object-contain"
          />
          <span className="leading-tight">
            <span className="block text-[15px] font-bold tracking-tight">
              아부다비 맑은샘 한인교회
            </span>
            <span className="block text-[11px] text-ink-faint">
              Korean Methodist Church of Abu Dhabi
            </span>
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className={`rounded-lg px-4 py-2 text-[15px] font-medium transition-colors hover:bg-spring-50 hover:text-spring-700 ${
                  pathname.startsWith(item.href) ? "text-spring-700" : "text-ink-soft"
                }`}
              >
                {item.label}
              </Link>
              {item.children.length > 0 && (
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                  <div className="min-w-40 rounded-xl border border-spring-100 bg-white p-2 shadow-lg shadow-spring-950/5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-spring-50 hover:text-spring-700"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={toggleLang}
            className="ml-2 rounded-full border border-spring-200 px-3 py-1 text-xs font-semibold text-spring-700 transition-colors hover:bg-spring-50"
          >
            {lang === "ko" ? "EN" : "한국어"}
          </button>
        </nav>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label="메뉴 열기"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-soft md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* mobile nav */}
      {open && (
        <nav className="border-t border-spring-100 bg-white px-4 pb-4 md:hidden">
          {NAV.map((item) => (
            <div key={item.href} className="border-b border-spring-50 py-2">
              <Link
                href={item.href}
                className="block py-1.5 font-semibold text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block py-1.5 pl-3 text-sm text-ink-soft"
                  onClick={() => setOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={toggleLang}
            className="mt-3 inline-block rounded-full border border-spring-200 px-4 py-1.5 text-sm font-semibold text-spring-700"
          >
            {lang === "ko" ? "English" : "한국어"}
          </button>
        </nav>
      )}
    </header>
  );
}
