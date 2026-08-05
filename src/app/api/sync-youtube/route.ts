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
  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: "rss fetch failed" }, { status: 502 });
  }
  const xml = await res.text();

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

  const supabase = await createClient();
  const { data: inserted, error } = await supabase.rpc("sync_sermons", { entries });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  if ((inserted ?? 0) > 0) revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, checked: entries.length, inserted });
}
