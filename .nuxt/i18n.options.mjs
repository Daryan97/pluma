
// @ts-nocheck


export const localeCodes =  [
  "en",
  "ku",
  "ar",
  "es",
  "fr",
  "de"
]

export const localeLoaders = {
  en: [
    {
      key: "locale_en_46json_c72587b4",
      load: () => import("#nuxt-i18n/c72587b4" /* webpackChunkName: "locale_en_46json_c72587b4" */),
      cache: true
    }
  ],
  ku: [
    {
      key: "locale_ku_46json_d640beeb",
      load: () => import("#nuxt-i18n/d640beeb" /* webpackChunkName: "locale_ku_46json_d640beeb" */),
      cache: true
    }
  ],
  ar: [
    {
      key: "locale_ar_46json_cc8ede9e",
      load: () => import("#nuxt-i18n/cc8ede9e" /* webpackChunkName: "locale_ar_46json_cc8ede9e" */),
      cache: true
    }
  ],
  es: [
    {
      key: "locale_es_46json_e6292bd2",
      load: () => import("#nuxt-i18n/e6292bd2" /* webpackChunkName: "locale_es_46json_e6292bd2" */),
      cache: true
    }
  ],
  fr: [
    {
      key: "locale_fr_46json_0f744e2d",
      load: () => import("#nuxt-i18n/0f744e2d" /* webpackChunkName: "locale_fr_46json_0f744e2d" */),
      cache: true
    }
  ],
  de: [
    {
      key: "locale_de_46json_b92507d1",
      load: () => import("#nuxt-i18n/b92507d1" /* webpackChunkName: "locale_de_46json_b92507d1" */),
      cache: true
    }
  ]
}

export const vueI18nConfigs = []

export const nuxtI18nOptions = {
  restructureDir: false,
  experimental: {
    localeDetector: "",
    switchLocalePathLinkSSR: false,
    autoImportTranslationFunctions: false,
    typedPages: true,
    typedOptionsAndMessages: false,
    generatedLocaleFilePathFormat: "absolute",
    alternateLinkCanonicalQueries: false,
    hmr: true
  },
  bundle: {
    compositionOnly: true,
    runtimeOnly: false,
    fullInstall: true,
    dropMessageCompiler: false,
    optimizeTranslationDirective: false
  },
  compilation: {
    strictMessage: true,
    escapeHtml: false
  },
  customBlocks: {
    defaultSFCLang: "json",
    globalSFCScope: false
  },
  locales: [
    {
      code: "en",
      language: "en-US",
      name: "English",
      files: [
        {
          path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/en.json",
          cache: undefined
        }
      ]
    },
    {
      code: "ku",
      language: "ku",
      name: "کوردی",
      dir: "rtl",
      files: [
        {
          path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/ku.json",
          cache: undefined
        }
      ]
    },
    {
      code: "ar",
      language: "ar",
      name: "العربية",
      dir: "rtl",
      files: [
        {
          path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/ar.json",
          cache: undefined
        }
      ]
    },
    {
      code: "es",
      language: "es-ES",
      name: "Español",
      files: [
        {
          path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/es.json",
          cache: undefined
        }
      ]
    },
    {
      code: "fr",
      language: "fr-FR",
      name: "Français",
      files: [
        {
          path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/fr.json",
          cache: undefined
        }
      ]
    },
    {
      code: "de",
      language: "de-DE",
      name: "Deutsch",
      files: [
        {
          path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/de.json",
          cache: undefined
        }
      ]
    }
  ],
  defaultLocale: "en",
  defaultDirection: "ltr",
  routesNameSeparator: "___",
  trailingSlash: false,
  defaultLocaleRouteNameSuffix: "default",
  strategy: "prefix_except_default",
  lazy: true,
  langDir: "locales",
  rootRedirect: undefined,
  detectBrowserLanguage: false,
  differentDomains: false,
  baseUrl: "http://localhost:3000",
  customRoutes: "page",
  pages: {},
  skipSettingLocaleOnNavigate: false,
  types: "composition",
  debug: false,
  parallelPlugin: false,
  multiDomainLocales: false,
  i18nModules: []
}

export const normalizedLocales = [
  {
    code: "en",
    language: "en-US",
    name: "English",
    files: [
      {
        path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/en.json",
        cache: undefined
      }
    ]
  },
  {
    code: "ku",
    language: "ku",
    name: "کوردی",
    dir: "rtl",
    files: [
      {
        path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/ku.json",
        cache: undefined
      }
    ]
  },
  {
    code: "ar",
    language: "ar",
    name: "العربية",
    dir: "rtl",
    files: [
      {
        path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/ar.json",
        cache: undefined
      }
    ]
  },
  {
    code: "es",
    language: "es-ES",
    name: "Español",
    files: [
      {
        path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/es.json",
        cache: undefined
      }
    ]
  },
  {
    code: "fr",
    language: "fr-FR",
    name: "Français",
    files: [
      {
        path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/fr.json",
        cache: undefined
      }
    ]
  },
  {
    code: "de",
    language: "de-DE",
    name: "Deutsch",
    files: [
      {
        path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/de.json",
        cache: undefined
      }
    ]
  }
]

export const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n"
export const parallelPlugin = false
export const isSSG = false
export const hasPages = true

export const DEFAULT_COOKIE_KEY = "i18n_redirected"
export const DEFAULT_DYNAMIC_PARAMS_KEY = "nuxtI18nInternal"
export const SWITCH_LOCALE_PATH_LINK_IDENTIFIER = "nuxt-i18n-slp"
/** client **/

/** client-end **/