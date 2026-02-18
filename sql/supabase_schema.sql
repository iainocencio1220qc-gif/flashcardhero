-- Extensions
create extension if not exists pgcrypto with schema extensions;

-- Tables
create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid,
  title text not null,
  description text,
  theme_color text default '#6366f1',
  created_at timestamp default now()
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid references public.decks(id) on delete cascade,
  owner_id uuid,
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

-- Owner-based policies using auth.uid() when JWT claims are present.
-- If no JWT claims exist (direct Postgres connection), allow access for compatibility.
drop policy if exists decks_all_access on public.decks;
drop policy if exists cards_all_access on public.cards;

create policy decks_owner_policy on public.decks
  for all
  to public
  using (
    current_setting('request.jwt.claims', true) is null
    or owner_id = auth.uid()
  )
  with check (
    current_setting('request.jwt.claims', true) is null
    or owner_id = auth.uid()
  );

create policy cards_owner_policy on public.cards
  for all
  to public
  using (
    current_setting('request.jwt.claims', true) is null
    or owner_id = auth.uid()
  )
  with check (
    current_setting('request.jwt.claims', true) is null
    or owner_id = auth.uid()
  );
