export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h < 12 ? "오전" : "오후";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${d.getMonth() + 1}월 ${d.getDate()}일(${days[d.getDay()]}) ${ampm} ${h12}:${String(m).padStart(2, "0")}`;
}

export const SERMON_CATEGORIES: Record<string, string> = {
  sunday: "주일예배",
  wednesday: "수요예배",
  dawn: "새벽기도",
  special: "특별집회",
};
