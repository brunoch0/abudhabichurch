#!/usr/bin/env bash
# 이전 전/후 동일하게 실행해 결과를 비교한다.
set -uo pipefail
URL="https://qzkyzhajqvmmrjxczymy.supabase.co"
ANON=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d= -f2)
SITE="https://adkmc.ae"

echo "=== 1. Supabase REST (테이블별 행 수) ==="
for t in sermons bulletins news calendar_events pages site_settings banners popups; do
  n=$(curl -s -I "$URL/rest/v1/$t?select=*&limit=0" -H "apikey: $ANON" \
      -H "Authorization: Bearer $ANON" -H "Prefer: count=exact" \
      | tr -d '\r' | awk -F'/' '/[Cc]ontent-[Rr]ange/{print $2}')
  n=${n:-ERR}
  printf "  %-16s %s\n" "$t" "$n"
done

echo "=== 2. 스토리지 (공개 파일 응답) ==="
curl -s -o /dev/null -w "  media 샘플 파일: %{http_code}\n" \
  "$URL/storage/v1/object/public/media/bulletins/1789361816312.jpeg"

echo "=== 3. 사이트 페이지 ==="
for p in "" /about /sermons /bulletins /news /calendar /faq /contact /en /admin/login; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 20 "$SITE$p")
  printf "  %-14s %s\n" "${p:-/}" "$code"
done

echo "=== 4. 홈 콘텐츠 렌더 확인 ==="
html=$(curl -s "$SITE")
for k in "예배영상" "금주의 주보" "공지사항" "application/ld+json" "google-site-verification"; do
  echo "$html" | grep -q "$k" && echo "  OK  $k" || echo "  --  $k (없음)"
done
