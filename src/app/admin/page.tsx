"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Counts = { inquiries: number; sermons: number; bulletins: number; news: number; events: number };

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<
    { id: string; name: string; message: string; status: string; created_at: string }[]
  >([]);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const [inq, ser, bul, nws, evt, recent] = await Promise.all([
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("sermons").select("id", { count: "exact", head: true }),
        supabase.from("bulletins").select("id", { count: "exact", head: true }),
        supabase.from("news").select("id", { count: "exact", head: true }),
        supabase.from("calendar_events").select("id", { count: "exact", head: true }),
        supabase
          .from("inquiries")
          .select("id, name, message, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      setCounts({
        inquiries: inq.count ?? 0,
        sermons: ser.count ?? 0,
        bulletins: bul.count ?? 0,
        news: nws.count ?? 0,
        events: evt.count ?? 0,
      });
      setRecentInquiries(recent.data ?? []);
    })();
  }, []);

  const cards = [
    { label: "미처리 문의", value: counts?.inquiries, href: "/admin/inquiries", hot: true },
    { label: "설교", value: counts?.sermons, href: "/admin/sermons" },
    { label: "주보", value: counts?.bulletins, href: "/admin/bulletins" },
    { label: "공지", value: counts?.news, href: "/admin/news" },
    { label: "일정", value: counts?.events, href: "/admin/calendar" },
  ];

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`rounded-2xl border p-5 shadow-sm ${
              c.hot && (c.value ?? 0) > 0
                ? "border-red-200 bg-red-50"
                : "border-spring-100 bg-white"
            }`}
          >
            <p className="text-xs font-semibold text-ink-faint">{c.label}</p>
            <p className="mt-1 text-2xl font-black text-ink">{c.value ?? "–"}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 text-sm font-bold text-ink">최근 문의</h2>
      <div className="mt-3 divide-y divide-spring-50 rounded-2xl border border-spring-100 bg-white">
        {recentInquiries.length === 0 && (
          <p className="px-5 py-4 text-sm text-ink-faint">문의가 없습니다</p>
        )}
        {recentInquiries.map((q) => (
          <Link key={q.id} href="/admin/inquiries" className="flex items-center gap-3 px-5 py-3 hover:bg-spring-50">
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                q.status === "new"
                  ? "bg-red-100 text-red-600"
                  : q.status === "in_progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-spring-50 text-ink-faint"
              }`}
            >
              {q.status === "new" ? "미처리" : q.status === "in_progress" ? "답변중" : "완료"}
            </span>
            <span className="font-semibold text-ink">{q.name}</span>
            <span className="min-w-0 flex-1 truncate text-sm text-ink-soft">{q.message}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
