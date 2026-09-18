-- only allowlisted emails may sign up; auto-create admin profile on signup
create table public.admin_allowlist (
  email text primary key,
  role text not null default 'super_admin' check (role in ('super_admin', 'editor')),
  name text not null default ''
);
alter table public.admin_allowlist enable row level security;
create policy "allowlist_admin_read" on public.admin_allowlist for select using (public.is_admin());

insert into public.admin_allowlist (email, role, name) values
('chohj0228@gmail.com', 'super_admin', 'Bruno'),
('jesuschanger@naver.com', 'super_admin', '최재혁 목사');

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  allowed public.admin_allowlist%rowtype;
begin
  select * into allowed from public.admin_allowlist where email = lower(new.email);
  if allowed.email is null then
    raise exception '허용되지 않은 이메일입니다';
  end if;
  insert into public.profiles (id, name, role) values (new.id, allowed.name, allowed.role);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
