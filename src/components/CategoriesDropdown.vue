<template>
  <DropdownMenuRoot v-model:open="open">
    <DropdownMenuTrigger
      class="nav-pill data-[state=open]:bg-gray-200 dark:data-[state=open]:bg-gray-700/60"
      aria-label="Categories menu"
    >
      <Icon icon="mdi:tag-multiple-outline" class="text-base" />
      <span class="hidden md:inline">Categories</span>
      <Icon icon="mdi:chevron-down" class="text-base opacity-70" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        class="min-w-[220px] max-h-[60vh] overflow-auto p-1.5 rounded-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-lg focus:outline-none origin-top-right data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade"
        :side-offset="8"
        align="end"
      >
        <div class="px-2 pb-1 pt-1.5 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md mb-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
          <Icon icon="mdi:tag-multiple" class="text-sm" /> Browse Categories
        </div>
        <DropdownMenuItem
          v-for="cat in categoriesList"
          :key="cat.slug || cat.name || 'uncategorized'"
          class="menu-item"
          @select="go(cat.slug || cat.name)"
        >
          <Icon :icon="cat.id ? 'mdi:tag-outline' : 'mdi:tag-off-outline'" class="text-base opacity-80" />
          <span class="truncate flex-1">{{ cat.name }}</span>
          <Icon icon="mdi:chevron-right" class="text-xs opacity-40" />
        </DropdownMenuItem>
        <DropdownMenuArrow class="fill-white dark:fill-gray-800" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { DropdownMenuArrow, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'radix-vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  categories: { type: Array, default: () => [] }
})

const open = ref(false)
const router = useRouter()

function addUncategorized(list){
  return [{ id: null, name: 'Uncategorized', slug: 'uncategorized' }, ...list]
}
function sortList(list){
  return [...list].sort((a,b)=> a.name.localeCompare(b.name))
}
const categoriesList = computed(()=> sortList(addUncategorized(props.categories || [])))

function go(slug){
  open.value = false
  router.push(`/category/${slug}`)
}
</script>
