#!/bin/sh
set -eu

# Operators set VITE_* only. Nuxt overrides runtimeConfig.public from
# NUXT_PUBLIC_* at process start, so mirror VITE_* → NUXT_PUBLIC_* here.
# Do not document or require NUXT_PUBLIC_* in .env / compose.
if [ -n "${VITE_SUPABASE_URL:-}" ]; then
  export NUXT_PUBLIC_SUPABASE_URL="$VITE_SUPABASE_URL"
fi
if [ -n "${VITE_SUPABASE_ANON_KEY:-}" ]; then
  export NUXT_PUBLIC_SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY"
fi
if [ -n "${VITE_SITE_URL:-}" ]; then
  export NUXT_PUBLIC_SITE_URL="$VITE_SITE_URL"
fi
if [ -n "${VITE_ENV:-}" ]; then
  export NUXT_PUBLIC_ENV="$VITE_ENV"
fi
if [ -n "${VITE_SITE_LOCALE:-}" ]; then
  export NUXT_PUBLIC_SITE_LOCALE="$VITE_SITE_LOCALE"
fi
if [ -n "${VITE_TWITTER_SITE:-}" ]; then
  export NUXT_PUBLIC_TWITTER_SITE="$VITE_TWITTER_SITE"
fi
if [ -n "${VITE_FEEDS_CACHE_TTL_MS:-}" ]; then
  export NUXT_FEEDS_CACHE_TTL_MS="$VITE_FEEDS_CACHE_TTL_MS"
fi

mkdir -p /app/public 2>/dev/null || true

echo "[entrypoint] Starting Pluma (Nuxt) with runtime env"

exec "$@"
