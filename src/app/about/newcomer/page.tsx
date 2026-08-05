import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getSettings } from "@/lib/settings";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "새가족 안내",
  description: "아부다비 맑은샘 한인교회에 처음 오시는 분들을 환영합니다.",
};

export const revalidate = 300;

const STEPS = [
  {
    step: "1",
    title: "주일예배 참석",
    desc: "주일 오전 10:20, St.Andrew's Centre 신관 채플실(G층)로 오세요. 처음 오시는 분은 안내위원이 자리를 안내해 드립니다.",
  },
  {
    step: "2",
    title: "새가족 등록",
    desc: "예배 후 새가족 등록 카드를 작성합니다. 궁금한 점은 언제든 물어보세요.",
  },
  {
    step: "3",
    title: "새가족교육",
    desc: "새로 등록하신 분들은 꼭 새가족교육을 받으셔야 합니다. 예배 후 교육관에서 교제를 나눕니다.",
  },
  {
    step: "4",
    title: "공동체와 함께",
    desc: "셀 모임과 교회 공동체 활동을 통해 아부다비 생활에 든든한 신앙의 가족이 생깁니다.",
  },
];

export default async function NewcomerPage() {
  const { churchInfo } = await getSettings();
  const supabase = await createClient();
  const { data: page } = await supabase.from("pages").select("content").eq("slug", "newcomer").maybeSingle();
  const welcome = (page?.content as { body?: string })?.body;

  return (
    <div>
      <PageHero
        title="새가족 안내"
        subtitle={welcome || "맑은샘 교회를 찾아주신 새가족 여러분을 진심으로 환영합니다"}
      />

      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="space-y-4">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="flex gap-5 rounded-2xl border border-spring-100 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-spring-600 text-lg font-black text-white">
                {s.step}
              </div>
              <div>
                <p className="font-bold text-ink">{s.title}</p>
                <p className="mt-1 text-sm text-ink-soft">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-spring-600 p-8 text-center text-white">
          <p className="text-xl font-bold">아부다비에 처음 오셨나요?</p>
          <p className="mt-2 text-sm text-spring-100">
            이주·파견으로 낯선 곳에 오신 분들, 교회가 처음이신 분들 모두 환영합니다.
            <br />
            궁금한 것이 있으면 편하게 문의해 주세요.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-white px-6 py-3 font-semibold text-spring-700 transition-transform hover:scale-105"
            >
              문의하기
            </Link>
            <Link
              href="/about/location"
              className="rounded-full border border-spring-300 px-6 py-3 font-semibold text-white transition-colors hover:bg-spring-500"
            >
              오시는 길
            </Link>
          </div>
          <p className="mt-5 text-xs text-spring-200">
            담임목사 {churchInfo.pastor} · {churchInfo.pastor_phone}
          </p>
        </div>
      </section>
    </div>
  );
}
