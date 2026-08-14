import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description:
    "아부다비 맑은샘 한인교회에 자주 묻는 질문 — 예배 시간, 위치, 주차, 새가족 등록, 온라인 예배 안내.",
};

export const revalidate = 300;

type FaqItem = { q: string; a: string };

export default async function FaqPage() {
  const { lang } = await getLang();
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("pages")
    .select("content")
    .eq("slug", "faq")
    .maybeSingle();

  const content = (page?.content as Record<string, unknown>) ?? {};
  const items = ((lang === "en" && content.items_en ? content.items_en : content.items) ??
    []) as FaqItem[];
  const valid = items.filter((i) => i.q && i.a);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: valid.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };

  return (
    <div>
      {valid.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <PageHero
        title={lang === "en" ? "FAQ" : "자주 묻는 질문"}
        subtitle={
          lang === "en"
            ? "Questions we hear most often"
            : "궁금하신 점을 모아 정리했습니다"
        }
      />

      <section className="mx-auto max-w-3xl px-4 py-10">
        {valid.length > 0 ? (
          <div className="space-y-4">
            {valid.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-spring-100 bg-white p-6 shadow-sm"
              >
                <h2 className="flex gap-2 font-bold text-ink">
                  <span className="text-spring-600">Q.</span>
                  {item.q}
                </h2>
                <p className="mt-3 whitespace-pre-wrap pl-6 leading-relaxed text-ink-soft">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-ink-faint">
            {lang === "en" ? "Nothing here yet" : "등록된 내용이 없습니다"}
          </p>
        )}

        <div className="mt-10 rounded-2xl bg-spring-600 p-8 text-center text-white">
          <p className="text-lg font-bold">
            {lang === "en" ? "Still have questions?" : "더 궁금한 점이 있으신가요?"}
          </p>
          <p className="mt-2 text-sm text-spring-100">
            {lang === "en"
              ? "Feel free to reach out anytime."
              : "언제든 편하게 문의해 주세요."}
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-block rounded-full bg-white px-6 py-3 font-semibold text-spring-700 transition-transform hover:scale-105"
          >
            {lang === "en" ? "Contact us" : "문의하기"}
          </Link>
        </div>
      </section>
    </div>
  );
}
