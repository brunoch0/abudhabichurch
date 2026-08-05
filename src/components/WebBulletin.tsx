import type { WebBulletinData } from "@/lib/bulletin";

export default function WebBulletin({
  issueNo,
  dateLabel,
  data,
  contactLine,
}: {
  issueNo: string | null;
  dateLabel: string;
  data: WebBulletinData;
  contactLine: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-spring-100 bg-white">
      {/* header */}
      <div className="bg-gradient-to-br from-spring-200 via-spring-100 to-white p-8 text-center">
        <p className="text-xs font-semibold text-spring-700">
          {issueNo} · {dateLabel}
          {data.week_label && ` · ${data.week_label}`}
        </p>
        <p className="mt-4 text-3xl font-black tracking-tight text-spring-800">
          아부다비 맑은샘 한인교회
        </p>
        <p className="mt-3 text-sm font-semibold text-ink">
          2026년 &lsquo;{data.motto}&rsquo;
        </p>
        <p className="mt-1 text-xs text-ink-faint">{data.verse}</p>
      </div>

      <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
        {/* left: worship */}
        <div>
          <h2 className="border-b-2 border-spring-600 pb-2 text-center text-lg font-bold text-spring-800">
            주일예배
          </h2>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {data.worship_order.map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-spring-50/60" : ""}>
                  <td className="w-28 px-3 py-2.5 font-bold text-spring-800">{row.name}</td>
                  <td className="px-3 py-2.5 text-ink-soft">{row.content}</td>
                  <td className="hidden w-36 px-3 py-2.5 text-right text-xs text-ink-faint sm:table-cell">
                    {row.name_en}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="mt-8 border-b-2 border-spring-600 pb-2 text-center text-lg font-bold text-spring-800">
            예배안내
          </h2>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {data.worship_info.map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-spring-50/60" : ""}>
                  <td className="w-28 px-3 py-2.5 font-bold text-spring-800">{row.name}</td>
                  <td className="px-3 py-2.5 text-ink-soft">{row.time}</td>
                  <td className="px-3 py-2.5 text-ink-soft">{row.place}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* right: news */}
        <div>
          <h2 className="rounded-lg bg-spring-600 px-4 py-2 text-lg font-bold text-white">
            맑은샘소식 <span className="float-right text-sm font-medium opacity-80">Church News</span>
          </h2>
          {data.news_intro && (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
              {data.news_intro}
            </p>
          )}

          {data.ads.length > 0 && (
            <>
              <h3 className="mt-6 border-b border-spring-200 pb-1 font-bold text-ink">광고</h3>
              <ol className="mt-3 space-y-3">
                {data.ads.map((ad, i) => (
                  <li key={i} className="text-sm">
                    <p className="font-bold text-ink">
                      {i + 1}. {ad.title}
                    </p>
                    {ad.body && (
                      <p className="mt-0.5 whitespace-pre-wrap pl-4 leading-relaxed text-ink-soft">
                        {ad.body}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </>
          )}

          {data.moim && (
            <>
              <h3 className="mt-6 border-b border-spring-200 pb-1 font-bold text-ink">
                이웃과 함께하는 맑은샘모임
              </h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                {data.moim}
              </p>
            </>
          )}

          {data.offering && (
            <>
              <h3 className="mt-6 border-b border-spring-200 pb-1 font-bold text-ink">헌금안내</h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                {data.offering}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="bg-spring-950 px-6 py-4 text-center text-xs text-spring-200">
        기독교대한감리회 아부다비맑은샘교회 · {contactLine}
      </div>
    </div>
  );
}
