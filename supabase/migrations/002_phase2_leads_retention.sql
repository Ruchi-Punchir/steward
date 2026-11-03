-- =============================================================================
-- STEWARD ADMIN & INSIGHTS — PHASE 2: 24-MONTH LEAD RETENTION CLEANUP JOB
-- Deletes leads older than 24 months unless marked 'won'.
-- =============================================================================

create or replace function public.cleanup_expired_leads()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  with deleted as (
    delete from public.leads
    where created_at < (now() - interval '24 months')
      and status <> 'won'
    returning id
  )
  select count(*) into deleted_count from deleted;

  return deleted_count;
end;
$$;

-- Optional: If pg_cron extension is enabled in your Supabase project,
-- schedule daily cleanup at 03:00 UTC automatically:
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule(
      'steward-cleanup-expired-leads',
      '0 3 * * *',
      $cron$select public.cleanup_expired_leads();$cron$
    );
  end if;
exception
  when others then
    raise notice 'pg_cron not enabled yet; you can enable pg_cron in Supabase Extensions or use /api/cron/cleanup-leads.';
end;
$$;
