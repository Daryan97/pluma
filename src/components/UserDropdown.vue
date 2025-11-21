<template>
  <DropdownMenuRoot v-model:open="open">
    <DropdownMenuTrigger
      class="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 group"
      aria-label="User menu"
    >
      <AvatarRoot
        class="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ring-1 ring-gray-300 dark:ring-gray-600"
      >
        <AvatarImage
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="User Avatar"
          class="w-full h-full object-cover"
        />
        <AvatarFallback
          class="w-full h-full flex items-center justify-center text-gray-500 text-sm"
        >
          <Icon icon="mdi:account" class="text-lg" />
        </AvatarFallback>
      </AvatarRoot>
      <span class="max-w-[90px] truncate font-medium">{{ displayName }}</span>
      <Icon
        icon="mdi:chevron-down"
        class="text-lg opacity-60 group-hover:opacity-80 transition"
      />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        class="min-w-[240px] p-1.5 rounded-xl bg-white/95 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700/50 shadow-lg focus:outline-none text-sm origin-top-right data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade"
        :side-offset="8"
        align="end"
      >
        <div class="px-3 pt-2 pb-3 flex items-center gap-3">
          <AvatarRoot
            class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden ring-1 ring-gray-300 dark:ring-gray-600"
          >
            <AvatarImage
              v-if="avatarUrl"
              :src="avatarUrl"
              :alt="displayName"
              class="w-full h-full object-cover"
            />
            <AvatarFallback
              class="w-full h-full flex items-center justify-center text-gray-500"
            >
              <Icon icon="mdi:account" class="text-xl" />
            </AvatarFallback>
          </AvatarRoot>
          <div class="flex-1 min-w-0">
            <p class="text-gray-900 dark:text-gray-100 font-medium truncate">
              {{ displayName }}
            </p>
            <div class="mt-1 flex flex-wrap items-center gap-1.5">
              <span
                :class="
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ' +
                  roleInfo.classes
                "
              >
                <Icon :icon="roleInfo.icon" class="text-xs" />
                {{ roleInfo.label }}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator class="h-px bg-gray-200 dark:bg-gray-700 my-1" />
        <template v-if="user">
          <DropdownMenuItem @select="go('/profile')" class="menu-item">
            <Icon icon="mdi:account-edit" class="text-base" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem @select="go('/change-password')" class="menu-item">
            <Icon icon="mdi:lock-reset" class="text-base" />
            <span>Change Password</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            v-if="user.role === 'admin' || user.role === 'author'"
            @select="go('/dashboard')"
            class="menu-item"
          >
            <Icon icon="mdi:view-dashboard-outline" class="text-base" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator
            class="h-px bg-gray-200 dark:bg-gray-700 my-1"
          />
          <DropdownMenuItem
            @select="logout"
            class="menu-item text-red-600 dark:text-red-400 data-[highlighted]:bg-red-100 dark:data-[highlighted]:bg-red-900/40"
          >
            <Icon icon="mdi:logout" class="text-base" />
            <span>Logout</span>
          </DropdownMenuItem>
        </template>
        <template v-else>
          <DropdownMenuItem @select="go('/login')" class="menu-item">
            <Icon icon="mdi:login" class="text-base" />
            <span>Login</span>
          </DropdownMenuItem>
          <DropdownMenuItem @select="go('/signup')" class="menu-item">
            <Icon icon="mdi:account-plus" class="text-base" />
            <span>Signup</span>
          </DropdownMenuItem>
        </template>
        <DropdownMenuArrow class="fill-white dark:fill-gray-800" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "radix-vue";
import { supabase } from "@/services/supabase";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  user: Object,
  avatarUrl: String,
});

const open = ref(false);
const router = useRouter();
const displayName = computed(
  () => props.user?.display_name || props.user?.username || "Guest"
);

const roleInfo = computed(() => {
  const role = props.user?.role || (props.user ? "reader" : "guest");
  switch (role) {
    case "admin":
      return {
        label: "Admin",
        icon: "mdi:shield-crown-outline",
        classes: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
      };
    case "author":
      return {
        label: "Author",
        icon: "mdi:pen",
        classes:
          "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
      };
    case "reader":
      return {
        label: "Reader",
        icon: "mdi:book-open-page-variant",
        classes:
          "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300",
      };
    default:
      return {
        label: "Guest",
        icon: "mdi:account-outline",
        classes:
          "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400",
      };
  }
});

function go(path) {
  open.value = false;
  router.push(path);
}

const logout = async () => {
  await supabase.auth.signOut();
  window.location.href = "/";
};
</script>
