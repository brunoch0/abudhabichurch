import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";

export const revalidate = 300;

function extractYoutubeId(url: string): string {
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  return m?.[1] ?? "";
}

export default async function HomePage() {
  const supabase = await createClient();
  const { churchInfo, worshipTimes } = await getSettings();

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

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-spring-100 via-spring-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
          <p className="text-sm font-semibold tracking-widest text-spring-600">
            {churchInfo.denomination} · Since 2013
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-spring-950 md:text-5xl">
            아부다비 맑은샘 한인교회
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
            2026년 &lsquo;{churchInfo.motto_2026}&rsquo;
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-ink-faint">
            {churchInfo.motto_verse}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/about/newcomer"
              className="rounded-full bg-spring-600 px-6 py-3 font-semibold text-white shadow-lg shadow-spring-600/25 transition-transform hover:scale-105"
            >
              처음 오셨나요?
            </Link>
            <Link
              href="/about/worship"
              className="rounded-full border border-spring-200 bg-white px-6 py-3 font-semibold text-spring-700 transition-colors hover:bg-spring-50"
            >
              예배 안내
            </Link>
          </div>
        </div>
      </section>

      {/* Worship times */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl font-bold text-spring-950">예배 시간</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {worshipTimes.map((w) => (
            <div
              key={w.name}
              className="rounded-2xl border border-spring-100 bg-white p-6 text-center shadow-sm"
            >
              <p className="font-bold text-spring-700">{w.name}</p>
              <p className="mt-2 text-lg font-semibold text-ink">{w.time}</p>
              <p className="mt-1 text-sm text-ink-faint">{w.place}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest sermon + bulletin + news */}
      <section className="bg-mist py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-bold text-spring-950">최신 설교</h2>
              <Link href="/sermons" className="text-sm font-medium text-spring-600 hover:underline">
                전체 보기 →
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
                  <p className="text-sm">설교 영상이 등록되면 표시됩니다</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-bold text-spring-950">금주의 주보</h2>
                <Link href="/bulletins" className="text-sm font-medium text-spring-600 hover:underline">
                  지난 주보 →
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
                  <p className="text-sm text-ink-faint">주보가 등록되면 표시됩니다</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-bold text-spring-950">공지사항</h2>
                <Link href="/news" className="text-sm font-medium text-spring-600 hover:underline">
                  전체 보기 →
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
                  <p className="px-3 py-2.5 text-sm text-ink-faint">공지사항이 등록되면 표시됩니다</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-spring-950">다가오는 일정</h2>
          <Link href="/calendar" className="text-sm font-medium text-spring-600 hover:underline">
            전체 일정 →
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
              등록된 일정이 없습니다
            </p>
          )}
        </div>
      </section>

      {/* Location */}
      <section className="bg-mist py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-spring-950">오시는 길</h2>
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
                주일예배는 매주 주일 오전 10:20에 드립니다. 예배시간에 주차장이 혼잡하니
                10:00~10:10 도착을 권합니다.
              </p>
              <p className="text-sm text-ink-faint">
                담임목사 {churchInfo.pastor} · {churchInfo.pastor_phone}
              </p>
              <Link
                href="/about/location"
                className="mt-2 w-fit rounded-full border border-spring-200 bg-white px-5 py-2.5 text-sm font-semibold text-spring-700 transition-colors hover:bg-spring-50"
              >
                자세히 보기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
