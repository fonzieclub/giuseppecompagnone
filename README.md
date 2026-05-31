# Giuseppe Compagnone — Personal Trainer

Website for Giuseppe Compagnone, personal trainer. Built with React, Vite, Tailwind CSS, and Supabase.

## Local development

```bash
npm install
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Environment variables

Set these in `.env.local` (local) and in **Vercel → Settings → Environment Variables** (production):

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |

## Deploy (Vercel)

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add the environment variables above
4. Deploy — build command: `npm run build`, output: `dist`

## Supabase setup

Run the migration in `supabase/migrations/20260531200000_initial_schema.sql` via the Supabase SQL Editor.

To make yourself admin after signing up:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'your@email.com');
```

Admin panel: `/admin/reviews`

## Project structure

- `src/pages/` — page components
- `src/components/` — reusable UI
- `public/images/` — site images (self-hosted)
- `src/data/legacyReviews.js` — reviews exported from Base44
- `supabase/` — database migrations and edge functions
