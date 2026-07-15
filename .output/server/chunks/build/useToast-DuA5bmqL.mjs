function noopToast() {
  const noop = () => void 0;
  return {
    success: noop,
    error: noop,
    info: noop,
    warning: noop,
    clear: noop,
    dismiss: noop,
    update: noop
  };
}
function useToast() {
  {
    return noopToast();
  }
}

export { useToast as u };
//# sourceMappingURL=useToast-DuA5bmqL.mjs.map
