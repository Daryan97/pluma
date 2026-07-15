/**
 * Count logical posts: translation siblings share translation_group_id
 * and should only count once.
 */
export function countDistinctPosts(rows) {
  if (!Array.isArray(rows) || !rows.length) return 0;
  const keys = new Set();
  for (const row of rows) {
    if (!row) continue;
    keys.add(row.translation_group_id || row.id);
  }
  return keys.size;
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {(q: any) => any} [applyFilters] mutate/return the posts query
 */
export async function countLogicalPosts(supabase, applyFilters) {
  let query = supabase.from("posts").select("id, translation_group_id");
  if (typeof applyFilters === "function") {
    query = applyFilters(query) || query;
  }
  const { data, error } = await query;
  if (error) return { count: 0, error };
  return { count: countDistinctPosts(data), error: null };
}
