import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "English | Korean Methodist Church of Abu Dhabi",
  description:
    "Korean Methodist Church of Abu Dhabi — a Korean-speaking church community in Abu Dhabi, UAE. Sunday worship at 10:20 AM, St.Andrew's Centre.",
};

export const revalidate = 300;

export default async function EnglishPage() {
  const { churchInfo, worshipTimes } = await getSettings();

  return (
    <div>
      <section className="bg-gradient-to-b from-spring-100 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <p className="text-sm font-semibold tracking-widest text-spring-600">
            KOREAN METHODIST CHURCH OF ABU DHABI
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-spring-950 md:text-4xl">
            Welcome to Our Church
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-ink-soft">
            We are a Korean-speaking Methodist church community in Abu Dhabi, UAE. Everyone is
            welcome to join us for worship.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-2xl font-bold text-spring-950">Worship Times</h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-spring-100 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-spring-600 text-white">
                <th className="px-4 py-3.5 text-left text-sm font-bold">Service</th>
                <th className="px-4 py-3.5 text-left text-sm font-bold">Time</th>
                <th className="px-4 py-3.5 text-left text-sm font-bold">Place</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {worshipTimes.map((w, i) => (
                <tr key={w.name} className={i % 2 === 1 ? "bg-spring-50/50" : ""}>
                  <td className="px-4 py-4 font-semibold text-ink">{w.name_en}</td>
                  <td className="px-4 py-4 text-ink-soft">{w.time}</td>
                  <td className="px-4 py-4 text-ink-soft">{w.place}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ink-faint">
          * Sunday Worship starts at 10:20 AM (Sunday). Services are held in Korean.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
            <p className="font-bold text-ink">📍 Location</p>
            <p className="mt-2 text-sm text-ink-soft">
              St.Andrew&apos;s Centre, New Building Chapel (G floor)
              <br />
              Al Mushrif, Abu Dhabi, UAE
            </p>
          </div>
          <div className="rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
            <p className="font-bold text-ink">📞 Contact</p>
            <p className="mt-2 text-sm text-ink-soft">
              {churchInfo.pastor_en}
              <br />
              {churchInfo.pastor_phone}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-spring-100 shadow-sm">
          <iframe
            className="h-80 w-full"
            src="https://www.google.com/maps?q=St+Andrew's+Centre+Abu+Dhabi&output=embed"
            title="Church location map"
            loading="lazy"
          />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block rounded-full border border-spring-200 bg-white px-6 py-3 font-semibold text-spring-700 transition-colors hover:bg-spring-50"
          >
            한국어 홈으로 →
          </Link>
        </div>
      </section>
    </div>
  );
}
