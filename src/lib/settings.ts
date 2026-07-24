import { createClient } from "@/lib/supabase/server";

export type ChurchInfo = {
  name_ko: string;
  name_en: string;
  denomination: string;
  pastor: string;
  pastor_en: string;
  pastor_phone: string;
  since: string;
  location_name: string;
  location_en: string;
  address: string;
  email: string;
  motto_2026: string;
  motto_verse: string;
  hero_headline: string;
  hero_welcome: string;
  intro: string;
  contacts: { role: string; name: string; phone: string }[];
};

export type WorshipTime = {
  name: string;
  name_en: string;
  time: string;
  place: string;
};

export type SnsLinks = {
  instagram: string;
  youtube: string;
  kakao: string;
  whatsapp: string;
};

export async function getSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key, value");

  const map = new Map(data?.map((row) => [row.key, row.value]) ?? []);

  return {
    churchInfo: (map.get("church_info") ?? {}) as ChurchInfo,
    worshipTimes: (map.get("worship_times") ?? []) as WorshipTime[],
    snsLinks: (map.get("sns_links") ?? {}) as SnsLinks,
  };
}
