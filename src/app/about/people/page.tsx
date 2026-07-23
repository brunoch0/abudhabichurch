import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "섬기는 사람들",
  description: "아부다비 맑은샘 한인교회를 섬기는 사람들을 소개합니다.",
};

export const revalidate = 300;

export default async function PeoplePage() {
  const { churchInfo } = await getSettings();

  return (
    <div>
      <PageHero title="섬기는 사람들" subtitle="맑은샘 공동체를 함께 섬깁니다" />

      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="mx-auto max-w-md rounded-2xl border border-spring-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-spring-100 text-4xl">
            👨‍💼
          </div>
          <p className="mt-4 text-sm font-semibold text-spring-600">담임목사</p>
          <p className="mt-1 text-xl font-bold text-ink">{churchInfo.pastor}</p>
          <p className="mt-1 text-sm text-ink-faint">{churchInfo.pastor_en}</p>
          <p className="mt-3 text-sm text-ink-soft">{churchInfo.pastor_phone}</p>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-spring-200 bg-spring-50/50 p-8 text-center">
          <p className="text-ink-soft">장로 · 권사 · 집사 등 섬기는 분들 소개가 준비 중입니다.</p>
          <p className="mt-1 text-sm text-ink-faint">
            교회에서 명단과 사진을 제공해주시면 관리자 페이지에서 등록할 수 있습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
