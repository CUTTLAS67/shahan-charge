-- پایگاه داده آنلاین شارژ ساختمان شاهان
create extension if not exists pgcrypto;

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  day integer not null check (day between 1 and 31),
  month integer not null check (month between 1 and 12),
  year integer not null check (year between 1300 and 1600),
  unit integer not null check (unit between 1 and 9),
  amount bigint not null check (amount > 0),
  type text not null check (type in ('deposit','withdraw')),
  desc text not null default '',
  receipt_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

drop policy if exists "authenticated users can read transactions" on public.transactions;
drop policy if exists "authenticated users can insert transactions" on public.transactions;
drop policy if exists "authenticated users can update transactions" on public.transactions;
drop policy if exists "authenticated users can delete transactions" on public.transactions;

create policy "authenticated users can read transactions" on public.transactions for select to authenticated using (true);
create policy "authenticated users can insert transactions" on public.transactions for insert to authenticated with check (true);
create policy "authenticated users can update transactions" on public.transactions for update to authenticated using (true) with check (true);
create policy "authenticated users can delete transactions" on public.transactions for delete to authenticated using (true);

insert into storage.buckets (id, name, public) values ('receipts','receipts',false) on conflict (id) do nothing;

drop policy if exists "authenticated users can read receipts" on storage.objects;
drop policy if exists "authenticated users can upload receipts" on storage.objects;
drop policy if exists "authenticated users can update receipts" on storage.objects;
drop policy if exists "authenticated users can delete receipts" on storage.objects;

create policy "authenticated users can read receipts" on storage.objects for select to authenticated using (bucket_id = 'receipts');
create policy "authenticated users can upload receipts" on storage.objects for insert to authenticated with check (bucket_id = 'receipts' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "authenticated users can update receipts" on storage.objects for update to authenticated using (bucket_id = 'receipts' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "authenticated users can delete receipts" on storage.objects for delete to authenticated using (bucket_id = 'receipts' and (storage.foldername(name))[1] = (select auth.uid()::text));
