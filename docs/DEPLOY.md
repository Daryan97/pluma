# Deploying Pluma

Pluma runs as a **Nuxt 3 / Nitro** Node server (SSR) with live feeds and SEO. Docker is the recommended always-on path.

## Required environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase API URL |
| `VITE_SUPABASE_ANON_KEY` | Anon / publishable key |
| `VITE_SITE_URL` | Public site origin (canonical, sitemap, RSS, i18n `baseUrl`) |
| `VITE_ENV` | `production` or `development` |
| `VITE_SITE_LOCALE` | Optional default locale code (default `en`) |

Optional: `PORT` / `NITRO_PORT` (Docker defaults to `80`, local `npm start` defaults to `3000`), `FEEDS_CACHE_TTL_MS`, `VITE_TWITTER_SITE`.

Docker still accepts the historical `VITE_*` names; the entrypoint also exports matching `NUXT_PUBLIC_*` so SSR runtimeConfig picks them up.

Copy from `example.env`:

```bash
cp example.env .env
```

## Database

| Scenario | Script |
|----------|--------|
| **New installs** | `src/install/pluma_initial.sql` (or the `/install` wizard). Includes series, scheduling, preview tokens, locales, and RLS helpers. |
| Existing DB → series / schedule / preview | `src/install/pluma_features_v2.sql` |
| Existing DB → multi-language content | `src/install/pluma_i18n_v3.sql` (after v2) |
| Broken storage/settings RLS after restore | `src/install/pluma_rls_fix.sql` |

Do **not** re-run v2/v3 after a fresh `pluma_initial.sql` install unless you know you need them; the initial schema already includes those features.

## Docker / VPS

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t youruser/pluma:latest --push .
```

See `docker-compose.example.yml` for a Compose skeleton.

Health checks: `GET /healthz`, `GET /readyz`  
Feeds: `/sitemap.xml`, `/rss.xml`, `/robots.txt` (optional `?locale=`)  
Runtime config: `GET /env`

## Local production

```bash
npm run build
npm start
# http://localhost:3000
```

## Multi-language

UI locales: `en` (default, no URL prefix), `ku`, `ar`, `es`, `fr`, `de` (prefixed, e.g. `/fr/posts/...`).

The UI always starts in **English** unless the visitor opens a prefixed URL (e.g. `/ku`). Branding **primary locale** is for content defaults only — it no longer redirects the whole site UI.

Content tables store `locale` and optional `translation_group_id`. Feeds accept `?locale=fr`.

Configure enabled locales and primary locale under **Dashboard → Branding / locale settings**.

## Vercel / Netlify

**Vercel & Netlify:** use Nuxt’s zero-config SSR deploy. Nitro serves `/sitemap.xml`, `/rss.xml`, `/robots.txt`, `/env`, `/healthz`, and `/readyz` from `src/server/routes`.

- **Vercel:** keep `vercel.json` minimal (`framework: nuxtjs`). Clear any manual **Output Directory** override (`dist` breaks `/_nuxt` assets).
- **Netlify:** keep `netlify.toml` minimal (build command only). Do **not** publish `dist` or SPA-redirect `/*` to a document function — same MIME / white-screen failure as the old Vercel setup. Legacy helpers under `api/` and `netlify/functions/` are unused by the SSR path.

Use the same `VITE_*` / `NUXT_PUBLIC_*` env vars as Docker.

## Backup

- Database: Supabase / Postgres dump
- Storage buckets: `post-thumbnails`, `profile-avatar`, `branding`
- After restore of an **older** dump, re-run `src/install/pluma_rls_fix.sql` if storage or settings writes fail; current `pluma_initial.sql` installs already include those policies
