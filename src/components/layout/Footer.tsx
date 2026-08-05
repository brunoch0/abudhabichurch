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
