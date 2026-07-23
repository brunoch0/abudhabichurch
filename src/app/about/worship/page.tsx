import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "예배 안내",
  description: "아부다비 맑은샘 한인교회 예배 시간과 장소를 안내합니다.",
};

export const revalidate = 300;

export default async function WorshipPage() {
  const { worshipTimes, snsLinks } = await getSettings();

  return (
    <div>
      <PageHero title="예배 안내" subtitle="모든 예배에 여러분을 초대합니다" />

      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="overflow-hidden rounded-2xl border border-spring-100 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-spring-600 text-white">
                <th className="px-4 py-3.5 text-left text-sm font-bold">예배</th>
                <th className="px-4 py-3.5 text-left text-sm font-bold">시간</th>
                <th className="px-4 py-3.5 text-left text-sm font-bold">장소</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {worshipTimes.map((w, i) => (
                <tr key={w.name} className={i % 2 === 1 ? "bg-spring-50/50" : ""}>
                  <td className="px-4 py-4">
                    <p className="font-bold text-ink">{w.name}</p>
                    <p className="text-xs text-ink-faint">{w.name_en}</p>
                  </td>
                  <td className="px-4 py-4 font-semibold text-ink-soft">{w.time}</td>
                  <td className="px-4 py-4 text-ink-soft">{w.place}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
            <p className="font-bold text-ink">🚗 주차 안내</p>
            <p className="mt-2 text-sm text-ink-soft">
              예배시간에 주차장이 혼잡합니다. 10:00~10:10에 도착하시면 조금 여유가 있습니다.
            </p>
          </div>
          <div className="rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
            <p className="font-bold text-ink">📺 온라인 예배</p>
            <p className="mt-2 text-sm text-ink-soft">
              새벽기도는 YouTube로 함께 드릴 수 있습니다.
            </p>
            {snsLinks.youtube && (
              <a
                href={snsLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block rounded-full bg-spring-600 px-4 py-2 text-sm font-semibold text-white"
              >
                YouTube 채널 바로가기
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/about/location"
            className="inline-block rounded-full border border-spring-200 bg-white px-6 py-3 font-semibold text-spring-700 transition-colors hover:bg-spring-50"
          >
            오시는 길 보기 →
          </Link>
        </div>
      </section>
    </div>
  );
}
