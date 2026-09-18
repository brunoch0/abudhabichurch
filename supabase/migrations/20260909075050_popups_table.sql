-- 홈 화면 팝업 공지
create table public.popups (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  image_url text not null,
  link_url text,
  starts_at date,
  ends_at date,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index popups_order_idx on public.popups (sort_order, created_at desc);

alter table public.popups enable row level security;

create policy "popups_public_read" on public.popups
  for select using (is_published or public.is_admin());
create policy "popups_admin_write" on public.popups
  for insert with check (public.is_admin());
create policy "popups_admin_update" on public.popups
  for update using (public.is_admin());
create policy "popups_admin_delete" on public.popups
  for delete using (public.is_admin());
