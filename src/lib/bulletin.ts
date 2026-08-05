export type WorshipOrderRow = { name: string; content: string; name_en: string };
export type WorshipInfoRow = { name: string; time: string; place: string };
export type AdItem = { title: string; body: string };

export type WebBulletinData = {
  week_label: string;
  motto: string;
  verse: string;
  worship_order: WorshipOrderRow[];
  worship_info: WorshipInfoRow[];
  news_intro: string;
  ads: AdItem[];
  moim: string;
  offering: string;
};

// default template mirrors the printed bulletin (제2026-29호 기준)
export const DEFAULT_WEB_DATA: WebBulletinData = {
  week_label: "",
  motto: "하나님 앞에서 거룩한 향기로",
  verse: "향이 가득한 금 대접을 가졌으니 이 향은 성도의 기도들이라 | 계 5:8",
  worship_order: [
    { name: "경배와찬양", content: "", name_en: "Singing and Praise" },
    { name: "예배기원", content: "", name_en: "Invocation" },
    { name: "교회소식", content: "", name_en: "Announcements" },
    { name: "입례송", content: "", name_en: "Opening Hymn" },
    { name: "사도신경", content: "", name_en: "Apostles' Creed" },
    { name: "성경봉독", content: "", name_en: "Bible Reading" },
    { name: "설교", content: "", name_en: "The message" },
    { name: "결단의시간", content: "", name_en: "Call to commitment" },
    { name: "봉헌기도 / 축도", content: "", name_en: "Benediction" },
  ],
  worship_info: [
    { name: "주일예배", time: "주일오전 10:20", place: "ST.ANDREW 신관채플(GF)" },
    { name: "다음세대예배", time: "금요일 오후 2:00", place: "교육관" },
    { name: "셀예배", time: "수요일 오전 10:00", place: "교육관" },
    { name: "새벽기도", time: "새벽 5:30", place: "YouTube" },
  ],
  news_intro:
    "맑은샘 교회를 찾아주신 새가족 여러분을 진심으로 환영합니다.\n새로 등록하신 분들은 꼭 새가족교육을 받으셔야 합니다.\n예배 후 교육관에서 교제를 나눕니다.",
  ads: [],
  moim: "",
  offering:
    "들어오실 때 헌금함에 봉헌해 주시기 바랍니다.\n온라인헌금을 원하시는 분은 연락주시기 바랍니다.",
};
