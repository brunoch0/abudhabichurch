import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";
import { formatDate, SERMON_CATEGORIES } from "@/lib/format";

export const metadata: Metadata = {
  title: "설교 영상",
  description: "아부다비 맑은샘 한인교회 주일예배, 새벽기도 설교 영상 아카이브입니다.",
};

export const revalidate = 300;

export default async function SermonsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("sermons")
    .select("*")
    .eq("is_published", true)
    .order("sermon_date", { ascending: false })
    .limit(60);

  if (category && category in SERMON_CATEGORIES) {
    query = query.eq("category", category);
  }
  if (q) {
    query = query.or(`title.ilike.%${q}%,preacher.ilike.%${q}%`);
  }

  const { data: sermons } = await query;

  return (
    <div>
      <PageHero title="설교 영상" subtitle="말씀으로 한 주를 살아갑니다" />

      <section className="mx-auto max-w-6xl px-4 py-10">
        {/* category tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/sermons"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                !category ? "bg-spring-600 text-white" : "bg-spring-50 text-ink-soft hover:bg-spring-100"
              }`}
            >
              전체
            </Link>
            {Object.entries(SERMON_CATEGORIES).map(([key, label]) => (
              <Link
                key={key}
                href={`/sermons?category=${key}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  category === key
                    ? "bg-spring-600 text-white"
                    : "bg-spring-50 text-ink-soft hover:bg-spring-100"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          <form action="/sermons" className="flex gap-2">
            {category && <input type="hidden" name="category" value={category} />}
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="제목·설교자 검색"
              className="w-44 rounded-full border border-spring-200 bg-white px-4 py-2 text-sm outline-none focus:border-spring-400"
            />
            <button
              type="submit"
              className="rounded-full bg-spring-600 px-4 py-2 text-sm font-semibold text-white"
            >
              검색
            </button>
          </form>
        </div>

        {/* sermon grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sermons && sermons.length > 0 ? (
            sermons.map((s) => (
              <Link
                key={s.id}
                href={`/sermons/${s.id}`}
                className="group overflow-hidden rounded-2xl border border-spring-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-video overflow-hidden bg-spring-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${s.youtube_id}/hqdefault.jpg`}
                    alt={s.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-spring-600/90 px-2.5 py-1 text-xs font-bold text-white">
                    {SERMON_CATEGORIES[s.category]}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-bold text-ink group-hover:text-spring-700">{s.title}</p>
                  <p className="mt-1 text-sm text-ink-faint">
                    {s.preacher} · {formatDate(s.sermon_date)}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full py-16 text-center text-ink-faint">
              {q ? "검색 결과가 없습니다" : "등록된 설교 영상이 없습니다"}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
