import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getSettings } from "@/lib/settings";
import { createClient } from "@/lib/supabase/server";
import { textStyleToCss, type TextStyle } from "@/lib/textstyle";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "교회소개",
  description: "아부다비 맑은샘 한인교회 인사말과 비전을 소개합니다.",
};

export const revalidate = 300;

export default async function AboutPage() {
  const { churchInfo } = await getSettings();
  const { lang } = await getLang();
  const supabase = await createClient();
  const { data: pageRows } = await supabase
    .from("pages")
    .select("slug, content")
    .in("slug", ["greeting", "vision"]);

  const pageMap = new Map(pageRows?.map((r) => [r.slug, r.content]) ?? []);
  type PageContent = Record<string, unknown> & { placeholder?: boolean };
  const withLang = (c: PageContent, key: string) => {
    const k = lang === "en" && c[`${key}_en`] ? `${key}_en` : key;
    return { body: c[k] as string | undefined, style: c[`${k}_style`] as TextStyle | undefined, placeholder: c.placeholder };
  };
  const greetingBody = withLang((pageMap.get("greeting") as PageContent) ?? {}, "body");
  const visionBody = withLang((pageMap.get("vision") as PageContent) ?? {}, "body");

  return (
    <div>
      <PageHero title="교회소개" subtitle="하나님 앞에서 거룩한 향기로" />

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-2xl font-bold text-spring-950">인사말</h2>
        <div className="mt-6 rounded-2xl border border-spring-100 bg-white p-8 shadow-sm">
          {greetingBody.placeholder ? (
            <div className="space-y-4 text-ink-soft">
              <p className="text-lg font-semibold text-ink">
                아부다비 맑은샘 한인교회에 오신 것을 환영합니다.
              </p>
              <p>
                우리 교회는 2013년부터 아부다비에 거주하는 한인 가정들과 함께 신앙의 여정을
                걸어온 공동체입니다. 낯선 땅에서의 삶 가운데에도 하나님의 은혜가 맑은 샘처럼
                흘러넘치기를 소망합니다.
              </p>
              <p>
                아부다비에 처음 오신 분들, 잠시 머무시는 분들 모두 언제든 환영합니다. 주일
                오전 10시 20분, St.Andrew&apos;s Centre에서 함께 예배드릴 수 있기를 기대합니다.
              </p>
              <p className="pt-2 font-semibold text-ink">
                담임목사 {churchInfo.pastor} 드림
              </p>
            </div>
          ) : (
            <div style={textStyleToCss(greetingBody.style)}>{greetingBody.body}</div>
          )}
        </div>
      </section>

      <section className="bg-mist py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-spring-950">2026년 교회 표어</h2>
          <div className="mt-6 rounded-2xl border border-spring-100 bg-white p-8 text-center shadow-sm">
            <p className="text-2xl font-black text-spring-700">
              &lsquo;{churchInfo.motto_2026}&rsquo;
            </p>
            <p className="mt-4 text-sm text-ink-faint">{churchInfo.motto_verse}</p>
          </div>
          {!visionBody.placeholder && visionBody.body && (
            <div className="mt-6 rounded-2xl border border-spring-100 bg-white p-8 shadow-sm">
              <p style={textStyleToCss(visionBody.style)}>{visionBody.body}</p>
            </div>
          )}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-spring-100 bg-white p-6 text-center shadow-sm">
              <p className="text-3xl">🙏</p>
              <p className="mt-2 font-bold text-ink">예배하는 교회</p>
              <p className="mt-1 text-sm text-ink-faint">하나님 앞에 드리는 거룩한 예배</p>
            </div>
            <div className="rounded-2xl border border-spring-100 bg-white p-6 text-center shadow-sm">
              <p className="text-3xl">🤝</p>
              <p className="mt-2 font-bold text-ink">동행하는 교회</p>
              <p className="mt-1 text-sm text-ink-faint">타향살이를 함께 걷는 공동체</p>
            </div>
            <div className="rounded-2xl border border-spring-100 bg-white p-6 text-center shadow-sm">
              <p className="text-3xl">🌱</p>
              <p className="mt-2 font-bold text-ink">다음세대를 세우는 교회</p>
              <p className="mt-1 text-sm text-ink-faint">자녀들의 믿음의 뿌리</p>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-ink-faint">
            * 인사말·비전 문구는 교회 확정 문구로 교체 예정입니다
          </p>
        </div>
      </section>
    </div>
  );
}
