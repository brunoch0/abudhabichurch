import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "공지사항",
  description: "아부다비 맑은샘 한인교회 공지사항입니다.",
};

export const revalidate = 300;

export default async function NewsPage() {
  const supabase = await createClient();
  const { data: news } = await supabase
    .from("news")
    .select("id, title, is_pinned, published_at")
    .eq("is_published", true)
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <PageHero title="공지사항" subtitle="맑은샘 교회의 소식을 전합니다" />

      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="divide-y divide-spring-50 rounded-2xl border border-spring-100 bg-white shadow-sm">
          {news && news.length > 0 ? (
            news.map((n) => (
              <Link
                key={n.id}
                href={`/news/${n.id}`}
                className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-spring-50"
              >
                {n.is_pinned && (
                  <span className="shrink-0 rounded bg-spring-600 px-2 py-0.5 text-[11px] font-bold text-white">
                    공지
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate font-semibold text-ink">{n.title}</span>
                <span className="shrink-0 text-xs text-ink-faint">{formatDate(n.published_at)}</span>
              </Link>
            ))
          ) : (
            <p className="py-16 text-center text-ink-faint">등록된 공지사항이 없습니다</p>
          )}
        </div>
      </section>
    </div>
  );
}
