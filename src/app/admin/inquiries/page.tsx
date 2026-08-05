"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const STATUS: Record<string, { label: string; cls: string }> = {
  new: { label: "미처리", cls: "bg-red-100 text-red-600" },
  in_progress: { label: "답변중", cls: "bg-yellow-100 text-yellow-700" },
  done: { label: "완료", cls: "bg-spring-50 text-ink-faint" },
};

type Inquiry = {
  id: string;
  name: string;
  contact: string;
  email: string | null;
  message: string;
  status: string;
  created_at: string;
};

export default function AdminInquiries() {
  const [rows, setRows] = useState<Inquiry[]>([]);

  async function load() {
    const { data } = await createClient()
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    setRows(data ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: string) {
    await createClient().from("inquiries").update({ status }).eq("id", id);
    await load();
  }

  return (
    <div>
      <h2 className="text-sm font-bold text-ink">문의 목록 ({rows.length})</h2>
      <div className="mt-3 space-y-3">
        {rows.length === 0 && (
          <p className="rounded-2xl border border-spring-100 bg-white px-5 py-8 text-center text-sm text-ink-faint">
            접수된 문의가 없습니다
          </p>
        )}
        {rows.map((q) => (
          <div key={q.id} className="rounded-2xl border border-spring-100 bg-white p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${STATUS[q.status].cls}`}>
                {STATUS[q.status].label}
              </span>
              <span className="font-bold text-ink">{q.name}</span>
              <span className="text-sm text-ink-soft">{q.contact}</span>
              {q.email && <span className="text-sm text-ink-faint">{q.email}</span>}
              <span className="ml-auto text-xs text-ink-faint">
                {new Date(q.created_at).toLocaleString("ko-KR")}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-ink-soft">{q.message}</p>
            <div className="mt-4 flex gap-2">
              {Object.entries(STATUS).map(([key, s]) => (
                <button
                  key={key}
                  disabled={q.status === key}
                  onClick={() => setStatus(q.id, key)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                    q.status === key
                      ? "bg-spring-600 text-white"
                      : "border border-spring-200 text-ink-soft hover:bg-spring-50"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
