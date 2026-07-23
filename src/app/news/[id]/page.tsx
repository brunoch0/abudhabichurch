import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("news").select("title").eq("id", id).maybeSingle();
  return { title: data?.title ?? "공지사항" };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (!item) notFound();

  const images = (item.images as string[]) ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/news" className="text-sm font-medium text-spring-600 hover:underline">
        ← 공지사항 목록
      </Link>

      <article className="mt-4 rounded-2xl border border-spring-100 bg-white p-8 shadow-sm">
        <div className="border-b border-spring-50 pb-5">
          {item.is_pinned && (
            <span className="rounded bg-spring-600 px-2 py-0.5 text-[11px] font-bold text-white">
              공지
            </span>
          )}
          <h1 className="mt-2 text-2xl font-bold text-ink">{item.title}</h1>
          <p className="mt-2 text-sm text-ink-faint">{formatDate(item.published_at)}</p>
        </div>
        <div className="mt-6 whitespace-pre-wrap leading-relaxed text-ink-soft">
          {item.content}
        </div>
        {images.length > 0 && (
          <div className="mt-6 space-y-4">
            {images.map((src) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={src} src={src} alt="" className="w-full rounded-xl" loading="lazy" />
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
