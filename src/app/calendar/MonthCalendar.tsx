import Link from "next/link";

type CalEvent = {
  id: string;
  title: string;
  starts_at: string;
};

export default function MonthCalendar({
  year,
  month,
  events,
}: {
  year: number;
  month: number;
  events: CalEvent[];
}) {
  const first = new Date(year, month - 1, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const prev = month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, "0")}`;
  const next = month === 12 ? `${year + 1}-01` : `${year}-${String(month + 1).padStart(2, "0")}`;

  // events grouped by day (Gulf Standard Time, UTC+4)
  const byDay = new Map<number, CalEvent[]>();
  for (const e of events) {
    const d = new Date(new Date(e.starts_at).getTime() + 4 * 3600 * 1000);
    const day = d.getUTCDate();
    byDay.set(day, [...(byDay.get(day) ?? []), e]);
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const today = new Date();
  const isThisMonth = today.getFullYear() === year && today.getMonth() + 1 === month;

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
            } ${isThisMonth && day === today.getDate() ? "bg-spring-50 ring-1 ring-spring-300" : ""}`}
          >
            {day && (
              <>
                <p
                  className={`font-semibold ${
                    i % 7 === 0 ? "text-red-400" : "text-ink-soft"
                  }`}
                >
                  {day}
                </p>
                <div className="mt-1 space-y-0.5">
                  {(byDay.get(day) ?? []).slice(0, 2).map((e) => (
                    <p
                      key={e.id}
                      className="truncate rounded bg-spring-100 px-1 py-0.5 text-[10px] font-semibold text-spring-800"
                      title={e.title}
                    >
                      {e.title}
                    </p>
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
    </div>
  );
}
