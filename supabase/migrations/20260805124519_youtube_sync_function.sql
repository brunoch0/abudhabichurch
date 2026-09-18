-- dedupe target for auto-sync
create unique index sermons_youtube_id_key on public.sermons (youtube_id) where youtube_id <> '';

-- callable with anon key from the cron route; inserts only new videos
create or replace function public.sync_sermons(entries jsonb)
returns int
language plpgsql security definer set search_path = public as $$
declare
  e jsonb;
  inserted int := 0;
begin
  if jsonb_typeof(entries) <> 'array' or jsonb_array_length(entries) > 50 then
    return 0;
  end if;
  for e in select * from jsonb_array_elements(entries) loop
    if length(coalesce(e->>'youtube_id','')) = 11
       and length(coalesce(e->>'title','')) between 1 and 200
       and (e->>'category') in ('sunday','wednesday','dawn','special') then
      insert into public.sermons (title, preacher, sermon_date, youtube_url, youtube_id, category)
      values (
        e->>'title',
        coalesce(nullif(e->>'preacher',''), '최재혁 목사'),
        coalesce((e->>'sermon_date')::date, current_date),
        'https://youtu.be/' || (e->>'youtube_id'),
        e->>'youtube_id',
        e->>'category'
      )
      on conflict (youtube_id) where youtube_id <> '' do nothing;
      if found then inserted := inserted + 1; end if;
    end if;
  end loop;
  return inserted;
end;
$$;

grant execute on function public.sync_sermons(jsonb) to anon, authenticated;
