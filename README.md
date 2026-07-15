# Pluma

![Pluma Logo](https://ik.imagekit.io/daryandev/Pluma%20-%20Light%2016:9_EsbqpDdyIv?updatedAt=1756539494268)

Open-source blogging platform built with [Nuxt 3](https://nuxt.com/) and [Supabase](https://supabase.com/).

**Demo:** [pluma.daryandev.com](https://pluma.daryandev.com)

## Features

- Roles: admin, author, and reader
- Posts with Markdown editor, drafts, scheduled publish, and preview links
- Categories, series, comments (with moderation)
- Multi-language UI and content (`en`, `ku`, `ar`, `es`, `fr`, `de`)
- SSR with sitemap, RSS, robots.txt, and Open Graph / Twitter meta
- Branding, logos, favicon, and homepage layout from the dashboard
- Docker image, or deploy on Vercel / Netlify

## Stack

| Layer | Technology |
|-------|------------|
| App | Nuxt 3, Vue 3, Tailwind CSS |
| Auth & data | Supabase (Postgres, Auth, Storage) |
| Runtime | Nitro (Node SSR) |

## Requirements

- Node.js 20+
- A Supabase project (or compatible Postgres + Auth + Storage)

## Quick start

```bash
git clone https://github.com/Daryan97/pluma.git
cd pluma
npm install
cp .env.example .env
```

Edit `.env` with your Supabase URL, anon key, and public site URL (see [.env.example](.env.example)).

### Database

| Scenario | What to run |
|----------|-------------|
| New project | Open `/install` in the browser, or run [`src/install/pluma_initial.sql`](src/install/pluma_initial.sql) in the Supabase SQL editor |
| Upgrade (series / schedule / preview) | [`src/install/pluma_features_v2.sql`](src/install/pluma_features_v2.sql) |
| Upgrade (i18n content) | [`src/install/pluma_i18n_v3.sql`](src/install/pluma_i18n_v3.sql) (after v2) |
| Broken storage/settings RLS after restore | [`src/install/pluma_rls_fix.sql`](src/install/pluma_rls_fix.sql) |

Do not re-run v2/v3 after a fresh `pluma_initial.sql` install; those features are already included.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). In development, `/test` is available for diagnostics.

### Production (local)

```bash
npm run build
npm start
```

## Configuration

Use **only** `VITE_*` variables (do not also set `NUXT_PUBLIC_*`).

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase API URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `VITE_SITE_URL` | Yes | Public origin (canonical URLs, sitemap, RSS, i18n) |
| `VITE_ENV` | Yes | `production` or `development` |
| `VITE_SITE_LOCALE` | No | Default locale (default `en`) |
| `VITE_TWITTER_SITE` | No | Twitter/X `@handle` for cards |
| `VITE_FEEDS_CACHE_TTL_MS` | No | Feed cache TTL in ms (default `300000`) |

## Docker

Published image: [`daryan997/pluma`](https://hub.docker.com/r/daryan997/pluma)

```bash
docker compose -f docker-compose.example.yml up -d
```

Or set the same `VITE_*` variables on any container that runs `daryan997/pluma:latest` (port `80`).

Full deployment docs: **[docs/DEPLOY.md](docs/DEPLOY.md)**.

One-click hosts:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDaryan97%2Fpluma&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY,VITE_SITE_URL,VITE_ENV&envDescription=Required%20Pluma%20runtime%20variables%20(see%20docs%2FDEPLOY.md)&project-name=pluma&repository-name=pluma)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Daryan97/pluma)

## Documentation

- [Deployment](docs/DEPLOY.md) — Docker, Vercel, Netlify, env vars, health checks, backups
- [Contributing](CONTRIBUTING.md)

## License

[MIT](LICENSE)
