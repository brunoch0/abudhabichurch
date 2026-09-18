alter table public.bulletins
  add column type text not null default 'file' check (type in ('file', 'web')),
  add column data jsonb not null default '{}'::jsonb,
  alter column pdf_url drop not null;
