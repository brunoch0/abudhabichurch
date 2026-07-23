import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getSettings } from "@/lib/settings";
import CopyAddressButton from "./CopyAddressButton";

export const metadata: Metadata = {
  title: "오시는 길",
  description: "아부다비 맑은샘 한인교회 위치와 오시는 길을 안내합니다.",
};

export const revalidate = 300;

export default async function LocationPage() {
  const { churchInfo } = await getSettings();
  const address = "St Andrew's Centre, Al Mushrif, Abu Dhabi";

  return (
    <div>
      <PageHero title="오시는 길" subtitle={churchInfo.location_name} />

      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="overflow-hidden rounded-2xl border border-spring-100 shadow-sm">
          <iframe
            className="h-96 w-full"
            src="https://www.google.com/maps?q=St+Andrew's+Centre+Abu+Dhabi&output=embed"
            title="교회 위치 지도"
            loading="lazy"
          />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
            <p className="font-bold text-ink">📍 주소</p>
            <p className="mt-2 text-sm text-ink-soft">{churchInfo.location_name}</p>
            <p className="mt-1 text-sm text-ink-faint">{address}</p>
            <CopyAddressButton address={address} />
          </div>
          <div className="rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
            <p className="font-bold text-ink">📞 연락처</p>
            <p className="mt-2 text-sm text-ink-soft">
              담임목사 {churchInfo.pastor} · {churchInfo.pastor_phone}
            </p>
            <p className="mt-1 text-sm text-ink-faint">
              방문 전 연락 주시면 자세히 안내해 드립니다.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-spring-50 p-6">
          <p className="font-bold text-spring-800">🕐 주일예배 오시는 팁</p>
          <p className="mt-2 text-sm text-ink-soft">
            주일예배는 오전 10:20에 시작합니다. 예배시간에 주차장이 혼잡하니 10:00~10:10 도착을
            권합니다. 예배 장소는 St.Andrew&apos;s Centre 신관 채플실(G층)입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
