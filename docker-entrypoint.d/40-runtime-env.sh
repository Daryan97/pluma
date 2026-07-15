#!/bin/sh
set -eu

# Legacy path used when the image still ran nginx.
# Prefer /docker-entrypoint.sh at the image root for the Node server.
RUNTIME_ENV_FILE="${RUNTIME_ENV_FILE:-/app/dist/env}"

cat <<EOF > "$RUNTIME_ENV_FILE"
{
  "VITE_SUPABASE_URL": "${VITE_SUPABASE_URL:-}",
  "VITE_SUPABASE_ANON_KEY": "${VITE_SUPABASE_ANON_KEY:-}",
  "VITE_ENV": "${VITE_ENV:-production}",
  "VITE_SITE_URL": "${VITE_SITE_URL:-}"
}
EOF
