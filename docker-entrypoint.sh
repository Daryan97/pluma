#!/bin/sh
set -eu

# Nuxt runtimeConfig.public is overridden by NUXT_PUBLIC_* at process start.
# Map the historical VITE_* Docker env names so SSR gets real credentials
# (build-time VITE_* are often empty in the image).
if [ -n "${VITE_SUPABASE_URL:-}" ] && [ -z "${NUXT_PUBLIC_SUPABASE_URL:-}" ]; then
  export NUXT_PUBLIC_SUPABASE_URL="$VITE_SUPABASE_URL"
fi
if [ -n "${VITE_SUPABASE_ANON_KEY:-}" ] && [ -z "${NUXT_PUBLIC_SUPABASE_ANON_KEY:-}" ]; then
  export NUXT_PUBLIC_SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY"
fi
if [ -n "${VITE_SITE_URL:-}" ] && [ -z "${NUXT_PUBLIC_SITE_URL:-}" ]; then
  export NUXT_PUBLIC_SITE_URL="$VITE_SITE_URL"
fi
if [ -n "${VITE_ENV:-}" ] && [ -z "${NUXT_PUBLIC_ENV:-}" ]; then
  export NUXT_PUBLIC_ENV="$VITE_ENV"
fi
if [ -n "${VITE_SITE_LOCALE:-}" ] && [ -z "${NUXT_PUBLIC_SITE_LOCALE:-}" ]; then
  export NUXT_PUBLIC_SITE_LOCALE="$VITE_SITE_LOCALE"
fi
if [ -n "${VITE_TWITTER_SITE:-}" ] && [ -z "${NUXT_PUBLIC_TWITTER_SITE:-}" ]; then
  export NUXT_PUBLIC_TWITTER_SITE="$VITE_TWITTER_SITE"
fi

mkdir -p /app/public 2>/dev/null || true

echo "[entrypoint] Starting Pluma (Nuxt) with runtime env"

exec "$@"
