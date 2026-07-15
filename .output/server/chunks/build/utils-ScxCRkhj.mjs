import { i as getRuntimeEnvSync } from './server.mjs';

function getBrowserOrigin() {
  var _a, _b;
  const configuredSiteUrl = (_b = (_a = getRuntimeEnvSync()) == null ? void 0 : _a.VITE_SITE_URL) == null ? void 0 : _b.trim();
  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/+$/, "");
  }
  return "";
}
function getBrowserUrl() {
  return "";
}

export { getBrowserUrl as a, getBrowserOrigin as g };
//# sourceMappingURL=utils-ScxCRkhj.mjs.map
