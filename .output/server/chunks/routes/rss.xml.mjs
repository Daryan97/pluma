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

const rss_xml = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const filters = parseFeedFilters(query);
  if (typeof query.locale === "string") filters.locale = query.locale;
  const generator = createFeedGenerator(event);
  const { rss } = await generator.generate({ rssFilters: filters });
  setHeader(event, "Content-Type", "application/rss+xml; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=60");
  return rss;
});

export { rss_xml as default };
//# sourceMappingURL=rss.xml.mjs.map
