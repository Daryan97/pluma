import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const theme = ref(
        localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    )

    const apply = (val) => {
        document.body.setAttribute('data-theme', val)
    }

    watch(theme, (val) => {
        localStorage.setItem('theme', val)
        apply(val)
    }, { immediate: true })

    function toggleTheme() {
        theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    return { theme, toggleTheme }
})
