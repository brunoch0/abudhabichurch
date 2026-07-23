import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getSettings } from "@/lib/settings";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "문의",
  description: "아부다비 맑은샘 한인교회에 궁금한 점을 문의하세요.",
};

export const revalidate = 300;

export default async function ContactPage() {
  const { churchInfo, snsLinks } = await getSettings();

  return (
    <div>
      <PageHero title="문의" subtitle="궁금한 점은 무엇이든 편하게 남겨주세요" />

      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3">
            <ContactForm />
          </div>

          <div className="space-y-4 md:col-span-2">
            <div className="rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
              <p className="font-bold text-ink">📞 직접 연락</p>
              <p className="mt-2 text-sm text-ink-soft">
                담임목사 {churchInfo.pastor}
                <br />
                {churchInfo.pastor_phone}
              </p>
            </div>
            <div className="rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
              <p className="font-bold text-ink">🕐 예배 안내</p>
              <p className="mt-2 text-sm text-ink-soft">
                주일예배 오전 10:20
                <br />
                {churchInfo.location_name}
              </p>
            </div>
            {(snsLinks.kakao || snsLinks.whatsapp) && (
              <div className="rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
                <p className="font-bold text-ink">💬 메신저</p>
                <div className="mt-3 flex gap-2">
                  {snsLinks.kakao && (
                    <a
                      href={snsLinks.kakao}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-ink"
                    >
                      카카오톡
                    </a>
                  )}
                  {snsLinks.whatsapp && (
                    <a
                      href={snsLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
