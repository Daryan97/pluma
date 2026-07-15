import { k as useRoute, u as useI18n, m as allConfiguredLocaleCodes, p as projectInfo, o as localizePath, r as resolveSeoImage, q as absoluteAssetUrl, t as robotsForClientPath, v as resolveTwitterSite, w as buildHreflangs, x as useSeoMeta, h as useHead, d as useBranding, y as stripLocalePrefix, e as useRuntimeConfig, l as useRequestEvent } from './server.mjs';
import { E as getRequestURL } from '../_/nitro.mjs';
import { computed, unref } from 'vue';

function useRequestURL(opts) {
  {
    return getRequestURL(useRequestEvent(), opts);
  }
}
function toIso(date) {
  if (!date) return null;
  try {
    return new Date(date).toISOString();
  } catch {
    return null;
  }
}
function stripFormatting(value = "") {
  return String(value).replace(/<[^>]+>/g, "").replace(/[`*_#>\-\[\]]/g, "").replace(/\s+/g, " ").trim();
}
function siteOrigin() {
  const config = useRuntimeConfig();
  const configured = String(config.public.siteUrl || "").replace(/\/$/, "");
  if (configured) return configured;
  try {
    const url = useRequestURL();
    return url.origin;
  } catch {
    return "";
  }
}
function pathWithoutLocale(fullPath, locales) {
  const path = String(fullPath || "/").split("?")[0].split("#")[0];
  return stripLocalePrefix(path, locales);
}
function usePageSeo(source) {
  const route = useRoute();
  const { locale, locales } = useI18n();
  const branding = useBranding();
  const config = useRuntimeConfig();
  const resolved = computed(() => {
    const raw = typeof source === "function" ? source() : unref(source);
    return raw && typeof raw === "object" ? raw : {};
  });
  const localeCodes = computed(() => {
    var _a;
    const enabled = (_a = branding.enabledLocales) == null ? void 0 : _a.value;
    if (Array.isArray(enabled) && enabled.length) return enabled;
    const fromI18n = (unref(locales) || []).map((l) => l.code).filter(Boolean);
    return fromI18n.length ? fromI18n : allConfiguredLocaleCodes();
  });
  const defaultLocale = "en";
  const origin = computed(() => siteOrigin());
  const siteName = computed(
    () => {
      var _a, _b;
      return resolved.value.siteName || ((_a = branding.resolveLocalizedSiteName) == null ? void 0 : _a.call(branding, unref(locale))) || ((_b = branding.siteName) == null ? void 0 : _b.value) || projectInfo.name || "Pluma";
    }
  );
  const siteDescription = computed(
    () => {
      var _a, _b;
      return resolved.value.siteDescription || ((_a = branding.resolveLocalizedSiteDescription) == null ? void 0 : _a.call(branding, unref(locale))) || ((_b = branding.siteDescription) == null ? void 0 : _b.value) || projectInfo.description || "A modern, open-source blogging platform.";
    }
  );
  const title = computed(() => {
    var _a;
    const t = (_a = resolved.value.title) == null ? void 0 : _a.trim();
    if (t) return t;
    return siteName.value;
  });
  const description = computed(() => {
    var _a;
    const d = (_a = resolved.value.description) == null ? void 0 : _a.trim();
    if (d) return d;
    return siteDescription.value;
  });
  const type = computed(() => resolved.value.type || "website");
  const canonical = computed(() => {
    if (resolved.value.canonical) return resolved.value.canonical;
    const base = origin.value;
    if (!base) return "";
    const bare = pathWithoutLocale(route.fullPath || route.path || "/", localeCodes.value);
    const localized = localizePath(bare, unref(locale) || defaultLocale, defaultLocale);
    return `${base}${localized === "/" ? "/" : localized}`;
  });
  const image = computed(() => {
    var _a, _b, _c, _d;
    const brandingBag = {
      ogImageUrl: (_a = branding.ogImageUrl) == null ? void 0 : _a.value,
      lightLogoUrl: (_b = branding.lightLogoUrl) == null ? void 0 : _b.value,
      darkLogoUrl: (_c = branding.darkLogoUrl) == null ? void 0 : _c.value,
      faviconUrl: (_d = branding.faviconUrl) == null ? void 0 : _d.value
    };
    const preferred = resolved.value.image || null;
    const resolvedImg = resolveSeoImage(preferred, brandingBag, origin.value) || (origin.value ? `${origin.value}/og-default.png` : "/og-default.png");
    return absoluteAssetUrl(resolvedImg, origin.value) || resolvedImg;
  });
  const robots = computed(
    () => resolved.value.robots || robotsForClientPath(String(route.path || "/"))
  );
  const twitterSite = computed(() => {
    var _a, _b;
    if (resolved.value.twitterSite) return resolved.value.twitterSite;
    return resolveTwitterSite({
      twitterHandle: (_a = branding.twitterHandle) == null ? void 0 : _a.value,
      socialLinks: ((_b = branding.socialLinks) == null ? void 0 : _b.value) || [],
      envHandle: config.public.twitterSite || ""
    });
  });
  const hreflangs = computed(() => {
    if (Array.isArray(resolved.value.hreflangs) && resolved.value.hreflangs.length) {
      return resolved.value.hreflangs;
    }
    const base = origin.value;
    if (!base) return [];
    const bare = pathWithoutLocale(route.fullPath || route.path || "/", localeCodes.value);
    return buildHreflangs(null, unref(locale) || defaultLocale, {
      baseUrl: base,
      path: bare,
      locales: localeCodes.value,
      defaultLocale
    });
  });
  const structuredData = computed(() => {
    if (resolved.value.structuredData !== void 0) {
      return resolved.value.structuredData;
    }
    if (type.value === "article" && resolved.value.article) {
      const a = resolved.value.article;
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: a.headline || title.value,
        description: description.value,
        datePublished: toIso(a.datePublished),
        dateModified: toIso(a.dateModified || a.datePublished),
        author: {
          "@type": "Person",
          name: a.author || "Unknown"
        },
        publisher: {
          "@type": "Organization",
          name: siteName.value,
          url: origin.value || void 0
        },
        image: image.value || void 0,
        keywords: a.keywords || void 0,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonical.value
        }
      };
    }
    if (type.value === "website" && (route.path === "/" || bareIsHome(route.path, localeCodes.value))) {
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteName.value,
        description: description.value,
        url: `${origin.value}/`,
        publisher: {
          "@type": "Organization",
          name: siteName.value,
          url: origin.value || void 0
        }
      };
    }
    if (resolved.value.collection) {
      return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: title.value,
        description: description.value,
        url: canonical.value
      };
    }
    return null;
  });
  const faviconHref = computed(
    () => {
      var _a;
      return ((_a = branding.faviconUrl) == null ? void 0 : _a.value) || "/favicon.png";
    }
  );
  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    robots: () => robots.value,
    googlebot: () => robots.value,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogType: () => type.value,
    ogSiteName: () => siteName.value,
    ogUrl: () => canonical.value || void 0,
    ogImage: () => image.value || void 0,
    ogLocale: () => String(unref(locale) || "en").replace("-", "_"),
    twitterCard: () => resolved.value.cardType || "summary_large_image",
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: () => image.value || void 0,
    twitterSite: () => twitterSite.value || void 0,
    twitterCreator: () => resolved.value.twitterCreator || void 0,
    articlePublishedTime: () => type.value === "article" ? toIso(resolved.value.publishedTime) : void 0,
    articleModifiedTime: () => type.value === "article" ? toIso(resolved.value.modifiedTime || resolved.value.publishedTime) : void 0
  });
  useHead(() => {
    const links = [
      { rel: "icon", href: faviconHref.value, key: "favicon" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", key: "apple-touch-icon" }
    ];
    if (canonical.value) {
      links.push({ rel: "canonical", href: canonical.value, key: "canonical" });
    }
    for (const h of hreflangs.value) {
      if (!(h == null ? void 0 : h.lang) || !(h == null ? void 0 : h.href)) continue;
      links.push({
        rel: "alternate",
        hreflang: h.lang,
        href: h.href,
        key: `hreflang-${h.lang}`
      });
    }
    const scripts = [];
    if (structuredData.value) {
      scripts.push({
        id: "ld-primary",
        type: "application/ld+json",
        key: "ld-primary",
        children: JSON.stringify(structuredData.value)
      });
    }
    return { link: links, script: scripts };
  });
}
function bareIsHome(path, locales) {
  return stripLocalePrefix(String(path || "/"), locales) === "/";
}
function articleSeoFromPost(post, siteName) {
  var _a, _b;
  if (!post) return { title: siteName || "Pluma", type: "website" };
  const excerpt = stripFormatting(post.content || "").slice(0, 160);
  const name = siteName || projectInfo.name || "Pluma";
  return {
    title: `${post.title || "Untitled"} | ${name}`,
    description: excerpt || void 0,
    type: "article",
    image: post.cover_image_url || null,
    publishedTime: post.created_at,
    modifiedTime: post.updated_at || post.created_at,
    article: {
      headline: post.title,
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
      author: ((_a = post.author) == null ? void 0 : _a.display_name) || ((_b = post.author) == null ? void 0 : _b.username) || "Unknown",
      keywords: Array.isArray(post.tags) ? post.tags.join(", ") : void 0
    }
  };
}

export { articleSeoFromPost as a, usePageSeo as u };
//# sourceMappingURL=usePageSeo-wMPCZyUZ.mjs.map
