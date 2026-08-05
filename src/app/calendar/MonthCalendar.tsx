import Link from "next/link";

type CalEvent = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
};

const GST = 4 * 3600 * 1000; // Gulf Standard Time offset

export default function MonthCalendar({
  year,
  month,
  events,
  selId,
}: {
  year: number;
  month: number;
  events: CalEvent[];
  selId?: string;
}) {
  const first = new Date(year, month - 1, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const ym = `${year}-${String(month).padStart(2, "0")}`;

  const prev = month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, "0")}`;
  const next = month === 12 ? `${year + 1}-01` : `${year}-${String(month + 1).padStart(2, "0")}`;

  // events grouped by day (GST); multi-day events span every day through ends_at
  const byDay = new Map<number, CalEvent[]>();
  for (const e of events) {
    const start = new Date(new Date(e.starts_at).getTime() + GST);
    const end = new Date(new Date(e.ends_at ?? e.starts_at).getTime() + GST);
    // clamp to this month, walk day by day (cap at 62 to be safe)
    const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
    const last = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));
    for (let i = 0; cursor <= last && i < 62; i++) {
      if (cursor.getUTCFullYear() === year && cursor.getUTCMonth() === month - 1) {
        const day = cursor.getUTCDate();
        byDay.set(day, [...(byDay.get(day) ?? []), e]);
      }
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const today = new Date(Date.now() + GST);
  const isThisMonth = today.getUTCFullYear() === year && today.getUTCMonth() + 1 === month;

  return (
    <div className="rounded-2xl border border-spring-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <Link
          href={`/calendar?ym=${prev}`}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-spring-50"
          aria-label="이전 달"
        >
          ←
        </Link>
        <p className="text-lg font-bold text-spring-950">
          {year}년 {month}월
        </p>
        <Link
          href={`/calendar?ym=${next}`}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-spring-50"
          aria-label="다음 달"
        >
          →
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-7 text-center text-xs font-bold text-ink-faint">
        {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
          <div key={d} className={`py-2 ${i === 0 ? "text-red-400" : ""}`}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => (
          <div
            key={i}
            className={`min-h-16 rounded-lg p-1.5 text-xs ${
              day ? "bg-white" : ""
            } ${isThisMonth && day === today.getUTCDate() ? "bg-spring-50 ring-1 ring-spring-300" : ""}`}
          >
            {day && (
              <>
                <p className={`font-semibold ${i % 7 === 0 ? "text-red-400" : "text-ink-soft"}`}>
                  {day}
                </p>
                <div className="mt-1 space-y-0.5">
                  {(byDay.get(day) ?? []).slice(0, 2).map((e) => (
                    <Link
                      key={e.id}
                      href={`/calendar?ym=${ym}&sel=${e.id}`}
                      className={`block truncate rounded px-1 py-0.5 text-[10px] font-semibold transition-colors ${
                        selId === e.id
                          ? "bg-spring-600 text-white"
                          : "bg-spring-100 text-spring-800 hover:bg-spring-200"
                      }`}
                      title={e.title}
                    >
                      {e.title}
                    </Link>
                  ))}
                  {(byDay.get(day)?.length ?? 0) > 2 && (
                    <p className="text-[10px] text-ink-faint">+{(byDay.get(day)?.length ?? 0) - 2}</p>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-ink-faint">일정을 누르면 상세 내용이 표시됩니다</p>
    </div>
  );
}
