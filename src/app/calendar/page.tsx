import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";
import MonthCalendar from "./MonthCalendar";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "교회 일정",
  description: "아부다비 맑은샘 한인교회 교회 일정입니다.",
};

export const revalidate = 300;

const CATEGORY_LABELS: Record<string, string> = {
  general: "일반",
  worship: "예배",
  education: "교육",
  community: "공동체",
  mission: "선교",
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ ym?: string }>;
}) {
  const { ym } = await searchParams;
  const now = new Date();
  const [year, month] = ym?.match(/^\d{4}-\d{2}$/)
    ? ym.split("-").map(Number)
    : [now.getFullYear(), now.getMonth() + 1];

  const monthStart = new Date(Date.UTC(year, month - 1, 1) - 4 * 3600 * 1000);
  const monthEnd = new Date(Date.UTC(year, month, 1) - 4 * 3600 * 1000);

  const supabase = await createClient();
  const [{ data: monthEvents }, { data: upcoming }] = await Promise.all([
    supabase
      .from("calendar_events")
      .select("*")
      .eq("is_published", true)
      .gte("starts_at", monthStart.toISOString())
      .lt("starts_at", monthEnd.toISOString())
      .order("starts_at", { ascending: true }),
    supabase
      .from("calendar_events")
      .select("*")
      .eq("is_published", true)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(10),
  ]);

  return (
    <div>
      <PageHero title="교회 일정" subtitle="맑은샘 교회의 한 달을 확인하세요" />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MonthCalendar year={year} month={month} events={monthEvents ?? []} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-spring-950">다가오는 일정</h2>
            <div className="mt-4 space-y-3">
              {upcoming && upcoming.length > 0 ? (
                upcoming.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-2xl border border-spring-100 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-spring-100 px-2.5 py-0.5 text-[11px] font-bold text-spring-700">
                        {CATEGORY_LABELS[e.category] ?? e.category}
                      </span>
                      <span className="text-xs text-ink-faint">{formatDateTime(e.starts_at)}</span>
                    </div>
                    <p className="mt-2 font-bold text-ink">{e.title}</p>
                    {e.location && <p className="mt-0.5 text-sm text-ink-faint">📍 {e.location}</p>}
                    {e.description && (
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{e.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-spring-100 bg-white p-5 text-sm text-ink-faint">
                  다가오는 일정이 없습니다
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
