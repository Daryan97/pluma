import { c as defineEventHandler, g as getQuery, e as setHeader } from '../_/nitro.mjs';
import { p as parseFeedFilters, c as createFeedGenerator } from '../_/createFeedGenerator.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@supabase/supabase-js';

const sitemap_xml = defineEventHandler(async (event) => {
  const filters = parseFeedFilters(getQuery(event));
  const generator = createFeedGenerator(event);
  const { sitemap } = await generator.generate({ rssFilters: filters });
  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=60");
  return sitemap;
});

export { sitemap_xml as default };
//# sourceMappingURL=sitemap.xml.mjs.map
