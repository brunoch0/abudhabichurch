import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getSettings } from "@/lib/settings";
import { getLang } from "@/lib/i18n-server";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "문의",
  description: "아부다비 맑은샘 한인교회에 궁금한 점을 문의하세요.",
};

export const revalidate = 300;

export default async function ContactPage() {
  const { churchInfo, snsLinks } = await getSettings();
  const { t } = await getLang();

  return (
    <div>
      <PageHero title={t.pages.contactTitle} subtitle={t.pages.contactSub} />

      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3">
            <ContactForm />
          </div>

          <div className="space-y-4 md:col-span-2">
            <div className="rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
              <p className="font-bold text-ink">{t.contact.direct}</p>
              <p className="mt-2 text-sm text-ink-soft">
                담임목사 {churchInfo.pastor}
                <br />
                {churchInfo.pastor_phone}
              </p>
              <a
                href={`https://wa.me/971${churchInfo.pastor_phone.replace(/\D/g, "").replace(/^0/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.5-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9.9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4-.1.6.5.2.6.8 1.9.8 2 .1.1.1.3 0 .5-.3.6-.7.9-.5 1.2.7 1.2 1.6 2 2.8 2.6.3.2.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.1.1.7-.3 1.3z" />
                </svg>
                WhatsApp 문의
              </a>
            </div>
            <div className="rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
              <p className="font-bold text-ink">{t.contact.worshipInfo}</p>
              <p className="mt-2 text-sm text-ink-soft">
                주일예배 오전 10:20
                <br />
                {churchInfo.location_name}
              </p>
            </div>
            {(snsLinks.kakao || snsLinks.whatsapp) && (
              <div className="rounded-2xl border border-spring-100 bg-white p-6 shadow-sm">
                <p className="font-bold text-ink">{t.contact.messenger}</p>
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
