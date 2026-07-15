import { c as defineEventHandler, e as setHeader } from '../_/nitro.mjs';
import { c as createFeedGenerator } from '../_/createFeedGenerator.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@supabase/supabase-js';

const robots_txt = defineEventHandler(async (event) => {
  const generator = createFeedGenerator(event);
  const { robots } = await generator.generate();
  setHeader(event, "Content-Type", "text/plain; charset=utf-8");
  return robots;
});

export { robots_txt as default };
//# sourceMappingURL=robots.txt.mjs.map
