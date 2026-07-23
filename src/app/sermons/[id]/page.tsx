import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate, SERMON_CATEGORIES } from "@/lib/format";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("sermons").select("title").eq("id", id).maybeSingle();
  return { title: data?.title ?? "설교 영상" };
}

export default async function SermonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: sermon } = await supabase
    .from("sermons")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (!sermon) notFound();

  const { data: recent } = await supabase
    .from("sermons")
    .select("id, title, preacher, sermon_date, category")
    .eq("is_published", true)
    .neq("id", id)
    .order("sermon_date", { ascending: false })
    .limit(5);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/sermons" className="text-sm font-medium text-spring-600 hover:underline">
        ← 설교 목록
      </Link>

      <div className="mt-4 overflow-hidden rounded-2xl border border-spring-100 bg-white shadow-sm">
        <div className="aspect-video">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${sermon.youtube_id}`}
            title={sermon.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-6">
          <span className="rounded-full bg-spring-100 px-3 py-1 text-xs font-bold text-spring-700">
            {SERMON_CATEGORIES[sermon.category]}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-ink">{sermon.title}</h1>
          <p className="mt-2 text-sm text-ink-faint">
            {sermon.preacher} · {formatDate(sermon.sermon_date)}
            {sermon.scripture && ` · ${sermon.scripture}`}
          </p>
          {sermon.description && (
            <p className="mt-4 whitespace-pre-wrap text-ink-soft">{sermon.description}</p>
          )}
        </div>
      </div>

      {recent && recent.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-spring-950">최근 설교</h2>
          <div className="mt-4 divide-y divide-spring-50 rounded-2xl border border-spring-100 bg-white shadow-sm">
            {recent.map((r) => (
              <Link
                key={r.id}
                href={`/sermons/${r.id}`}
                className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-spring-50"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{r.title}</p>
                  <p className="text-xs text-ink-faint">
                    {SERMON_CATEGORIES[r.category]} · {formatDate(r.sermon_date)}
                  </p>
                </div>
                <span className="text-spring-400">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
