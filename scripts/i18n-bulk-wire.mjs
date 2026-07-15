/**
 * Bulk-wire common UI strings in Vue SFCs to t() keys.
 * Safe-ish: only replaces known English literals listed below.
 */
import fs from 'fs'
import path from 'path'

const files = [
  'src/pages/dashboard/index.vue',
  'src/components/dashboard/StatsOverview.vue',
  'src/components/dashboard/PostsTable.vue',
  'src/components/dashboard/CommentsTable.vue',
  'src/components/dashboard/MembersManagement.vue',
  'src/components/dashboard/CategoriesManagement.vue',
  'src/components/dashboard/SeriesManagement.vue',
  'src/components/dashboard/PostFilters.vue',
  'src/components/Comments.vue',
  'src/components/Post.vue',
  'src/components/SeriesNav.vue',
  'src/components/ConfirmDialog.vue',
  'src/components/RouteLoadingOverlay.vue',
  'src/pages/category/[slug].vue',
  'src/pages/author/[username].vue',
  'src/pages/archive/category/[slug].vue',
  'src/pages/posts/[slug].vue',
  'src/pages/archive/post/[slug].vue',
  'src/components/PostForm.vue',
  'src/components/dashboard/StatsSettingsForm.vue',
  'src/components/dashboard/BrandingMetaForm.vue',
  'src/components/dashboard/FooterCreditsSettings.vue',
  'src/components/dashboard/ProviderSettingsForm.vue',
  'src/components/dashboard/LogoUpload.vue',
  'src/components/dashboard/MediaManager.vue',
]

// Exact string -> t() expression (without surrounding braces). Applied carefully.
const map = [
  ['Gathering your dashboard data...', "t('dashboard.gathering')"],
  ['New Post', "t('posts.newPost')"],
  ['Search posts...', "t('posts.searchPlaceholder')"],
  ['Clear search', "t('posts.clearSearch')"],
  ['All statuses', "t('posts.allStatuses')"],
  ['All categories', "t('posts.allCategories')"],
  ['All authors', "t('posts.allAuthors')"],
  ['Loading settings...', "t('dashboard.loadingSettings')"],
  ['Loading members...', "t('dashboard.loadingMembers')"],
  ['Confirm Action', "t('common.confirmAction')"],
  ['Are you sure?', "t('common.areYouSure')"],
  ['Delete this post?', "t('posts.deleteConfirm')"],
  ['Delete selected posts?', "t('posts.deleteSelectedConfirm')"],
  ['Delete this comment?', "t('comments.deleteConfirm')"],
  ['Total Posts', "t('dashboard.stats.totalPosts')"],
  ['Pending Comments', "t('dashboard.stats.pendingComments')"],
  ['No posts found', "t('posts.noPosts')"],
  ['Try adjusting filters', "t('posts.adjustFilters')"],
  ['Manage Categories', "t('categories.manage')"],
  ['Manage Series', "t('series.manage')"],
  ['New category name', "t('categories.newName')"],
  ['New series name', "t('series.newName')"],
  ['Add series', "t('series.add')"],
  ['Search comments...', "t('comments.searchPlaceholder')"],
  ['Search members...', "t('members.searchPlaceholder')"],
  ['No comments found', "t('comments.empty')"],
  ['No members found', "t('members.empty')"],
  ['Write a thoughtful comment...', "t('comments.placeholder')"],
  ['Post Comment', "t('comments.postComment')"],
  ['Posting...', "t('common.posting')"],
  ['Please sign in to comment', "t('comments.pleaseSignIn')"],
  ['Be the first to comment.', "t('comments.beFirst')"],
  ['No approved comments yet.', "t('comments.noApproved')"],
  ['No pending comments.', "t('comments.noPending')"],
  ['Loading more...', "t('comments.loadingMore')"],
  ['All comments loaded', "t('comments.allLoaded')"],
  ['Share this post', "t('posts.share')"],
  ['Copy Link', "t('posts.copyLink')"],
  ['Link Copied', "t('posts.linkCopied')"],
  ['min read', "t('posts.minRead', { count: readingMinutes })"],
  ['Post not found. Please check the URL.', "t('posts.notFound')"],
  ['Post Not Found', "t('posts.notFoundTitle')"],
  ['Preview mode - this draft is not publicly listed.', "t('posts.previewMode')"],
  ['Preview mode — this draft is not publicly listed.', "t('posts.previewMode')"],
  ['Comments are disabled for this post.', "t('posts.commentsDisabled')"],
  ['Author not found.', "t('author.notFound')"],
  ['Follow RSS', "t('category.followRss')"],
  ['No category assigned', "t('category.noCategory')"],
  ['Search anywhere...', "t('category.searchAnywhere')"],
  ['No archived posts in this category.', "t('archive.noPosts')"],
  ['Clear filters', "t('common.clearFilters')"],
  ['Save Changes', "t('common.save')"],
  ['Media Library', "t('media.title')"],
  ['Loading…', "t('common.loading')"],
  ['Loading...', "t('common.loading')"],
]

function ensureI18n(src) {
  if (src.includes('useI18n()') || src.includes('useI18n (')) return src
  // inject after <script setup> block start / after definePageMeta
  if (src.includes('definePageMeta')) {
    return src.replace(
      /definePageMeta\([^)]*\)[^\n]*\n/,
      (m) => m + "\nconst { t } = useI18n()\nconst localePath = useLocalePath()\n"
    )
  }
  if (src.includes('<script setup>')) {
    return src.replace(
      '<script setup>',
      "<script setup>\nconst { t } = useI18n()\nconst localePath = useLocalePath()\n"
    )
  }
  if (src.includes("<script setup lang=")) {
    return src.replace(
      /<script setup[^>]*>/,
      (m) => m + "\nconst { t } = useI18n()\nconst localePath = useLocalePath()\n"
    )
  }
  return src
}

function wrapInTemplate(expr, original) {
  // If original was already in mustache {{ }}, replace inner
  return expr
}

let total = 0
for (const file of files) {
  const full = path.join(process.cwd(), file)
  if (!fs.existsSync(full)) {
    console.log('skip missing', file)
    continue
  }
  let s = fs.readFileSync(full, 'utf8')
  s = ensureI18n(s)
  let count = 0
  for (const [en, expr] of map) {
    // Template text nodes and attribute values
    const patterns = [
      // {{ 'English' }} rare
      // plain text between tags
      [en, `{{ ${expr} }}`],
      [`"${en}"`, expr],
      [`'${en}'`, expr],
      [`placeholder="${en}"`, `:placeholder="${expr}"`],
      [`placeholder='${en}'`, `:placeholder="${expr}"`],
      [`title="${en}"`, `:title="${expr}"`],
      [`aria-label="${en}"`, `:aria-label="${expr}"`],
    ]
    for (const [a, b] of patterns) {
      if (!s.includes(a)) continue
      // Avoid double-wrapping already translated mustaches like {{ t('x') }} containing English substrings in keys
      if (a.startsWith('{{')) continue
      const occurrences = s.split(a).length - 1
      if (occurrences > 0) {
        // For bare text replacements, only replace when not already inside t('...')
        if (a === en) {
          // Replace text content carefully — skip if already {{ t(
          const parts = s.split(a)
          let rebuilt = parts[0]
          for (let i = 1; i < parts.length; i++) {
            const left = rebuilt.slice(-20)
            if (left.includes("t('") || left.includes('t("') || left.endsWith('{{ ')) {
              rebuilt += a + parts[i]
            } else {
              rebuilt += `{{ ${expr} }}` + parts[i]
              count++
            }
          }
          s = rebuilt
        } else {
          s = s.split(a).join(b)
          count += occurrences
        }
      }
    }
  }

  // localePath for common router paths
  s = s.replace(/router\.push\(['"`](\/[^'"`]+)['"`]\)/g, (m, p) => {
    if (m.includes('localePath')) return m
    count++
    return `router.push(localePath('${p}'))`
  })
  s = s.replace(/to=["'](\/[^"']+)["']/g, (m, p) => {
    if (m.includes('localePath') || p.startsWith('http')) return m
    count++
    return `:to="localePath('${p}')"`
  })

  fs.writeFileSync(full, s)
  console.log(file, 'changes~', count)
  total += count
}
console.log('total', total)
