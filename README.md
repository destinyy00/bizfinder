# BizFinder

Demo local business directory with search, proximity, ratings, business dashboard, image uploads, and Supabase auth/DB/storage.

## Local dev

1. Create `.env` with:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - JWT_SECRET (for legacy endpoints; safe to keep)
2. Install deps: `npm i`
3. Run dev server: `npm run dev`

## Supabase setup

- Run `supabase/schema.sql` in Supabase SQL editor
- Storage → Create public bucket `photos` (public)
- Auth → Settings → enable email/password
- Optional: seed demo data: `npm run db:seed:supabase`

## Deploy to Vercel

- Push to GitHub (main branch)
- Import the repo in Vercel
- Set env vars in Vercel → Project Settings → Environment Variables
- Deploy

Default theme is dark (toggle in header).
