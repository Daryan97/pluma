/**
 * Serve /sw.js as a real JS response (not the Nuxt HTML shell).
 * Browsers that still have an old localhost service worker keep requesting this path.
 */
export default defineEventHandler((event) => {
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
