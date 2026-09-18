-- =============================================
-- 아부다비 맑은샘 한인교회 — MVP schema
-- =============================================

-- admin profiles (linked to auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  role text not null default 'editor' check (role in ('super_admin', 'editor')),
  created_at timestamptz not null default now()
);

-- helper: is current user an admin (any role)
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

-- key-value site settings (contacts, SNS links, SEO defaults, placeholders)
create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- hero banners
create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  link_url text,
  sort_order int not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- fixed pages (greeting, vision, people, worship, location, newcomer, en)
create table public.pages (
  slug text primary key,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- sermons (YouTube embed)
create table public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  preacher text not null default '',
  sermon_date date not null,
  youtube_url text not null,
  youtube_id text not null default '',
  category text not null default 'sunday' check (category in ('sunday', 'wednesday', 'dawn', 'special')),
  scripture text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index sermons_date_idx on public.sermons (sermon_date desc);
create index sermons_category_idx on public.sermons (category);

-- bulletins (file-based, MVP)
create table public.bulletins (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issue_no text,
  bulletin_date date not null,
  cover_image_url text,
  pdf_url text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index bulletins_date_idx on public.bulletins (bulletin_date desc);

-- news / notices
create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null default '',
  images jsonb not null default '[]'::jsonb,
  is_pinned boolean not null default false,
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index news_published_idx on public.news (published_at desc);

-- church calendar events
create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  category text not null default 'general' check (category in ('general', 'worship', 'education', 'community', 'mission')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_period check (ends_at is null or ends_at >= starts_at)
);
create index calendar_events_starts_idx on public.calendar_events (starts_at);

-- inquiries (anonymous submissions)
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  email text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'done')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index inquiries_status_idx on public.inquiries (status, created_at desc);

-- =============================================
-- RLS
-- =============================================
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.banners enable row level security;
alter table public.pages enable row level security;
alter table public.sermons enable row level security;
alter table public.bulletins enable row level security;
alter table public.news enable row level security;
alter table public.calendar_events enable row level security;
alter table public.inquiries enable row level security;

-- profiles: admins can read all profiles; users can read their own
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_admin_all" on public.profiles
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin')
  );

-- public read policies (published content only for anon)
create policy "site_settings_public_read" on public.site_settings for select using (true);
create policy "banners_public_read" on public.banners for select using (is_published or public.is_admin());
create policy "pages_public_read" on public.pages for select using (true);
create policy "sermons_public_read" on public.sermons for select using (is_published or public.is_admin());
create policy "bulletins_public_read" on public.bulletins for select using (is_published or public.is_admin());
create policy "news_public_read" on public.news for select using (is_published or public.is_admin());
create policy "calendar_events_public_read" on public.calendar_events for select using (is_published or public.is_admin());

-- admin write policies
create policy "site_settings_admin_write" on public.site_settings for insert with check (public.is_admin());
create policy "site_settings_admin_update" on public.site_settings for update using (public.is_admin());
create policy "site_settings_admin_delete" on public.site_settings for delete using (public.is_admin());

create policy "banners_admin_write" on public.banners for insert with check (public.is_admin());
create policy "banners_admin_update" on public.banners for update using (public.is_admin());
create policy "banners_admin_delete" on public.banners for delete using (public.is_admin());

create policy "pages_admin_write" on public.pages for insert with check (public.is_admin());
create policy "pages_admin_update" on public.pages for update using (public.is_admin());
create policy "pages_admin_delete" on public.pages for delete using (public.is_admin());

create policy "sermons_admin_write" on public.sermons for insert with check (public.is_admin());
create policy "sermons_admin_update" on public.sermons for update using (public.is_admin());
create policy "sermons_admin_delete" on public.sermons for delete using (public.is_admin());

create policy "bulletins_admin_write" on public.bulletins for insert with check (public.is_admin());
create policy "bulletins_admin_update" on public.bulletins for update using (public.is_admin());
create policy "bulletins_admin_delete" on public.bulletins for delete using (public.is_admin());

create policy "news_admin_write" on public.news for insert with check (public.is_admin());
create policy "news_admin_update" on public.news for update using (public.is_admin());
create policy "news_admin_delete" on public.news for delete using (public.is_admin());

create policy "calendar_events_admin_write" on public.calendar_events for insert with check (public.is_admin());
create policy "calendar_events_admin_update" on public.calendar_events for update using (public.is_admin());
create policy "calendar_events_admin_delete" on public.calendar_events for delete using (public.is_admin());

-- inquiries: anyone can submit; only admins can read/manage
create policy "inquiries_anon_insert" on public.inquiries for insert with check (true);
create policy "inquiries_admin_read" on public.inquiries for select using (public.is_admin());
create policy "inquiries_admin_update" on public.inquiries for update using (public.is_admin());
create policy "inquiries_admin_delete" on public.inquiries for delete using (public.is_admin());
