"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { dict, pickLang, type Lang } from "@/lib/i18n";

export default function FloatingContact() {
  const pathname = usePathname();
  const [lang, setLang] = useState<Lang>("ko");
  useEffect(() => {
    setLang(pickLang(document.cookie.match(/(?:^|; )lang=([^;]*)/)?.[1]));
  }, [pathname]);
  if (pathname.startsWith("/admin") || pathname.startsWith("/contact")) return null;

  return (
    <Link
      href="/contact"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-spring-600 px-5 py-3 font-semibold text-white shadow-lg shadow-spring-600/30 transition-transform hover:scale-105"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {dict[lang].common.contactTalk}
    </Link>
  );
}
