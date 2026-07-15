// Placeholder so browsers requesting /sw.js do not fall through to Vue Router.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
