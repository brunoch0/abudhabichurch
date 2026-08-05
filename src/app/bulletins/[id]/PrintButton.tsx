"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-spring-200 px-5 py-2 text-sm font-semibold text-spring-700 transition-colors hover:bg-spring-50"
    >
      인쇄 / PDF 저장
    </button>
  );
}
