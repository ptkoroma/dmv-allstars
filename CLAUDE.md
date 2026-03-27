# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint check
```

## Architecture

**Next.js 15 App Router** site for DMV All Stars FC soccer club. Uses **Tailwind CSS v4** (configured via `@theme` in `globals.css`, no `tailwind.config.ts`). Auth and database via **Supabase**.

### Key directories
- `app/` — pages using App Router. Server Components by default; add `'use client'` only when needed.
- `components/` — shared UI (`Navbar`, `Footer`)
- `lib/supabase/client.ts` — browser Supabase client (for Client Components)
- `lib/supabase/server.ts` — server Supabase client (for Server Components and Route Handlers)
- `middleware.ts` — protects `/dashboard`, redirects logged-in users away from `/login` and `/register`

### Pages
| Route | Notes |
|---|---|
| `/` | Home — hero with `soccer.png`, stats, features |
| `/about` | Team info, coaching staff |
| `/gallery` | Filterable photo grid (client component) |
| `/contact` | Contact form |
| `/login` | Supabase email/password sign-in |
| `/register` | 2-step player registration → creates `auth.users` + `profiles` row |
| `/dashboard` | Protected — server-fetches own profile; editable via `DashboardClient.tsx` |

### Supabase setup
1. Copy `.env.local.example` → `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Run `supabase-schema.sql` in the Supabase SQL Editor to create the `profiles` table with RLS

### RLS policy
Row Level Security ensures each user can only `SELECT`, `INSERT`, and `UPDATE` their own row in `profiles` (matched by `auth.uid() = id`). Never bypass this — dashboard reads only the authenticated user's profile.

### Design tokens
- Primary orange: `#f97316` (use `bg-orange-500`, `text-orange-500`)
- Dark backgrounds: `#0a0a0a` (page), `#111111` (nav/sections), `#1a1a1a` (cards)
- All nav links are uppercase with `tracking-wider`
