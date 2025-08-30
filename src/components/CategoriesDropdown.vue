<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton
      class="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
    >
      <Icon icon="mdi:category" class="text-lg" />
      <span class="hidden md:inline">Categories</span>
      <Icon icon="mdi:chevron-down" class="text-lg" />
    </MenuButton>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 focus:outline-none z-50"
      >
        <div class="py-1">
          <MenuItem
            v-for="category in categories"
            :key="category.id"
            v-slot="{ close }"
            class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <router-link
              :to="`/category/${category.name}`"
              class="flex items-center gap-2"
              @mouseup.prevent="close"
            >
                <Icon icon="mdi:label-outline" class="text-lg" />
              {{ category.name }}
            </router-link>
          </MenuItem>
        </div>
      </MenuItems>
    </Transition>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { Icon } from "@iconify/vue";

function addUncategorizedCategory(categories) {
  return [{ id: null, name: "Uncategorized" }, ...categories];
}

function sortCategories(categories) {
  return categories.sort((a, b) => a.name.localeCompare(b.name));
}

const props = defineProps({
  categories: Object,
});

const categories = sortCategories(addUncategorizedCategory(props.categories));
</script>
