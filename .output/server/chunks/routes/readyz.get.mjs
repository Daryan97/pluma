import { c as defineEventHandler, u as useRuntimeConfig, f as setResponseStatus } from '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const readyz_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const url = config.public.supabaseUrl || process.env.VITE_SUPABASE_URL;
  const key = config.public.supabaseAnonKey || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    setResponseStatus(event, 503);
    return { ok: false, reason: "missing_supabase_env" };
  }
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/auth/v1/health`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    if (!res.ok) {
      setResponseStatus(event, 503);
      return { ok: false, reason: "supabase_unreachable", status: res.status };
    }
    return { ok: true };
  } catch (e) {
    setResponseStatus(event, 503);
    return { ok: false, reason: (e == null ? void 0 : e.message) || "supabase_error" };
  }
});

export { readyz_get as default };
//# sourceMappingURL=readyz.get.mjs.map
