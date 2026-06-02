-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('NEED', 'OFFER')),
  category text not null check (category in ('Food', 'Tools', 'Rides', 'Care')),
  title text not null,
  description text not null,
  contact_info text not null,
  status text not null default 'OPEN' check (status in ('OPEN', 'CLAIMED')),
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

-- Anyone can read posts
create policy "Posts are viewable by everyone"
  on public.posts for select
  using (true);

-- Anyone can create a post (no login required)
create policy "Anyone can insert posts"
  on public.posts for insert
  with check (true);

-- Anyone can claim an open post
create policy "Anyone can claim open posts"
  on public.posts for update
  using (status = 'OPEN')
  with check (status = 'CLAIMED');
