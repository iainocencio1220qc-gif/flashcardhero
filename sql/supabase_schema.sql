-- Extensions
create extension if not exists pgcrypto with schema extensions;

-- Tables
create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  theme_color text default '#6366f1',
  created_at timestamp default now()
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid references public.decks(id) on delete cascade,
  front text not null,
  back text not null,
  interval integer default 0,
  repetition integer default 0,
  ease_factor double precision default 2.5,
  next_review timestamp default now()
);

-- Indexes (optional but recommended)
create index if not exists idx_cards_deck_id on public.cards(deck_id);
create index if not exists idx_cards_next_review on public.cards(next_review);

-- Row Level Security
alter table public.decks enable row level security;
alter table public.cards enable row level security;

-- Permissive policies (adjust when adding auth)
create policy if not exists decks_all_access on public.decks
  for all
  to public
  using (true)
  with check (true);

create policy if not exists cards_all_access on public.cards
  for all
  to public
  using (true)
  with check (true);

