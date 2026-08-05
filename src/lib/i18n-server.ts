import { cookies } from "next/headers";
import { dict, pickLang, type Dict, type Lang } from "@/lib/i18n";

export async function getLang(): Promise<{ lang: Lang; t: Dict }> {
  const store = await cookies();
  const lang = pickLang(store.get("lang")?.value);
  return { lang, t: dict[lang] as Dict };
}
