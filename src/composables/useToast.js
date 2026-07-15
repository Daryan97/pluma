/**
 * SSR-safe toast helper.
 * vue-toastification is CommonJS and breaks Nitro ESM named imports on the server.
 * The client plugin provides $toast; on the server we return no-ops.
 */
function noopToast() {
  const noop = () => undefined;
  return {
    success: noop,
    error: noop,
    info: noop,
    warning: noop,
    clear: noop,
    dismiss: noop,
    update: noop,
  };
}

export function useToast() {
  if (import.meta.server) {
    return noopToast();
  }
  try {
    const { $toast } = useNuxtApp();
    if ($toast) return $toast;
  } catch {
    /* no nuxt app yet */
  }
  return noopToast();
}
