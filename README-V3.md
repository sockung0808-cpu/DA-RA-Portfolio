# DA RA Portfolio V3 — Admin CMS

V3 keeps the existing public portfolio UI and adds a secure admin console.

## Public
- `/` — portfolio, no login required.

## Admin
- `/admin/login` — Supabase Auth email/password login.
- `/admin` — dashboard.
- Projects / Events / Modules — CRUD, visibility, draft/published and ordering.
- Media — upload images to Supabase Storage.

## Supabase setup
1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Authentication → Users, create the admin user with email/password.
4. Copy the user's UUID and run the `admin_profiles` insert at the bottom of `schema.sql`.
5. Create a public Storage bucket named `portfolio` and configure Storage policies for admin uploads.
6. Copy `.env.example` to `.env.local` and fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
7. Run `npm install`, then `npm run dev`.

## Vercel
Add the same two `VITE_SUPABASE_*` variables in Project Settings → Environment Variables, then redeploy.

Never expose a Supabase service-role/secret key in Vite frontend variables.


## RUN NOW (Windows)
Double-click `START-WINDOWS.bat`. It always starts from this project folder, so an old VS Code terminal cannot accidentally run the previous V3 folder.
