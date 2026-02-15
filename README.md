# Flashcard Hero

Gamified Spaced Repetition System (SRS) with SM-2 algorithm. Built with Next.js 14 (App Router), Drizzle ORM, Supabase (Postgres), Framer Motion, and Shadcn-style UI.

## Features

- **Dashboard**: Deck grid with "Due Today" badges and mesh gradient background
- **Power Paste**: Bulk-add cards by pasting text (split by `:` or `-`)
- **Create Deck**: New deck with optional Power Paste
- **Study Arena**: 3D flip cards, SM-2 rating (Again / Hard / Good / Easy), confetti on completion
- **Empty states**: "You're All Caught Up!" when no cards due; "Deck Mastered!" after finishing a session

## Setup

1. **Environment**

   Copy `.env.example` to `.env.local` and set your Supabase Postgres URL:

   ```bash
   DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
   ```

2. **Install & DB**

   ```bash
   npm install
   npm run db:push
   ```

3. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` – development server
- `npm run build` – production build
- `npm run db:push` – push schema to DB (Supabase)
- `npm run db:generate` – generate migrations
- `npm run db:migrate` – run migrations

## Vercel Deployment

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. In **Project → Settings → Environment Variables**, add:
   - **Name**: `DATABASE_URL`
   - **Value**: your Postgres connection string (same as in `.env.local`; if the password has `?` or `#`, use URL-encoded values: `?` → `%3F`, `#` → `%23`).
3. Deploy. The app uses Next.js 14 App Router and is configured for Vercel (`vercel.json`).

## Tech Stack

- **Framework**: Next.js 14+ (App Router, Server Actions)
- **Database**: Supabase (Postgres) via Drizzle ORM + `postgres` driver
- **UI**: Radix (Dialog, Slot), Tailwind CSS, Framer Motion, Lucide icons, canvas-confetti
- **SRS**: SM-2 in `src/lib/srs.ts`
- **Optional**: `@neondatabase/serverless` installed for Neon/Vercel edge usage
