# ĐA RA — Personal Portfolio

Production-ready React + Vite + TypeScript portfolio for ĐA RA.

## Stack
- React 19
- TypeScript
- Vite
- CSS-first motion system + IntersectionObserver

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## Deployment
The project is a static Vite app. Deploy the generated `dist/` folder to Vercel, Netlify, Cloudflare Pages, or another static hosting provider.

For Vercel, the default Vite configuration is sufficient: install command `npm install`, build command `npm run build`, output directory `dist`.

## Asset architecture
All site images live in `public/images/`. Components should reference them through `src/data/images.ts` so image replacement remains centralized.

## Motion architecture
- `src/hooks/useScrollReveal.ts` — bidirectional section/card reveal
- `src/hooks/useParallax.ts` — lightweight scroll parallax
- `src/hooks/useScrollProgress.ts` — top scroll progress
- `src/styles/animations.css` — cinematic motion and reduced-motion rules

## Contact / profile
Current profile data is centralized in `src/data/profile.ts`.

## Important
The repository intentionally contains no secrets, API keys, or environment-specific credentials.


## Production workflow

1. Install dependencies: `npm install`
2. Validate production build: `npm run build`
3. Preview production output: `npm run preview`
4. Push source to GitHub.
5. Import the repository into Vercel and use the default Vite settings.

The portfolio currently stores static content in `src/data/*.ts` and static assets in `public/images/`. A database is intentionally not required until dynamic features such as an admin CMS or contact-message storage are added.
