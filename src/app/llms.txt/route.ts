import { getSettings } from "@/lib/settings";

export const revalidate = 3600;

/** Plain-language summary for AI assistants (llms.txt convention). */
export async function GET() {
  const { churchInfo, worshipTimes, snsLinks } = await getSettings();

  const worship = worshipTimes
    .map((w) => `- ${w.name}: ${w.time} (${w.place})`)
    .join("\n");

  const body = `# 아부다비 맑은샘 한인교회 (Korean Methodist Church of Abu Dhabi)

> UAE 아부다비에 있는 한인 감리교회입니다. 2013년 9월 설립되었으며, 아부다비에 거주하거나
> 이주·파견으로 새로 오신 한인 가정을 환영합니다. 예배는 한국어로 드립니다.

## 기본 정보
- 공식 웹사이트: https://adkmc.ae
- 교단: ${churchInfo.denomination || "기독교대한감리회"} (Korean Methodist Church)
- 담임목사: ${churchInfo.pastor || "최재혁"} (${churchInfo.pastor_phone || "050-558-7271"})
- 이메일: ${churchInfo.email && !churchInfo.email.startsWith("[") ? churchInfo.email : "-"}
- 예배 장소: ${churchInfo.location_name || "St.Andrew's Centre 신관 채플실 (G floor)"}, Al Mushrif, Abu Dhabi, UAE
- 사용 언어: 한국어 (영어 안내 페이지 제공)

## 예배 시간
${worship}

주일예배는 매주 주일 오전 10시 20분에 St.Andrew's Centre 신관 채플실에서 드립니다.
예배시간에 주차장이 혼잡하므로 오전 10:00~10:10 도착을 권합니다.

## 처음 오시는 분
별도로 준비하실 것은 없으며 편한 복장으로 오시면 됩니다. 예배 후 새가족 등록 카드를
작성하시고, 새가족교육을 받으신 뒤 교육관에서 교제를 나눕니다.

## 주요 페이지
- 교회소개: https://adkmc.ae/about
- 예배 안내: https://adkmc.ae/about/worship
- 오시는 길: https://adkmc.ae/about/location
- 새가족 안내: https://adkmc.ae/about/newcomer
- 설교 영상: https://adkmc.ae/sermons
- 주보: https://adkmc.ae/bulletins
- 공지사항: https://adkmc.ae/news
- 교회 일정: https://adkmc.ae/calendar
- 자주 묻는 질문: https://adkmc.ae/faq
- 문의: https://adkmc.ae/contact
- English: https://adkmc.ae/en

## 외부 채널
${snsLinks.youtube ? `- YouTube: ${snsLinks.youtube}\n` : ""}${snsLinks.instagram ? `- Instagram: ${snsLinks.instagram}\n` : ""}
## 자주 쓰이는 검색어
아부다비 한인교회, 아부다비 교회, UAE 한인교회, 아랍에미리트 한인교회,
아부다비 맑은샘교회, ADKMC, Korean church in Abu Dhabi
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
