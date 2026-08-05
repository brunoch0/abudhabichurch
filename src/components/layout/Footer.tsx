import Link from "next/link";
import type { ChurchInfo, SnsLinks } from "@/lib/settings";

export default function Footer({
  churchInfo,
  snsLinks,
  adminLabel = "관리자 로그인",
}: {
  churchInfo: ChurchInfo;
  snsLinks: SnsLinks;
  adminLabel?: string;
}) {
  return (
    <footer className="border-t border-spring-100 bg-mist">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="text-lg font-bold text-ink">{churchInfo.name_ko}</p>
            <p className="mt-0.5 text-sm text-ink-faint">{churchInfo.name_en}</p>
            <div className="mt-4 space-y-1 text-sm text-ink-soft">
              <p>{churchInfo.location_name}</p>
              <p>
                담임목사 {churchInfo.pastor} · {churchInfo.pastor_phone}
              </p>
              {churchInfo.email && !churchInfo.email.startsWith("[") && (
                <p>{churchInfo.email}</p>
              )}
              <p className="text-ink-faint">{churchInfo.denomination}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              {snsLinks.youtube && (
                <a
                  href={snsLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-soft shadow-sm transition-colors hover:text-spring-600"
                  aria-label="YouTube"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
                  </svg>
                </a>
              )}
              {snsLinks.instagram && (
                <a
                  href={snsLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-soft shadow-sm transition-colors hover:text-spring-600"
                  aria-label="Instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              )}
            </div>
            <Link href="/admin/login" className="text-xs text-ink-faint hover:text-ink-soft">
              {adminLabel}
            </Link>
          </div>
        </div>
        <p className="mt-8 border-t border-spring-100 pt-4 text-xs text-ink-faint">
          © {new Date().getFullYear()} {churchInfo.name_ko}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
