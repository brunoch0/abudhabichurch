"use client";

import { useState } from "react";

export default function CopyAddressButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="mt-3 rounded-full bg-spring-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-spring-700"
    >
      {copied ? "복사되었습니다 ✓" : "주소 복사"}
    </button>
  );
}
