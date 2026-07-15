// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

const publicDir = fileURLToPath(new URL('./src/public', import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-07-14',
  srcDir: 'src',
  dir: {
    // Keep static assets next to srcDir so Nitro copies them into .output/public
    public: publicDir,
  },
  ssr: true,
  devtools: { enabled: false },

  css: [
    '~/styles/index.css',
    'highlight.js/styles/github.css',
    'highlight.js/styles/github-dark.css',
    'vue-toastification/dist/index.css',
  ],

  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],

  pinia: {
    storesDirs: ['./src/stores/**'],
  },

  i18n: {
    restructureDir: false,
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ku', language: 'ku', name: 'کوردی', file: 'ku.json', dir: 'rtl' },
      { code: 'ar', language: 'ar', name: 'العربية', file: 'ar.json', dir: 'rtl' },
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' },
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    lazy: true,
    langDir: 'locales',
    // English until the user picks another locale (/ku, /ar, …). Do not sniff
    // Accept-Language (that forced Kurdish browsers onto /ku). Branding
    // primaryLocale is content-only — see middleware/primary-locale.global.js.
    detectBrowserLanguage: false,
    baseUrl: process.env.VITE_SITE_URL || 'http://localhost:3000',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  runtimeConfig: {
    feedsCacheTtlMs: Number(process.env.VITE_FEEDS_CACHE_TTL_MS || 5 * 60 * 1000),
    public: {
      // Build-time defaults from VITE_*. Docker entrypoint mirrors them to
      // NUXT_PUBLIC_* so Nuxt can override runtimeConfig at process start —
      // operators should only set VITE_* in .env / compose.
      supabaseUrl: process.env.VITE_SUPABASE_URL || '',
      supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || '',
      siteUrl: process.env.VITE_SITE_URL || '',
      siteLocale: process.env.VITE_SITE_LOCALE || 'en',
      env: process.env.VITE_ENV || 'development',
      twitterSite: process.env.VITE_TWITTER_SITE || '',
    },
  },

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // Bundle CJS toast package so Nitro ESM does not named-import it raw
      noExternal: ['vue-toastification'],
    },
  },

  build: {
    transpile: ['vue-toastification'],
  },

  nitro: {
    // Feed helpers live in src/server/utils/feeds (auto-imported)
    publicAssets: [
      {
        baseURL: '/',
        dir: publicDir,
        maxAge: 60 * 60 * 24 * 7,
      },
    ],
  },

  app: {
    head: {
      title: 'Pluma',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'A simple and modern blogging platform built with Nuxt and Supabase.',
        },
      ],
      link: [
        { rel: 'alternate', type: 'application/rss+xml', title: 'Pluma RSS', href: '/rss.xml' },
        { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' },
      ],
      // Apply saved theme before first paint to avoid light→dark flash
      // (primary boot is also in app.html; this is a backup for shells without app.html)
      script: [
        {
          key: 'pluma-theme-boot',
          innerHTML:
            `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){var m=document.cookie.match(/(?:^|; )pluma_theme=([^;]*)/);if(m)t=decodeURIComponent(m[1])}if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t}catch(e){}})();`,
          tagPosition: 'head',
        },
      ],
    },
  },

  experimental: {
    // Off: enabling caused stuck pending/skeleton states on client hydrate.
    // Revisit after measuring client-nav payload reuse carefully.
    payloadExtraction: false,
    appManifest: false,
  },
})
