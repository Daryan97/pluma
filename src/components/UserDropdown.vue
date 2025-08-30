<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton
      class="flex items-center gap-1 text-gray-700 dark:text-gray-300"
    >
      <AvatarRoot
        class="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
      >
        <AvatarImage
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="User Avatar"
          class="w-full h-full object-cover"
        />
        <AvatarFallback
          class="w-full h-full flex items-center justify-center text-gray-500"
        >
          <Icon icon="mdi:account" class="text-2xl" />
        </AvatarFallback>
      </AvatarRoot>
      {{ user?.display_name || "Guest" }}
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
        class="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 focus:outline-none z-50"
      >
        <div class="py-1">
          <template v-if="user">
            <MenuItem v-slot="{ close }">
              <router-link
                to="/profile"
                class="flex items-center gap-2 px-4 py-2"
                @mouseup.prevent="close"
              >
                <Icon icon="mdi:account-edit" />
                Profile
              </router-link>
            </MenuItem>
            <hr class="border-t border-gray-200 dark:border-gray-700" />
            <MenuItem v-slot="{ close }">
              <router-link
                to="/change-password"
                class="flex items-center gap-2 px-4 py-2"
                @mouseup.prevent="close"
              >
                <Icon icon="mdi:lock-reset" />
                Change Password
              </router-link>
            </MenuItem>
            <hr class="border-t border-gray-200 dark:border-gray-700" />
            <MenuItem v-slot="{ close }">
              <button
                @click="
                  () => {
                    close();
                    logout();
                  }
                "
                class="flex items-center gap-2 w-full px-4 py-2 text-red-500"
                @mouseup.prevent="close"
              >
                <Icon icon="mdi:logout" />
                Logout
              </button>
            </MenuItem>
          </template>
          <template v-else>
            <MenuItem v-slot="{ close }">
              <router-link
                to="/login"
                class="flex items-center gap-2 px-4 py-2"
                @mouseup.prevent="close"
              >
                <Icon icon="mdi:login" />
                Login
              </router-link>
            </MenuItem>
            <MenuItem v-slot="{ close }">
              <router-link
                to="/signup"
                class="flex items-center gap-2 px-4 py-2"
                @mouseup.prevent="close"
              >
                <Icon icon="mdi:account-plus" />
                Signup
              </router-link>
            </MenuItem>
          </template>
        </div>
      </MenuItems>
    </Transition>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { Icon } from "@iconify/vue";
import { AvatarFallback, AvatarImage, AvatarRoot } from "radix-vue";
import { supabase } from "@/services/supabase";

const props = defineProps({
  user: Object,
  avatarUrl: String,
});

const logout = async () => {
  await supabase.auth.signOut();
  window.location.href = "/";
};
</script>
