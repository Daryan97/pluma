# Pluma - Blogging Platform

![Pluma Logo](https://ik.imagekit.io/daryandev/Pluma%20-%20Light%2016:9_EsbqpDdyIv?updatedAt=1756539494268)

A modern, open-source blogging platform built with [Nuxt 3](https://nuxt.com/) (Vue 3 SSR) and [Supabase](https://supabase.com/).

## Features

- User authentication and role management (admin, author, reader)
- Post creation, editing, and deletion with rich text support
- Commenting system with moderation capabilities
- Responsive design for mobile and desktop
- **SSR** with live sitemap, RSS, robots, and SEO (OG/Twitter, JSON-LD, hreflang)
- **Multi-language** UI (`en`, `ku`, `ar`, `es`, `fr`, `de`) + per-locale posts/categories/series
- Scheduled publishing, draft preview links, and post series
- Deploy with Docker **or** Vercel / Netlify (see [docs/DEPLOY.md](docs/DEPLOY.md))

## Demo

A live demo of Pluma is available at [https://pluma.daryandev.com](https://pluma.daryandev.com). You can sign up as a new user to explore the platform's features (except admin functionalities).

## Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/Daryan97/pluma.git
    cd pluma
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Copy `example.env` to `.env` and set Supabase + public site URL (used for sitemap/RSS/canonical URLs):

    ```bash
    cp example.env .env
    ```

4. Set up Supabase:

    - **New installs:** open `/install` in the app (English only), or run `src/install/pluma_initial.sql` in the SQL editor.
      - Includes series, scheduling, preview tokens, locales, and RLS helpers in one script.
    - **Existing Pluma DBs** (upgrade in order as needed):
      - `src/install/pluma_features_v2.sql` — scheduling, preview tokens, series
      - `src/install/pluma_i18n_v3.sql` — multi-language content (`locale` + translation groups)
      - `src/install/pluma_rls_fix.sql` — only if storage/settings RLS is broken after a restore

5. Start the development server:

    ```bash
    npm run dev
    ```

6. Open `http://localhost:3000` (Nuxt default). In development, `/test` is available for diagnostics (storage, auth, i18n, feeds, RLS).

### Quick Deployment

See **[docs/DEPLOY.md](docs/DEPLOY.md)** for Docker, Vercel, Netlify, health checks, and backups.

For a quick Docker deployment using the published image:

```yaml
services:
  app:
    image: daryan997/pluma:latest
    restart: unless-stopped
    ports:
      - "80:80"
    environment:
      VITE_SITE_URL: "https://blog.example.com"
      VITE_SUPABASE_URL: "https://supabase.example.com"
      VITE_SUPABASE_ANON_KEY: "your_supabase_anon_key"
      VITE_ENV: "production"
```

The container runs **Nuxt Nitro** (Node) that:

- Serves the SSR Vue app
- Exposes `/env` runtime config for clients
- Generates **live** `/sitemap.xml`, `/rss.xml`, and `/robots.txt` from Supabase (including filters and `?locale=`)
- Renders SEO meta on the server for public routes
- Health endpoints: `/healthz`, `/readyz`

New posts appear in sitemap/RSS after the in-memory cache TTL (default 5 minutes) — no image rebuild required.

### Build and Deployment

#### Local production (SSR)

```bash
npm run build
npm start
```

Then open `http://localhost:3000`. The Nitro server reads env from the process / `.env`. Docker uses port `80` via `PORT` / `NITRO_PORT`.

Platform-specific notes (Vercel / Netlify) are in [docs/DEPLOY.md](docs/DEPLOY.md).

#### Docker / Compose

The `Dockerfile` builds a Node image that runs `.output/server/index.mjs`. **No build-args are required** — credentials and site URL come from container environment variables at runtime.

Build and push:

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t your-dockerhub-user/pluma:latest \
  --push .
```

Run with Compose (see also `docker-compose.example.yml`):

```yaml
services:
  app:
    image: your-dockerhub-user/pluma:latest
    restart: unless-stopped
    ports:
      - "80:80"
    environment:
      VITE_SUPABASE_URL: "https://supabase.example.com"
      VITE_SUPABASE_ANON_KEY: "your_supabase_anon_key"
      VITE_ENV: "production"
      VITE_SITE_URL: "https://blog.example.com"
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
