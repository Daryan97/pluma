# Deploying Pluma

Pluma is a Nuxt 3 SSR app. The production process is a Nitro Node server that serves the site and generates feeds from Supabase at request time.

This document covers environment variables, database setup, Docker, Vercel, Netlify, health checks, and backups.

---

## Contents

1. [Environment variables](#environment-variables)
2. [Database setup](#database-setup)
3. [Docker](#docker)
4. [Local production build](#local-production-build)
5. [Vercel](#vercel)
6. [Netlify](#netlify)
7. [Reverse proxy and TLS](#reverse-proxy-and-tls)
8. [Health checks and endpoints](#health-checks-and-endpoints)
9. [Feeds and SEO](#feeds-and-seo)
10. [Multi-language](#multi-language)
11. [Backups and restore](#backups-and-restore)
12. [Troubleshooting](#troubleshooting)

---

## Environment variables

Set **only** `VITE_*` names. Do not also set `NUXT_PUBLIC_*`. The Docker entrypoint maps `VITE_*` to Nuxt’s runtime config. On Vercel/Netlify, Nuxt reads `VITE_*` from the environment the same way.

Copy the template:

```bash
cp .env.example .env
```

### Required

| Variable | Example | Purpose |
|----------|---------|---------|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase project API URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | Supabase anon / publishable key |
| `VITE_SITE_URL` | `https://blog.example.com` | Public site origin (no trailing slash). Used for canonical URLs, sitemap, RSS, Open Graph, and i18n `baseUrl` |
| `VITE_ENV` | `production` | Use `production` for live deploys; `development` enables `/test` and other dev-only routes |

### Optional

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_SITE_LOCALE` | `en` | Default content/UI locale hint |
| `VITE_TWITTER_SITE` | _(empty)_ | Twitter/X site handle for cards (e.g. `@pluma`) |
| `VITE_FEEDS_CACHE_TTL_MS` | `300000` (5 min) | In-memory cache TTL for sitemap/RSS data |
| `PORT` / `NITRO_PORT` | `3000` locally; `80` in Docker | HTTP listen port |
| `HOST` | `0.0.0.0` in Docker | Bind address |

### Notes

- `VITE_SITE_URL` must match the URL users open in the browser (scheme + host, and port if non-default). Wrong values break canonical links, sitemap, and OAuth redirects.
- The anon key is safe for the browser. Never put the Supabase **service role** key in this app’s env.
- Changing env vars on Docker requires a container restart. On Vercel/Netlify, trigger a new deploy after changing env.

---

## Database setup

Pluma expects Supabase Auth, Postgres tables, RLS policies, and storage buckets defined by the install scripts under `src/install/`.

### New project

1. Create a Supabase project.
2. Either:
   - Start the app and open `/install` (English path only; localized `/ku/install` redirects to `/install`), **or**
   - Run [`src/install/pluma_initial.sql`](../src/install/pluma_initial.sql) in the Supabase SQL editor.
3. Complete the install wizard (admin user, branding) if you used `/install`.

`pluma_initial.sql` already includes series, scheduling, preview tokens, locales, and RLS helpers.

### Upgrading an older Pluma database

Run in order only if that upgrade has not been applied yet:

| Order | Script | Adds |
|-------|--------|------|
| 1 | [`pluma_features_v2.sql`](../src/install/pluma_features_v2.sql) | Scheduling, preview tokens, series |
| 2 | [`pluma_i18n_v3.sql`](../src/install/pluma_i18n_v3.sql) | Content `locale` + translation groups |
| — | [`pluma_rls_fix.sql`](../src/install/pluma_rls_fix.sql) | Storage/settings RLS fixes after a restore |

Do **not** re-run v2/v3 after a fresh `pluma_initial.sql` install unless you know you need them.

### Storage buckets

Install scripts create (or expect) buckets such as:

- `post-thumbnails` — cover images
- `profile-avatar` — user avatars
- `branding` — logos, favicon, OG assets

Ensure they are public (or otherwise reachable) if the app stores public URLs for those objects.

### Auth redirect URLs

In Supabase → Authentication → URL configuration, allow:

- `https://your-domain/` (and `http://localhost:3000/` for local)
- Any OAuth callback URLs you enable (see Dashboard → provider settings in the app)

---

## Docker

### Published image

```text
daryan997/pluma:latest
```

Multi-arch (`linux/amd64`, `linux/arm64`) builds are pushed to Docker Hub.

### Compose (recommended)

Use [`docker-compose.example.yml`](../docker-compose.example.yml):

```bash
cp docker-compose.example.yml docker-compose.yml
# edit environment values
docker compose up -d
```

Example service:

```yaml
services:
  app:
    image: daryan997/pluma:latest
    restart: unless-stopped
    ports:
      - "80:80"
    environment:
      VITE_SITE_URL: "https://blog.example.com"
      VITE_SUPABASE_URL: "https://xxxx.supabase.co"
      VITE_SUPABASE_ANON_KEY: "your_supabase_anon_key"
      VITE_ENV: "production"
    healthcheck:
      test:
        [
          "CMD",
          "node",
          "-e",
          "fetch('http://127.0.0.1/healthz').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))",
        ]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```

No build-args are required. Credentials are read at **container start**.

### Build your own image

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t youruser/pluma:latest \
  --push .
```

For a local single-arch build:

```bash
docker build -t pluma:local .
docker run --rm -p 8080:80 \
  -e VITE_SUPABASE_URL=... \
  -e VITE_SUPABASE_ANON_KEY=... \
  -e VITE_SITE_URL=http://localhost:8080 \
  -e VITE_ENV=production \
  pluma:local
```

### Entrypoint behavior

[`docker-entrypoint.sh`](../docker-entrypoint.sh) mirrors `VITE_*` → `NUXT_PUBLIC_*` (and feed TTL) so Nitro can override `runtimeConfig` without operators setting both names. Then it starts:

```text
node .output/server/index.mjs
```

---

## Local production build

```bash
npm install
npm run build
npm start
```

Default URL: [http://localhost:3000](http://localhost:3000).

Load env from `.env` or the shell. Same `VITE_*` rules as Docker.

Useful scripts:

| Script | Action |
|--------|--------|
| `npm run dev` | Development server |
| `npm run build` | Production Nitro build → `.output/` |
| `npm start` | Run `.output/server/index.mjs` |
| `npm run preview` | Nuxt preview of the production build |

---

## Vercel

1. Import the GitHub repo in Vercel.
2. Framework preset: **Nuxt.js** (see [`vercel.json`](../vercel.json)).
3. Set the required `VITE_*` environment variables.
4. Deploy.

Do **not** set Output Directory to `dist` or another static folder. Nitro must serve the SSR app; a static output directory breaks `/_nuxt` assets (wrong MIME / white screen).

Keep [`vercel.json`](../vercel.json) minimal (`framework: nuxtjs`, build command). Avoid SPA rewrites that send all routes to a single HTML document.

One-click: use the Deploy button in the [README](../README.md).

---

## Netlify

1. Import the repo in Netlify.
2. Build command: `npm run build` (see [`netlify.toml`](../netlify.toml)).
3. Node 20 is set in `netlify.toml`.
4. Set the same `VITE_*` variables (Site settings → Environment variables, or the deploy-button template prompts).

Do **not**:

- Publish directory `dist`
- Add a catch-all `/*` → SPA / document function rewrite

Those patterns serve HTML for JS chunks and break the app. Let Netlify’s Nuxt/Nitro integration handle SSR.

---

## Reverse proxy and TLS

Put Caddy, nginx, Traefik, or a cloud load balancer in front of the container if you terminate TLS elsewhere.

Requirements:

- Forward `Host` and `X-Forwarded-Proto` (or equivalent) so generated absolute URLs stay correct.
- `VITE_SITE_URL` must be the public HTTPS origin users see.
- WebSocket is not required for normal Pluma traffic.

Example nginx upstream (container on `127.0.0.1:8080`):

```nginx
location / {
  proxy_pass http://127.0.0.1:8080;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## Health checks and endpoints

| Path | Purpose |
|------|---------|
| `GET /healthz` | Liveness (process up) |
| `GET /readyz` | Readiness (dependencies OK when implemented) |
| `GET /env` | Public runtime config for the client (no secrets beyond anon key already public) |
| `GET /manifest.webmanifest` | Web app manifest (from branding) |
| `GET /manifest.json` | Same as above (alias) |

Docker Compose example healthcheck hits `/healthz` on the container’s port `80`.

---

## Feeds and SEO

| Path | Description |
|------|-------------|
| `/sitemap.xml` | Live sitemap from published posts/categories |
| `/rss.xml` | RSS feed |
| `/robots.txt` | Robots rules |

Optional query: `?locale=fr` (and other enabled locale codes) to filter feed content.

Sitemap/RSS use an in-memory cache (`VITE_FEEDS_CACHE_TTL_MS`, default 5 minutes). New posts appear after the TTL without rebuilding the image.

Public HTML routes include Open Graph / Twitter meta and related SEO tags from branding and post data.

---

## Multi-language

UI locales:

| Code | URL |
|------|-----|
| `en` | `/` (no prefix) |
| `ku`, `ar`, `es`, `fr`, `de` | `/ku/...`, `/ar/...`, etc. |

- The UI stays on English unless the visitor opens a prefixed URL (or switches locale in the UI).
- Branding **primary locale** affects content defaults, not a forced site-wide redirect.
- Posts, categories, and series store `locale` (and optional `translation_group_id`).
- Configure enabled locales under **Dashboard → locale / branding settings**.

---

## Backups and restore

### What to back up

1. **Database** — Supabase dashboard backup or `pg_dump`
2. **Storage** — buckets `post-thumbnails`, `profile-avatar`, `branding`
3. **Env / secrets** — your `.env` or host env (not committed)

### After restore

1. Point `VITE_SUPABASE_URL` / anon key at the restored project.
2. If storage or settings writes fail on an older dump, run [`pluma_rls_fix.sql`](../src/install/pluma_rls_fix.sql).
3. Confirm Auth redirect URLs still match `VITE_SITE_URL`.

---

## Troubleshooting

### White screen / JS served as HTML

Usually a static publish directory or SPA catch-all on Vercel/Netlify. Use Nitro SSR; do not publish `dist`.

### Install loop or `/install` forever

- Confirm `VITE_SUPABASE_URL` and anon key are correct.
- Confirm the `settings` table exists and `installation` was written by the wizard or SQL.
- Check browser/network errors against Supabase (CORS, wrong project).

### Sitemap/RSS empty or stale

- Confirm posts are `published` and match the locale filter.
- Wait for feed cache TTL, or lower `VITE_FEEDS_CACHE_TTL_MS` temporarily.
- Confirm the anon key can `SELECT` the needed rows under RLS.

### OAuth / magic link fails

- Add the site URL to Supabase Auth redirect allow list.
- Enable the provider in both Supabase and Pluma Dashboard → provider settings.

### Avatars or logos 404

- Confirm storage buckets exist and objects are public (or URLs are otherwise reachable).
- Re-upload from Dashboard → branding / profile if URLs point at an old project.

### Container starts but `/env` shows placeholders

- Env vars were not passed into the container (Compose `environment` / `env_file`).
- Restart after fixing env; build-args are not used for secrets.
