"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// data access is protected by RLS; this guard is UX only
const MENU = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/inquiries", label: "문의" },
  { href: "/admin/sermons", label: "설교" },
  { href: "/admin/bulletins", label: "주보" },
  { href: "/admin/news", label: "공지" },
  { href: "/admin/calendar", label: "일정" },
  { href: "/admin/banners", label: "배너" },
  { href: "/admin/people", label: "섬기는 분들" },
  { href: "/admin/pages", label: "페이지 문구" },
  { href: "/admin/settings", label: "사이트 설정" },
  { href: "/admin/account", label: "내 계정" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname.startsWith("/admin/login");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLogin) return;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
      if (!profile) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }
      setReady(true);
    });
  }, [isLogin, pathname, router]);

  if (isLogin) return <>{children}</>;

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-ink-faint">
        확인 중...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-ink">관리자</h1>
        <button
          type="button"
          onClick={async () => {
            await createClient().auth.signOut();
            router.replace("/admin/login");
          }}
          className="rounded-full border border-spring-200 px-4 py-1.5 text-sm font-semibold text-ink-soft hover:bg-spring-50"
        >
          로그아웃
        </button>
      </div>
      <nav className="mt-4 flex flex-wrap gap-1.5 border-b border-spring-100 pb-4">
        {MENU.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              pathname === m.href
                ? "bg-spring-600 text-white"
                : "bg-spring-50 text-ink-soft hover:bg-spring-100 hover:text-spring-700"
            }`}
          >
            {m.label}
          </Link>
        ))}
      </nav>
      <div className="py-6">{children}</div>
    </div>
  );
}
