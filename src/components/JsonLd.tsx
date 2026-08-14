import type { ChurchInfo, SnsLinks, WorshipTime } from "@/lib/settings";

const DAY_MAP: Record<string, string> = {
  주일: "Sunday",
  월요일: "Monday",
  화요일: "Tuesday",
  수요일: "Wednesday",
  목요일: "Thursday",
  금요일: "Friday",
  토요일: "Saturday",
};

/** "주일 오전 10:20" / "금요일 오후 2:00" → { day, opens } for schema.org */
function parseWorshipTime(time: string) {
  const day = Object.keys(DAY_MAP).find((d) => time.includes(d));
  const m = time.match(/(오전|오후|새벽)?\s*(\d{1,2}):(\d{2})/);
  if (!day || !m) return null;
  let hour = Number(m[2]);
  const min = m[3];
  if (m[1] === "오후" && hour < 12) hour += 12;
  if (m[1] === "새벽" && hour === 12) hour = 0;
  return { day: DAY_MAP[day], opens: `${String(hour).padStart(2, "0")}:${min}` };
}

export default function JsonLd({
  churchInfo,
  snsLinks,
  worshipTimes,
}: {
  churchInfo: ChurchInfo;
  snsLinks: SnsLinks;
  worshipTimes: WorshipTime[];
}) {
  const sameAs = [snsLinks.youtube, snsLinks.instagram].filter(Boolean);

  const openingHours = worshipTimes
    .map((w) => parseWorshipTime(w.time))
    .filter((x): x is { day: string; opens: string } => x !== null)
    .map((x) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${x.day}`,
      opens: x.opens,
    }));

  const data = {
    "@context": "https://schema.org",
    "@type": "Church",
    "@id": "https://adkmc.ae/#church",
    name: churchInfo.name_ko || "아부다비 맑은샘 한인교회",
    alternateName: [
      churchInfo.name_en || "Korean Methodist Church of Abu Dhabi",
      "아부다비 한인교회",
      "ADKMC",
    ],
    url: "https://adkmc.ae",
    description:
      "UAE 아부다비의 한인 감리교회. 주일예배 오전 10:20, St.Andrew's Centre. 아부다비 이주·파견 한인 가정을 환영합니다.",
    telephone: churchInfo.pastor_phone ? `+971${churchInfo.pastor_phone.replace(/\D/g, "").replace(/^0/, "")}` : undefined,
    email: churchInfo.email && !churchInfo.email.startsWith("[") ? churchInfo.email : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: "St. Andrew's Centre, Al Mushrif",
      addressLocality: "Abu Dhabi",
      addressCountry: "AE",
    },
    geo: { "@type": "GeoCoordinates", latitude: 24.4539, longitude: 54.3773 },
    areaServed: [
      { "@type": "City", name: "Abu Dhabi" },
      { "@type": "Country", name: "United Arab Emirates" },
    ],
    knowsLanguage: ["ko", "en"],
    denomination: "Korean Methodist Church",
    founder: churchInfo.pastor ? { "@type": "Person", name: churchInfo.pastor } : undefined,
    foundingDate: "2013-09-11",
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    openingHoursSpecification: openingHours.length > 0 ? openingHours : undefined,
    subjectOf: {
      "@type": "WebSite",
      "@id": "https://adkmc.ae/#website",
      url: "https://adkmc.ae",
      name: "아부다비 맑은샘 한인교회",
      inLanguage: ["ko", "en"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
