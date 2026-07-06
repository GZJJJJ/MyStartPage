-- Supabase SQL Editor 初始化脚本

create table if not exists public.shortcuts (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  name text not null,
  url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.tasks (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  text text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.deadlines (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  title text not null,
  date date not null,
  note text not null default '',
  reminder_days integer[] not null default array[7, 3, 1, 0],
  notify_by_email boolean not null default true,
  notify_by_wechat boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  note text not null default '',
  decision_options text not null default '',
  search_engine text not null default 'baidu' check (search_engine in ('baidu', 'google', 'github', 'bilibili')),
  email text,
  migrated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reminder_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deadline_id text not null,
  channel text not null check (channel in ('email', 'wechat')),
  reminder_days_before integer not null,
  sent_on date not null,
  sent_at timestamptz not null default now(),
  recipient_email text,
  email_provider_id text,
  unique (user_id, deadline_id, channel, reminder_days_before, sent_on)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists shortcuts_set_updated_at on public.shortcuts;
create trigger shortcuts_set_updated_at
before update on public.shortcuts
for each row execute function public.set_updated_at();

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

drop trigger if exists deadlines_set_updated_at on public.deadlines;
create trigger deadlines_set_updated_at
before update on public.deadlines
for each row execute function public.set_updated_at();

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

alter table public.shortcuts enable row level security;
alter table public.tasks enable row level security;
alter table public.deadlines enable row level security;
alter table public.settings enable row level security;
alter table public.reminder_logs enable row level security;

drop policy if exists "Users can select own shortcuts" on public.shortcuts;
create policy "Users can select own shortcuts" on public.shortcuts
for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can insert own shortcuts" on public.shortcuts;
create policy "Users can insert own shortcuts" on public.shortcuts
for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can update own shortcuts" on public.shortcuts;
create policy "Users can update own shortcuts" on public.shortcuts
for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can delete own shortcuts" on public.shortcuts;
create policy "Users can delete own shortcuts" on public.shortcuts
for delete to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can select own tasks" on public.tasks;
create policy "Users can select own tasks" on public.tasks
for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can insert own tasks" on public.tasks;
create policy "Users can insert own tasks" on public.tasks
for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can update own tasks" on public.tasks;
create policy "Users can update own tasks" on public.tasks
for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can delete own tasks" on public.tasks;
create policy "Users can delete own tasks" on public.tasks
for delete to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can select own deadlines" on public.deadlines;
create policy "Users can select own deadlines" on public.deadlines
for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can insert own deadlines" on public.deadlines;
create policy "Users can insert own deadlines" on public.deadlines
for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can update own deadlines" on public.deadlines;
create policy "Users can update own deadlines" on public.deadlines
for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can delete own deadlines" on public.deadlines;
create policy "Users can delete own deadlines" on public.deadlines
for delete to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can select own settings" on public.settings;
create policy "Users can select own settings" on public.settings
for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can insert own settings" on public.settings;
create policy "Users can insert own settings" on public.settings
for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can update own settings" on public.settings;
create policy "Users can update own settings" on public.settings
for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can select own reminder logs" on public.reminder_logs;
create policy "Users can select own reminder logs" on public.reminder_logs
for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
