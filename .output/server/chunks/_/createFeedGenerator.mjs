import { u as useRuntimeConfig } from './nitro.mjs';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_SITE_NAME = "Pluma";
const DEFAULT_SITE_DESCRIPTION = "A modern, open-source blogging platform.";
const STATIC_ROUTES = [
  { path: "/", priority: 1, changefreq: "daily" },
  { path: "/archive", priority: 0.8, changefreq: "weekly" },
  { path: "/login", priority: 0.4, changefreq: "monthly" },
  { path: "/signup", priority: 0.6, changefreq: "monthly" }
];
function normalizeSiteUrl(url) {
  if (!url) return "http://localhost:5173";
  return url.replace(/\/$/, "");
}
function escapeXml(value = "") {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function toCData(value = "") {
  const safe = value.replace(/]]>/g, "]]]]><![CDATA[>");
  return `<![CDATA[${safe}]]>`;
}
function stripFormatting(value = "") {
  return value.replace(/<[^>]+>/g, "").replace(/[`*_#>\-]/g, "").replace(/\s+/g, " ").trim();
}
function formatIso(date) {
  return new Date(date || Date.now()).toISOString().split("T")[0];
}
function formatRssDate(date) {
  return new Date(date || Date.now()).toUTCString();
}
function detectMimeType(url) {
  if (!url) return null;
  const clean = url.split("?")[0];
  const ext = clean.includes(".") ? clean.split(".").pop().toLowerCase() : "";
  const map = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    avif: "image/avif"
  };
  return map[ext] || null;
}
function normalizeFilterValue(value) {
  if (value === void 0 || value === null) return "";
  return value.toString().trim().toLowerCase();
}
function collectParam(searchParams, key) {
  if (!searchParams) return [];
  if (typeof searchParams.getAll === "function") {
    return searchParams.getAll(key);
  }
  const raw = searchParams[key];
  if (raw === void 0 || raw === null) return [];
  return Array.isArray(raw) ? raw : [raw];
}
function parseFeedFilters(searchParams) {
  if (!searchParams) return {};
  const categories = collectParam(searchParams, "category").map(normalizeFilterValue).filter(Boolean);
  const authors = collectParam(searchParams, "author").map(normalizeFilterValue).filter(Boolean);
  const tags = collectParam(searchParams, "tag").map(normalizeFilterValue).filter(Boolean);
  const localeRaw = collectParam(searchParams, "locale")[0];
  const locale = localeRaw ? normalizeFilterValue(localeRaw) : "";
  return {
    categories,
    authors,
    tags,
    locale
  };
}
function applyPostFilters(posts, filters = {}) {
  var _a, _b, _c;
  const hasCategory = (_a = filters.categories) == null ? void 0 : _a.length;
  const hasAuthor = (_b = filters.authors) == null ? void 0 : _b.length;
  const hasTags = (_c = filters.tags) == null ? void 0 : _c.length;
  const hasLocale = !!filters.locale;
  if (!hasCategory && !hasAuthor && !hasTags && !hasLocale) return posts;
  return posts.filter((post) => {
    var _a2, _b2, _c2, _d;
    if (hasLocale) {
      const postLocale = normalizeFilterValue((post == null ? void 0 : post.locale) || "en");
      if (postLocale !== filters.locale) return false;
    }
    if (hasCategory) {
      const slug = normalizeFilterValue((_a2 = post == null ? void 0 : post.category) == null ? void 0 : _a2.slug);
      const name = normalizeFilterValue((_b2 = post == null ? void 0 : post.category) == null ? void 0 : _b2.name);
      if (!filters.categories.some((value) => value === slug || value === name)) {
        return false;
      }
    }
    if (hasAuthor) {
      const username = normalizeFilterValue((_c2 = post == null ? void 0 : post.author) == null ? void 0 : _c2.username);
      const display = normalizeFilterValue((_d = post == null ? void 0 : post.author) == null ? void 0 : _d.display_name);
      if (!filters.authors.some((value) => value === username || value === display)) {
        return false;
      }
    }
    if (hasTags) {
      const postTags = ((post == null ? void 0 : post.tags) || []).map(normalizeFilterValue);
      if (!filters.tags.some((value) => postTags.includes(value))) {
        return false;
      }
    }
    return true;
  });
}
function describeFilters(filters = {}) {
  var _a, _b, _c;
  const chunks = [];
  if ((_a = filters.categories) == null ? void 0 : _a.length) chunks.push(`categories: ${filters.categories.join(", ")}`);
  if ((_b = filters.authors) == null ? void 0 : _b.length) chunks.push(`authors: ${filters.authors.join(", ")}`);
  if ((_c = filters.tags) == null ? void 0 : _c.length) chunks.push(`tags: ${filters.tags.join(", ")}`);
  return chunks.length ? chunks.join(" | ") : "";
}
class FeedGenerator {
  constructor(options = {}) {
    var _a;
    this.supabaseUrl = options.supabaseUrl;
    this.supabaseAnonKey = options.supabaseAnonKey;
    this.defaultBaseUrl = normalizeSiteUrl(options.siteUrl);
    this.supabase = this.supabaseUrl && this.supabaseAnonKey ? createClient(this.supabaseUrl, this.supabaseAnonKey) : null;
    this.cacheTtl = (_a = options.cacheTtl) != null ? _a : 60 * 1e3;
    this.cache = null;
    this.cacheTimestamp = 0;
  }
  async publishDuePosts() {
    if (!this.supabase) return 0;
    try {
      const { data, error } = await this.supabase.rpc("publish_due_posts");
      if (error) return 0;
      return Number(data) || 0;
    } catch (_) {
      return 0;
    }
  }
  async fetchRemoteData() {
    var _a, _b, _c, _d;
    if (!this.supabase) {
      return { posts: [], archivedPosts: [], categories: [], branding: null };
    }
    await this.publishDuePosts();
    const postSelect = `
          id,
          title,
          slug,
          locale,
          content,
          tags,
          updated_at,
          created_at,
          cover_image_url,
          status,
          category:categories (
            name,
            slug,
            locale
          ),
          author:profiles (
            username,
            display_name
          )
        `;
    const [posts, archived, categories, branding] = await Promise.all([
      this.supabase.from("posts").select(postSelect).eq("status", "published").order("created_at", { ascending: false }),
      this.supabase.from("posts").select(postSelect).eq("status", "archived").order("created_at", { ascending: false }),
      this.supabase.from("categories").select("slug, name, updated_at, created_at, locale").order("name", { ascending: true }),
      this.supabase.from("settings").select("value").eq("key", "branding").maybeSingle()
    ]);
    if (posts.error) {
      console.warn("[feeds] Failed to fetch posts for RSS", posts.error);
    }
    if (archived.error) {
      console.warn("[feeds] Failed to fetch archived posts for SEO", archived.error);
    }
    if (categories.error) {
      console.warn("[feeds] Failed to fetch categories for sitemap", categories.error);
    }
    if (branding.error) {
      console.warn("[feeds] Failed to fetch branding info", branding.error);
    }
    return {
      posts: (_a = posts.data) != null ? _a : [],
      archivedPosts: (_b = archived.data) != null ? _b : [],
      categories: (_c = categories.data) != null ? _c : [],
      branding: ((_d = branding.data) == null ? void 0 : _d.value) || null
    };
  }
  async getData() {
    const now = Date.now();
    if (this.cache && now - this.cacheTimestamp < this.cacheTtl) {
      return this.cache;
    }
    try {
      this.cache = await this.fetchRemoteData();
    } catch (error) {
      console.warn("[feeds] Failed to fetch Supabase data, falling back to cached data.", error);
      this.cache = this.cache || { posts: [], archivedPosts: [], categories: [], branding: null };
    }
    this.cacheTimestamp = Date.now();
    return this.cache;
  }
  async generate({ baseUrl, rssFilters } = {}) {
    const effectiveBase = normalizeSiteUrl(baseUrl || this.defaultBaseUrl);
    const data = await this.getData();
    const sitemap = buildSitemap(effectiveBase, data);
    const rss = buildRss(effectiveBase, data, { filters: rssFilters });
    const robots = buildRobots(effectiveBase);
    return { sitemap, rss, robots, data, baseUrl: effectiveBase };
  }
}
function buildSitemap(baseUrl, data) {
  const urls = [];
  const now = formatIso(Date.now());
  for (const route of STATIC_ROUTES) {
    urls.push({
      loc: `${baseUrl}${route.path}`,
      priority: route.priority.toFixed(1),
      changefreq: route.changefreq,
      lastmod: now
    });
  }
  for (const category of data.categories || []) {
    if (!(category == null ? void 0 : category.slug)) continue;
    urls.push({
      loc: `${baseUrl}/category/${category.slug}`,
      priority: "0.6",
      changefreq: "weekly",
      lastmod: formatIso(category.updated_at || category.created_at || Date.now())
    });
  }
  for (const post of data.posts || []) {
    if (!(post == null ? void 0 : post.slug)) continue;
    urls.push({
      loc: `${baseUrl}/posts/${post.slug}`,
      priority: "0.9",
      changefreq: "weekly",
      lastmod: formatIso(post.updated_at || post.created_at || Date.now())
    });
  }
  const xml = [`<?xml version="1.0" encoding="UTF-8"?>`, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`];
  for (const entry of urls) {
    xml.push("  <url>");
    xml.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
    xml.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    xml.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    xml.push(`    <priority>${entry.priority}</priority>`);
    xml.push("  </url>");
  }
  xml.push("</urlset>");
  return xml.join("\n");
}
function buildRss(baseUrl, data, options = {}) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const siteName = ((_a = data.branding) == null ? void 0 : _a.siteName) || DEFAULT_SITE_NAME;
  const siteDescription = ((_b = data.branding) == null ? void 0 : _b.siteDescription) || DEFAULT_SITE_DESCRIPTION;
  const filters = options.filters || {};
  const posts = applyPostFilters(data.posts || [], filters).slice(0, 50);
  const filtersLabel = describeFilters(filters);
  const faviconUrl = ((_c = data.branding) == null ? void 0 : _c.faviconUrl) || ((_d = data.branding) == null ? void 0 : _d.lightLogoUrl) || ((_e = data.branding) == null ? void 0 : _e.darkLogoUrl);
  const mediaNamespace = "http://search.yahoo.com/mrss/";
  const feedDescription = filtersLabel ? `${siteDescription} (Filtered by ${filtersLabel})` : siteDescription;
  const channel = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="${mediaNamespace}">`,
    "  <channel>",
    `    <title>${escapeXml(siteName)}</title>`,
    `    <link>${escapeXml(baseUrl + "/")}</link>`,
    `    <description>${escapeXml(feedDescription)}</description>`,
    `    <atom:link href="${escapeXml(baseUrl + "/rss.xml")}" rel="self" type="application/rss+xml" />`,
    `    <lastBuildDate>${formatRssDate(((_f = posts[0]) == null ? void 0 : _f.updated_at) || Date.now())}</lastBuildDate>`,
    `    <language>en</language>`
  ];
  if (faviconUrl) {
    channel.push("    <image>");
    channel.push(`      <url>${escapeXml(faviconUrl)}</url>`);
    channel.push(`      <title>${escapeXml(siteName)}</title>`);
    channel.push(`      <link>${escapeXml(baseUrl + "/")}</link>`);
    channel.push("    </image>");
  }
  if (filtersLabel) {
    channel.push(`    <category>${escapeXml(filtersLabel)}</category>`);
  }
  for (const post of posts) {
    const postUrl = `${baseUrl}/posts/${post.slug}`;
    const excerptSource = post.excerpt || post.content || "";
    const excerpt = stripFormatting(excerptSource).slice(0, 280);
    const thumbnailUrl = post.cover_image_url;
    const thumbnailType = detectMimeType(thumbnailUrl);
    channel.push("    <item>");
    channel.push(`      <title>${toCData(post.title || "Untitled")}</title>`);
    channel.push(`      <link>${escapeXml(postUrl)}</link>`);
    channel.push(`      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>`);
    channel.push(`      <pubDate>${formatRssDate(post.created_at)}</pubDate>`);
    channel.push(`      <description>${toCData(excerpt)}</description>`);
    if ((_g = post.category) == null ? void 0 : _g.name) {
      channel.push(`      <category domain="category">${escapeXml(post.category.name)}</category>`);
    }
    if (post.tags && Array.isArray(post.tags)) {
      for (const tag of post.tags) {
        if (!tag) continue;
        channel.push(`      <category domain="tag">${escapeXml(tag)}</category>`);
      }
    }
    if (((_h = post.author) == null ? void 0 : _h.display_name) || ((_i = post.author) == null ? void 0 : _i.username)) {
      channel.push(`      <author>${escapeXml(post.author.display_name || post.author.username)}</author>`);
    }
    if (thumbnailUrl) {
      const typeAttr = thumbnailType ? ` type="${thumbnailType}"` : "";
      channel.push(`      <enclosure url="${escapeXml(thumbnailUrl)}"${typeAttr} />`);
      channel.push(`      <media:content url="${escapeXml(thumbnailUrl)}" medium="image"${typeAttr} />`);
      channel.push(`      <media:thumbnail url="${escapeXml(thumbnailUrl)}" />`);
    }
    channel.push("    </item>");
  }
  channel.push("  </channel>");
  channel.push("</rss>");
  return channel.join("\n");
}
function buildRobots(baseUrl) {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /dashboard",
    "Disallow: /profile",
    `Sitemap: ${baseUrl}/sitemap.xml`
  ].join("\n");
}

function createFeedGenerator(event) {
  const config = useRuntimeConfig(event);
  return new FeedGenerator({
    supabaseUrl: config.public.supabaseUrl || process.env.VITE_SUPABASE_URL,
    supabaseAnonKey: config.public.supabaseAnonKey || process.env.VITE_SUPABASE_ANON_KEY,
    siteUrl: config.public.siteUrl || process.env.VITE_SITE_URL || "http://localhost:3000",
    cacheTtl: config.feedsCacheTtlMs || Number(process.env.FEEDS_CACHE_TTL_MS || 5 * 60 * 1e3)
  });
}

export { createFeedGenerator as c, parseFeedFilters as p };
//# sourceMappingURL=createFeedGenerator.mjs.map
