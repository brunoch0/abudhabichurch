import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";
import { getLang } from "@/lib/i18n-server";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "주보",
  description: "아부다비 맑은샘 한인교회 주보 아카이브입니다.",
};

export const revalidate = 300;

export default async function BulletinsPage() {
  const { t } = await getLang();
  const supabase = await createClient();
  const { data: bulletins } = await supabase
    .from("bulletins")
    .select("*")
    .eq("is_published", true)
    .order("bulletin_date", { ascending: false })
    .limit(60);

  const [latest, ...rest] = bulletins ?? [];

  return (
    <div>
      <PageHero title={t.pages.bulletinsTitle} subtitle={t.pages.bulletinsSub} />

      <section className="mx-auto max-w-4xl px-4 py-10">
        {latest ? (
          <Link
            href={`/bulletins/${latest.id}`}
            className="group flex flex-col gap-6 rounded-2xl border border-spring-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:flex-row"
          >
            {latest.cover_image_url && (
              <div className="w-full shrink-0 overflow-hidden rounded-xl border border-spring-50 sm:w-56">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={latest.cover_image_url}
                  alt={latest.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-col justify-center">
              <span className="w-fit rounded-full bg-spring-600 px-3 py-1 text-xs font-bold text-white">
                금주의 주보
              </span>
              <p className="mt-3 text-sm text-spring-600">{latest.issue_no}</p>
              <p className="mt-1 text-2xl font-bold text-ink group-hover:text-spring-700">
                {latest.title}
              </p>
              <p className="mt-1 text-sm text-ink-faint">{formatDate(latest.bulletin_date)}</p>
              <p className="mt-4 text-sm font-semibold text-spring-600">주보 보기 →</p>
            </div>
          </Link>
        ) : (
          <p className="py-16 text-center text-ink-faint">{t.common.empty}</p>
        )}

        {rest.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold text-spring-950">지난 주보</h2>
            <div className="mt-4 divide-y divide-spring-50 rounded-2xl border border-spring-100 bg-white shadow-sm">
              {rest.map((b) => (
                <Link
                  key={b.id}
                  href={`/bulletins/${b.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-spring-50"
                >
                  <div>
                    <p className="font-semibold text-ink">{b.title}</p>
                    <p className="text-xs text-ink-faint">
                      {b.issue_no} · {formatDate(b.bulletin_date)}
                    </p>
                  </div>
                  <span className="text-spring-400">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
