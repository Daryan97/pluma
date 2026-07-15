/**
 * Resolve category display row + all related ids for filtering posts.
 * Translations often keep the source category_id, and category siblings
 * may share a translation_group_id or the same slug across locales.
 */
export async function resolveCategoryFilter(supabase, slug, locale) {
  if (!slug || String(slug).toLowerCase() === "uncategorized") {
    return { category: null, categoryIds: null };
  }

  const { data: bySlug, error } = await supabase
    .from("categories")
    .select("id, name, slug, locale, translation_group_id")
    .eq("slug", slug);

  if (error) {
    return { category: null, categoryIds: [], error };
  }

  let rows = bySlug || [];
  if (!rows.length) {
    const { data: fuzzy } = await supabase
      .from("categories")
      .select("id, name, slug, locale, translation_group_id")
      .ilike("slug", slug);
    rows = fuzzy || [];
  }

  if (!rows.length) {
    return { category: null, categoryIds: [] };
  }

  const groupIds = [
    ...new Set(rows.map((r) => r.translation_group_id).filter(Boolean)),
  ];
  if (groupIds.length) {
    const { data: siblings } = await supabase
      .from("categories")
      .select("id, name, slug, locale, translation_group_id")
      .in("translation_group_id", groupIds);
    if (siblings?.length) {
      const byId = new Map(rows.map((r) => [r.id, r]));
      for (const s of siblings) byId.set(s.id, s);
      rows = [...byId.values()];
    }
  }

  const category =
    rows.find((r) => r.locale === locale) ||
    rows.find((r) => r.slug === slug) ||
    rows[0];

  return {
    category,
    categoryIds: [...new Set(rows.map((r) => r.id))],
    error: null,
  };
}

/**
 * Categories to show in locale chrome: locale-native rows, plus any
 * categories referenced by published posts in that locale (so chips
 * appear even when only the source-locale category row exists).
 * Includes a synthetic "uncategorized" entry when published posts have
 * no category_id.
 */
export async function loadCategoriesForLocale(supabase, locale) {
  const [{ data: native }, { data: postCats }, { count: uncategorizedCount }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("id, name, slug, locale, translation_group_id")
        .eq("locale", locale)
        .order("name"),
      supabase
        .from("posts")
        .select(
          "category_id, category:categories ( id, name, slug, locale, translation_group_id )"
        )
        .eq("status", "published")
        .eq("locale", locale)
        .not("category_id", "is", null),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .eq("locale", locale)
        .is("category_id", null),
    ]);

  const bySlug = new Map();
  for (const c of native || []) {
    if (c?.slug) bySlug.set(c.slug, c);
  }
  for (const row of postCats || []) {
    const c = row?.category;
    if (!c?.slug) continue;
    const existing = bySlug.get(c.slug);
    if (!existing || (c.locale === locale && existing.locale !== locale)) {
      bySlug.set(c.slug, c);
    }
  }

  const list = [...bySlug.values()].sort((a, b) =>
    String(a.name || "").localeCompare(String(b.name || ""))
  );

  if ((uncategorizedCount || 0) > 0) {
    list.push({
      id: null,
      name: null,
      slug: "uncategorized",
      locale,
      translation_group_id: null,
    });
  }

  return list;
}
