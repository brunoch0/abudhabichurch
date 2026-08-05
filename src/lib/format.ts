export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}

// Gulf Standard Time (UTC+4) — server renders in UTC, so shift explicitly
const GST_OFFSET_MS = 4 * 3600 * 1000;

export function formatDateTime(dateStr: string): string {
  const d = new Date(new Date(dateStr).getTime() + GST_OFFSET_MS);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const ampm = h < 12 ? "오전" : "오후";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일(${days[d.getUTCDay()]}) ${ampm} ${h12}:${String(m).padStart(2, "0")}`;
}

export const SERMON_CATEGORIES: Record<string, string> = {
  sunday: "주일예배",
  wednesday: "수요예배",
  dawn: "새벽기도",
  special: "특별집회",
};
