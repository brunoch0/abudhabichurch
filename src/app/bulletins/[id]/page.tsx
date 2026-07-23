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
  const { data } = await supabase.from("bulletins").select("title").eq("id", id).maybeSingle();
  return { title: data?.title ?? "주보" };
}

export default async function BulletinDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: bulletin } = await supabase
    .from("bulletins")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (!bulletin) notFound();

  const isPdf = bulletin.pdf_url?.toLowerCase().endsWith(".pdf");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/bulletins" className="text-sm font-medium text-spring-600 hover:underline">
        ← 주보 목록
      </Link>

      <div className="mt-4 rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-spring-600">{bulletin.issue_no}</p>
            <h1 className="mt-1 text-2xl font-bold text-ink">{bulletin.title}</h1>
            <p className="mt-1 text-sm text-ink-faint">{formatDate(bulletin.bulletin_date)}</p>
          </div>
          <a
            href={bulletin.pdf_url}
            download
            className="rounded-full bg-spring-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-spring-700"
          >
            내려받기 ↓
          </a>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-spring-50">
          {isPdf ? (
            <iframe className="h-[80vh] w-full" src={bulletin.pdf_url} title={bulletin.title} />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={bulletin.pdf_url} alt={bulletin.title} className="w-full" />
          )}
        </div>
      </div>
    </div>
  );
}
