import fs from 'fs'

const path = 'src/components/PostForm.vue'
let s = fs.readFileSync(path, 'utf8')

if (!s.includes('useI18n()')) {
  s = s.replace(
    '<script setup>',
    "<script setup>\nconst { t } = useI18n()\nconst localePath = useLocalePath()\n"
  )
}

const reps = [
  ['Edit Blog Post', "{{ t('postForm.editTitle') }}"],
  ['New Blog Post', "{{ t('postForm.newTitle') }}"],
  ['Craft engaging content for your readers.', "{{ t('postForm.subtitle') }}"],
  ['View Post', "{{ t('postForm.viewPost') }}"],
  ['Basic Info', "{{ t('postForm.basicInfo') }}"],
  ['Enter post title', "{{ t('postForm.titlePlaceholder') }}"],
  ['Auto from title', "{{ t('postForm.autoFromTitle') }}"],
  ['Markdown supported', "{{ t('postForm.markdownSupported') }}"],
  ['Add tag…', "{{ t('postForm.addTag') }}"],
  ['Add tag...', "{{ t('postForm.addTag') }}"],
  ['Press Enter or comma.', "{{ t('postForm.tagHint') }}"],
  ['Select author', "{{ t('postForm.selectAuthor') }}"],
  ['Schedule publish', "{{ t('postForm.schedulePublish') }}"],
  ['Select a category', "{{ t('postForm.selectCategory') }}"],
  ['New category', "{{ t('postForm.newCategory') }}"],
  ['Upload Image', "{{ t('postForm.uploadImage') }}"],
  ['Image URL', "{{ t('postForm.imageUrl') }}"],
  ['Click or drop an image here', "{{ t('postForm.dropHint') }}"],
  ['Enter image URL', "{{ t('postForm.enterImageUrl') }}"],
  ['Disable Comments', "{{ t('postForm.disableComments') }}"],
  ['Comments Disabled', "{{ t('postForm.commentsDisabled') }}"],
  ['When enabled, readers cannot leave comments on this post.', "{{ t('postForm.commentsHelper') }}"],
  ['Saving Draft...', "{{ t('postForm.savingDraft') }}"],
  ['Save Draft', "{{ t('postForm.saveDraft') }}"],
  ['Copy preview link', "{{ t('postForm.copyPreviewLink') }}"],
  ["to=\"/dashboard\"", ":to=\"localePath('/dashboard')\""],
  ["router.push(\"/dashboard\")", "router.push(localePath('/dashboard'))"],
  ["router.push('/dashboard')", "router.push(localePath('/dashboard'))"],
]

for (const [a, b] of reps) {
  if (s.includes(a) && !s.includes(b.replace('{{ ', '').slice(0, 20))) {
    // for template replacements of plain text that become mustaches
    if (b.startsWith('{{') && a.includes('{{')) {
      s = s.split(a).join(b)
    } else if (b.startsWith('{{')) {
      // avoid replacing inside already-translated areas repeatedly
      const re = new RegExp(a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      s = s.replace(re, (match, offset) => {
        const left = s.slice(Math.max(0, offset - 15), offset)
        if (left.includes("t('") || left.includes('{{ t')) return match
        return b
      })
    } else {
      s = s.split(a).join(b)
    }
    console.log('ok', a.slice(0, 40))
  } else {
    console.log('skip', a.slice(0, 40))
  }
}

// button label helpers in script
s = s.replace(
  /if \(status\.value === "draft"\) return "Publish Post";/,
  "if (status.value === \"draft\") return t('postForm.publishPost');"
)
s = s.replace(
  /return props\.mode === "create" \? "Publish Post" : "Update Post";/,
  "return props.mode === \"create\" ? t('postForm.publishPost') : t('postForm.updatePost');"
)
s = s.replace(
  /return "Archive Post";/,
  "return t('postForm.archivePost');"
)
s = s.replace(
  /\? "Edit Post"/g,
  "? t('postForm.editPost')"
)
s = s.replace(
  /: "Create Post"/g,
  ": t('postForm.createPost')"
)
s = s.replace(
  />\s*Back\s*</g,
  ">{{ t('common.back') }}<"
)
s = s.replace(
  />\s*Title\s*</g,
  ">{{ t('postForm.title') }}<"
)
s = s.replace(
  />\s*Slug\s*</g,
  ">{{ t('postForm.slug') }}<"
)
s = s.replace(
  />\s*Content\s*</g,
  ">{{ t('postForm.content') }}<"
)
s = s.replace(
  />\s*Tags\s*</g,
  ">{{ t('postForm.tags') }}<"
)
s = s.replace(
  />\s*Publishing\s*</g,
  ">{{ t('postForm.publishing') }}<"
)
s = s.replace(
  />\s*Author\s*</g,
  ">{{ t('postForm.author') }}<"
)
s = s.replace(
  />\s*Status\s*</g,
  ">{{ t('postForm.status') }}<"
)
s = s.replace(
  />\s*Category\s*</g,
  ">{{ t('postForm.category') }}<"
)
s = s.replace(
  />\s*Series\s*</g,
  ">{{ t('postForm.series') }}<"
)
s = s.replace(
  />\s*Thumbnail\s*</g,
  ">{{ t('postForm.thumbnail') }}<"
)
s = s.replace(
  />\s*Options\s*</g,
  ">{{ t('postForm.options') }}<"
)
s = s.replace(
  />\s*Preview\s*</g,
  ">{{ t('postForm.preview') }}<"
)
s = s.replace(
  />\s*Draft\s*</g,
  ">{{ t('postForm.draft') }}<"
)

if (!s.includes('const localePath')) {
  s = s.replace(
    'const { t } = useI18n()',
    "const { t } = useI18n()\nconst localePath = useLocalePath()"
  )
}

fs.writeFileSync(path, s)
console.log('done PostForm')
