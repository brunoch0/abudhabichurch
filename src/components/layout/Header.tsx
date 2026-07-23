"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  {
    label: "교회소개",
    href: "/about",
    children: [
      { label: "인사말·비전", href: "/about" },
      { label: "섬기는 사람들", href: "/about/people" },
      { label: "예배 안내", href: "/about/worship" },
      { label: "오시는 길", href: "/about/location" },
      { label: "새가족 안내", href: "/about/newcomer" },
    ],
  },
  {
    label: "예배와 말씀",
    href: "/sermons",
    children: [
      { label: "설교 영상", href: "/sermons" },
      { label: "주보", href: "/bulletins" },
    ],
  },
  {
    label: "교회소식",
    href: "/news",
    children: [
      { label: "공지사항", href: "/news" },
      { label: "교회 일정", href: "/calendar" },
    ],
  },
  { label: "문의", href: "/contact", children: [] },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-spring-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-spring-600 text-lg font-bold text-white">
            샘
          </span>
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
          <Link
            href="/en"
            className="ml-2 rounded-full border border-spring-200 px-3 py-1 text-xs font-semibold text-spring-700 transition-colors hover:bg-spring-50"
          >
            EN
          </Link>
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
          <Link
            href="/en"
            className="mt-3 inline-block rounded-full border border-spring-200 px-4 py-1.5 text-sm font-semibold text-spring-700"
            onClick={() => setOpen(false)}
          >
            English
          </Link>
        </nav>
      )}
    </header>
  );
}
