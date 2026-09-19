import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CHANNEL_ID = "UCUFGWfoRB4AR4cRJW4FtagQ";

function categorize(title: string): string {
  if (title.includes("새벽기도")) return "dawn";
  if (title.includes("주일예배")) return "sunday";
  if (title.includes("수요")) return "wednesday";
  return "special";
}

function cleanTitle(title: string): string {
  return title.replace(/아부다비\s*맑은샘\s*한인교회\s*/g, "").trim() || title;
}

export async function GET() {
  // This daily cron doubles as the Supabase keepalive: a Free-plan project is
  // paused after a week without activity, so reach the database before the
  // YouTube feed, which is the part that can fail.
  const supabase = await createClient();
  const { error: pingError } = await supabase.from("sermons").select("id").limit(1);
  if (pingError) {
    return NextResponse.json({ ok: false, error: pingError.message }, { status: 500 });
  }

  let xml: string;
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error(`rss fetch failed: ${res.status}`);
    xml = await res.text();
  } catch (err) {
    // The keepalive above already ran, so still surface the sync failure loudly
    // rather than reporting a healthy cron.
    const message = err instanceof Error ? err.message : "rss fetch failed";
    return NextResponse.json({ ok: false, kept_alive: true, error: message }, { status: 502 });
  }

  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map((m) => {
      const block = m[1];
      const id = block.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1];
      const title = block.match(/<title>([^<]+)<\/title>/)?.[1];
      const published = block.match(/<published>([^<]+)<\/published>/)?.[1];
      if (!id || !title) return null;
      return {
        youtube_id: id,
        title: cleanTitle(title),
        sermon_date: published?.slice(0, 10),
        category: categorize(title),
        preacher: "최재혁 목사",
      };
    })
    .filter(Boolean);

  const { data: inserted, error } = await supabase.rpc("sync_sermons", { entries });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  if ((inserted ?? 0) > 0) revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, checked: entries.length, inserted });
}
