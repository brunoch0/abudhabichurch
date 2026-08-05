"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Field, inputCls, btnCls, btnGhostCls, revalidateSite } from "@/components/admin/ui";
import StyleControls from "@/components/admin/StyleControls";
import { textStyleToCss, type TextStyle } from "@/lib/textstyle";
import type { WorshipTime } from "@/lib/settings";

type ChurchInfo = Record<string, unknown> & { contacts?: { role: string; name: string; phone: string }[] };

const HOME_TEXT_FIELDS: { key: string; label: string; rows: number; base: TextStyle; dark: boolean }[] = [
  { key: "hero_headline", label: "메인 헤드라인", rows: 1, base: { color: "#ffffff", size: 48, weight: "bold", align: "center" }, dark: true },
  { key: "hero_welcome", label: "환영 문구", rows: 1, base: { color: "#ffffff", size: 20, align: "center" }, dark: true },
  { key: "intro", label: "교회 소개 한 줄", rows: 2, base: { color: "#182c50", size: 26, weight: "bold", align: "center" }, dark: false },
  { key: "motto_2026", label: "연도 표어", rows: 1, base: { color: "#4096ec", size: 14, weight: "bold", align: "center" }, dark: false },
  { key: "motto_verse", label: "표어 성경구절", rows: 1, base: { color: "#8b96a5", size: 14, align: "center" }, dark: false },
];

export default function AdminSettings() {
  const [church, setChurch] = useState<ChurchInfo>({});
  const [worship, setWorship] = useState<WorshipTime[]>([]);
  const [sns, setSns] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    createClient()
      .from("site_settings")
      .select("key, value")
      .then(({ data }) => {
        const map = new Map(data?.map((r) => [r.key, r.value]));
        setChurch((map.get("church_info") as ChurchInfo) ?? {});
        setWorship((map.get("worship_times") as WorshipTime[]) ?? []);
        setSns((map.get("sns_links") as Record<string, string>) ?? {});
      });
  }, []);

  async function saveAll() {
    setBusy(true);
    const supabase = createClient();
    const results = await Promise.all([
      supabase.from("site_settings").update({ value: church }).eq("key", "church_info"),
      supabase.from("site_settings").update({ value: worship }).eq("key", "worship_times"),
      supabase.from("site_settings").update({ value: sns }).eq("key", "sns_links"),
    ]);
    setBusy(false);
    const err = results.find((r) => r.error)?.error;
    if (err) {
      alert(`저장 실패: ${err.message}`);
      return;
    }
    revalidateSite();
    alert("저장되었습니다");
  }

  const text = (key: string, label: string, rows = 1) => (
    <Field label={label}>
      {rows > 1 ? (
        <textarea rows={rows} className={inputCls} value={String(church[key] ?? "")} onChange={(e) => setChurch({ ...church, [key]: e.target.value })} />
      ) : (
        <input className={inputCls} value={String(church[key] ?? "")} onChange={(e) => setChurch({ ...church, [key]: e.target.value })} />
      )}
    </Field>
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-2xl border border-spring-100 bg-white p-5">
        <h2 className="text-sm font-bold text-ink">홈 화면 문구</h2>
        <p className="mt-1 text-xs text-ink-faint">각 문구 아래에서 글씨체·크기·색상 등을 조절하면 미리보기에 바로 반영됩니다.</p>
        <div className="mt-3 space-y-5">
          {HOME_TEXT_FIELDS.map((f) => (
            <div key={f.key}>
              {text(f.key, f.label, f.rows)}
              <StyleControls
                base={f.base}
                style={(church[`${f.key}_style`] as TextStyle) ?? {}}
                onChange={(st) => setChurch({ ...church, [`${f.key}_style`]: st })}
              />
              <div className={`mt-2 rounded-xl p-4 ${f.dark ? "bg-spring-950" : "bg-mist"}`}>
                <p style={textStyleToCss({ ...f.base, ...((church[`${f.key}_style`] as TextStyle) ?? {}) })}>
                  {String(church[f.key] ?? "") || "(문구를 입력하세요)"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-spring-100 bg-white p-5">
        <h2 className="text-sm font-bold text-ink">교회 정보</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {text("pastor", "담임목사")}
          {text("pastor_phone", "담임목사 연락처")}
          {text("email", "교회 이메일")}
          {text("location_name", "예배 장소")}
        </div>
      </div>

      <div className="rounded-2xl border border-spring-100 bg-white p-5">
        <h2 className="text-sm font-bold text-ink">예배 시간</h2>
        <div className="mt-3 space-y-2">
          {worship.map((w, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
              <input className={inputCls} value={w.name} placeholder="예배명" onChange={(e) => setWorship(worship.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
              <input className={inputCls} value={w.time} placeholder="시간" onChange={(e) => setWorship(worship.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)))} />
              <input className={inputCls} value={w.place} placeholder="장소" onChange={(e) => setWorship(worship.map((x, j) => (j === i ? { ...x, place: e.target.value } : x)))} />
              <button className="text-xs text-red-400" onClick={() => setWorship(worship.filter((_, j) => j !== i))}>삭제</button>
            </div>
          ))}
          <button className={btnGhostCls} onClick={() => setWorship([...worship, { name: "", name_en: "", time: "", place: "" }])}>
            + 예배 추가
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-spring-100 bg-white p-5">
        <h2 className="text-sm font-bold text-ink">SNS / 메신저 링크</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(["youtube", "instagram", "kakao", "whatsapp"] as const).map((k) => (
            <Field key={k} label={k}>
              <input className={inputCls} value={sns[k] ?? ""} onChange={(e) => setSns({ ...sns, [k]: e.target.value })} />
            </Field>
          ))}
        </div>
      </div>

      <button className={btnCls} disabled={busy} onClick={saveAll}>
        {busy ? "저장 중..." : "전체 저장"}
      </button>
    </div>
  );
}
