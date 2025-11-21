#!/bin/sh
set -eu

RUNTIME_ENV_FILE="/usr/share/nginx/html/env"

cat <<EOF > "$RUNTIME_ENV_FILE"
{
  "VITE_SUPABASE_URL": "${VITE_SUPABASE_URL:-}",
  "VITE_SUPABASE_ANON_KEY": "${VITE_SUPABASE_ANON_KEY:-}",
  "VITE_ENV": "${VITE_ENV:-production}",
  "VITE_SITE_URL": "${VITE_SITE_URL:-}"
}
EOF
