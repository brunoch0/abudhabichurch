import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getSettings } from "@/lib/settings";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "섬기는 사람들",
  description: "아부다비 맑은샘 한인교회를 섬기는 사람들을 소개합니다.",
};

export const revalidate = 300;

type Member = { role: string; name: string; phone?: string; photo_url?: string };

export default async function PeoplePage() {
  const { churchInfo } = await getSettings();
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("pages")
    .select("content")
    .eq("slug", "people")
    .maybeSingle();

  const members: Member[] =
    (page?.content as { members?: Member[] })?.members?.filter((m) => m.name) ??
    [{ role: "담임목사", name: churchInfo.pastor, phone: churchInfo.pastor_phone }];

  return (
    <div>
      <PageHero title="섬기는 사람들" subtitle="맑은샘 공동체를 함께 섬깁니다" />

      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <div
              key={`${m.name}-${i}`}
              className="rounded-2xl border border-spring-100 bg-white p-8 text-center shadow-sm"
            >
              {m.photo_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={m.photo_url}
                  alt={`${m.role} ${m.name}`}
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-spring-100 text-4xl">
                  {m.role.includes("목사") ? "✝️" : "🌿"}
                </div>
              )}
              <p className="mt-4 text-sm font-semibold text-spring-600">{m.role}</p>
              <p className="mt-1 text-xl font-bold text-ink">{m.name}</p>
              {m.phone && <p className="mt-3 text-sm text-ink-soft">{m.phone}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
