-- profiles_admin_all queried profiles inside its own policy -> infinite recursion (500)
drop policy "profiles_admin_all" on public.profiles;

create or replace function public.is_super_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'super_admin');
$$;

create policy "profiles_admin_all" on public.profiles
  for all using (public.is_super_admin());
