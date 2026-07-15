import { c as defineEventHandler, e as setHeader } from '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const sw_js = defineEventHandler((event) => {
  setHeader(event, "Content-Type", "application/javascript; charset=utf-8");
  setHeader(event, "Cache-Control", "no-cache, no-store, must-revalidate");
  setHeader(event, "Service-Worker-Allowed", "/");
  return `/* Pluma: no app service worker. Unregister any previous SW. */
self.addEventListener("install", function () {
  self.skipWaiting();
});
self.addEventListener("activate", function (event) {
  event.waitUntil(
    (async function () {
      try {
        var keys = await caches.keys();
        await Promise.all(keys.map(function (k) { return caches.delete(k); }));
      } catch (e) {}
      try {
        await self.registration.unregister();
      } catch (e) {}
    })()
  );
});
`;
});

export { sw_js as default };
//# sourceMappingURL=sw.js.mjs.map
