import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";
import { getLang } from "@/lib/i18n-server";
import { textStyleToCss, type TextStyle } from "@/lib/textstyle";

export const revalidate = 300;

function extractYoutubeId(url: string): string {
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  return m?.[1] ?? "";
}

export default async function HomePage() {
  const supabase = await createClient();
  const { churchInfo, snsLinks } = await getSettings();
  const { lang, t } = await getLang();

  const [{ data: latestSermon }, { data: latestBulletin }, { data: news }, { data: events }] =
    await Promise.all([
      supabase
        .from("sermons")
        .select("*")
        .eq("is_published", true)
        .order("sermon_date", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("bulletins")
        .select("*")
        .eq("is_published", true)
        .order("bulletin_date", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("news")
        .select("id, title, published_at, is_pinned")
        .eq("is_published", true)
        .order("is_pinned", { ascending: false })
        .order("published_at", { ascending: false })
        .limit(4),
      supabase
        .from("calendar_events")
        .select("id, title, starts_at, location")
        .eq("is_published", true)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(4),
    ]);

  const youtubeId = latestSermon ? extractYoutubeId(latestSermon.youtube_url) : "";

  // per-language text/style lookup: EN mode uses `<key>_en` fields, falling back to defaults
  const ci = churchInfo as unknown as Record<string, string | TextStyle | undefined>;
  const pick = (key: string, fallbackKo: string, fallbackEn: string) => {
    const suffix = lang === "en" ? "_en" : "";
    return {
      text: (ci[`${key}${suffix}`] as string) || (lang === "en" ? fallbackEn : fallbackKo),
      style: ci[`${key}${suffix}_style`] as TextStyle | undefined,
    };
  };
  const heroHeadline = pick("hero_headline", "광야의 샘을 내는 교회", "A Church that Springs Forth in the Wilderness");
  const heroWelcome = pick("hero_welcome", "아부다비 맑은샘교회에 오신 여러분을 환영합니다.", "Welcome to Malgeunsaem Korean Church in Abu Dhabi.");
  const introText = pick("intro", "사막의 오아시스처럼 지친 영혼에게 쉼과 생명을 공급하는 맑은샘교회입니다.", "Like an oasis in the desert, we bring rest and life to weary souls.");
  const motto = pick("motto_2026", churchInfo.motto_2026 ?? "", "2026 Motto");
  const verse = pick("motto_verse", churchInfo.motto_verse ?? "", churchInfo.motto_verse ?? "");

  return (
    <div>
      {/* Hero — full-bleed photo */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden md:min-h-[80vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-standrews.jpg"
          alt="아부다비 St.Andrew's Centre 전경"
          className="hero-kenburns absolute inset-0 h-full w-full object-cover object-[center_12%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-spring-950/55 via-spring-950/35 to-spring-950/65" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center text-white">
          <p className="text-sm font-semibold tracking-widest text-spring-100/90">
            {t.home.welcomeTag}
          </p>
          <h1
            className="mt-5 text-4xl font-black leading-tight tracking-tight drop-shadow-lg md:text-6xl"
            style={heroHeadline.style ? textStyleToCss({ color: "#ffffff", weight: "bold", align: "center", size: 48, ...heroHeadline.style }) : undefined}
          >
            {heroHeadline.text}
          </h1>
          <p
            className="mx-auto mt-5 max-w-2xl text-lg text-white/90 drop-shadow md:text-xl"
            style={heroWelcome.style ? textStyleToCss({ color: "#ffffff", align: "center", size: 20, ...heroWelcome.style }) : undefined}
          >
            {heroWelcome.text}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/about/newcomer"
              className="rounded-full bg-white px-6 py-3 font-semibold text-spring-800 shadow-lg transition-transform hover:scale-105"
            >
              {t.home.newcomerBtn}
            </Link>
            <Link
              href="/about/worship"
              className="rounded-full border border-white/60 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              {t.home.worshipBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {snsLinks.youtube && (
              <a
                href={snsLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="유튜브" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-sm transition-transform hover:scale-110"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
                </svg>
              </a>
            )}
            {snsLinks.instagram && (
              <a
                href={snsLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인스타그램" className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-sm transition-transform hover:scale-110"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            )}
            {snsLinks.kakao && (
              <a
                href={snsLinks.kakao}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="오픈카톡" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE500] text-[#191919] shadow-sm transition-transform hover:scale-110"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.2 4.7 6.6l-1 3.6c-.1.3.3.6.6.4l4.3-2.9c.5.1.9.1 1.4.1 5.5 0 10-3.5 10-7.8S17.5 3 12 3z" />
                </svg>
              </a>
            )}
          </div>
          <p
            className="text-sm font-semibold tracking-widest text-spring-500"
            style={motto.style ? textStyleToCss({ color: "#4096ec", weight: "bold", align: "center", size: 14, ...motto.style }) : undefined}
          >
            {lang === "en" ? motto.text : <>2026년 &lsquo;{motto.text}&rsquo;</>}
          </p>
          <p
            className="mt-5 text-2xl font-bold leading-snug text-spring-950 md:text-[28px]"
            style={introText.style ? textStyleToCss({ color: "#182c50", weight: "bold", align: "center", size: 26, ...introText.style }) : undefined}
          >
            {introText.text}
          </p>
          <p
            className="mt-4 text-sm text-ink-faint"
            style={verse.style ? textStyleToCss({ color: "#8b96a5", align: "center", size: 14, ...verse.style }) : undefined}
          >
            {verse.text}
          </p>
        </div>
      </section>

      {/* Latest sermon + bulletin + news */}
      <section className="bg-mist py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-bold text-spring-950">{t.home.latestSermon}</h2>
              <Link href="/sermons" className="text-sm font-medium text-spring-600 hover:underline">
                {t.common.viewAll}
              </Link>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-spring-100 bg-white shadow-sm">
              {latestSermon && youtubeId ? (
                <>
                  <div className="aspect-video">
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title={latestSermon.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-bold text-ink">{latestSermon.title}</p>
                    <p className="mt-1 text-sm text-ink-faint">
                      {latestSermon.preacher} · {latestSermon.sermon_date}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center gap-2 text-ink-faint">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" opacity="0.4">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
                  </svg>
                  <p className="text-sm">{t.home.noSermon}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-bold text-spring-950">{t.home.weeklyBulletin}</h2>
                <Link href="/bulletins" className="text-sm font-medium text-spring-600 hover:underline">
                  {t.home.pastBulletins}
                </Link>
              </div>
              <div className="mt-6 rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
                {latestBulletin ? (
                  <Link href={`/bulletins/${latestBulletin.id}`} className="group block">
                    <p className="text-sm text-spring-600">{latestBulletin.issue_no}</p>
                    <p className="mt-1 font-bold text-ink group-hover:text-spring-700">
                      {latestBulletin.title}
                    </p>
                    <p className="mt-1 text-sm text-ink-faint">{latestBulletin.bulletin_date}</p>
                  </Link>
                ) : (
                  <p className="text-sm text-ink-faint">{t.home.noBulletin}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-bold text-spring-950">{t.home.news}</h2>
                <Link href="/news" className="text-sm font-medium text-spring-600 hover:underline">
                  {t.common.viewAll}
                </Link>
              </div>
              <div className="mt-6 rounded-2xl border border-spring-100 bg-white p-3 shadow-sm">
                {news && news.length > 0 ? (
                  news.map((n) => (
                    <Link
                      key={n.id}
                      href={`/news/${n.id}`}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-spring-50"
                    >
                      {n.is_pinned && (
                        <span className="rounded bg-spring-100 px-1.5 py-0.5 text-[10px] font-bold text-spring-700">
                          공지
                        </span>
                      )}
                      <span className="flex-1 truncate text-sm text-ink">{n.title}</span>
                    </Link>
                  ))
                ) : (
                  <p className="px-3 py-2.5 text-sm text-ink-faint">{t.home.noNews}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-spring-950">{t.home.upcoming}</h2>
          <Link href="/calendar" className="text-sm font-medium text-spring-600 hover:underline">
            {t.home.allEvents}
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {events && events.length > 0 ? (
            events.map((e) => {
              const d = new Date(e.starts_at);
              return (
                <div key={e.id} className="rounded-2xl border border-spring-100 bg-white p-5 shadow-sm">
                  <p className="text-sm font-bold text-spring-600">
                    {d.getMonth() + 1}월 {d.getDate()}일
                  </p>
                  <p className="mt-1 font-semibold text-ink">{e.title}</p>
                  {e.location && <p className="mt-1 text-sm text-ink-faint">{e.location}</p>}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-ink-faint sm:col-span-2 lg:col-span-4">
              {t.home.noEvents}
            </p>
          )}
        </div>
      </section>

      {/* Location */}
      <section className="bg-mist py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-spring-950">{t.home.location}</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-spring-100 shadow-sm">
              <iframe
                className="h-72 w-full"
                src="https://www.google.com/maps?q=St+Andrew's+Centre+Abu+Dhabi&output=embed"
                title="오시는 길"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-center gap-3">
              <p className="text-lg font-bold text-ink">{churchInfo.location_name}</p>
              <p className="text-ink-soft">
                {t.home.parkingNote}
              </p>
              <p className="text-sm text-ink-faint">
                {t.home.pastorLabel} {churchInfo.pastor} · {churchInfo.pastor_phone}
              </p>
              <Link
                href="/about/location"
                className="mt-2 w-fit rounded-full border border-spring-200 bg-white px-5 py-2.5 text-sm font-semibold text-spring-700 transition-colors hover:bg-spring-50"
              >
                {t.home.locationDetail}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
