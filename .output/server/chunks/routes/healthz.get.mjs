import { c as defineEventHandler } from '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const healthz_get = defineEventHandler(() => {
  return { ok: true, service: "pluma", ts: Date.now() };
});

export { healthz_get as default };
//# sourceMappingURL=healthz.get.mjs.map
