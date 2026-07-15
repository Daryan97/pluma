
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  CategoriesDropdown: typeof import("../../src/components/CategoriesDropdown.vue")['default']
  Comments: typeof import("../../src/components/Comments.vue")['default']
  ConfirmDialog: typeof import("../../src/components/ConfirmDialog.vue")['default']
  GlobalSearch: typeof import("../../src/components/GlobalSearch.vue")['default']
  NoImage: typeof import("../../src/components/NoImage.vue")['default']
  Post: typeof import("../../src/components/Post.vue")['default']
  PostForm: typeof import("../../src/components/PostForm.vue")['default']
  PostLoader: typeof import("../../src/components/PostLoader.vue")['default']
  RouteLoadingOverlay: typeof import("../../src/components/RouteLoadingOverlay.vue")['default']
  SeriesNav: typeof import("../../src/components/SeriesNav.vue")['default']
  UserDropdown: typeof import("../../src/components/UserDropdown.vue")['default']
  DashboardAuthProvidersSettingsForm: typeof import("../../src/components/dashboard/AuthProvidersSettingsForm.vue")['default']
  DashboardBrandingMetaForm: typeof import("../../src/components/dashboard/BrandingMetaForm.vue")['default']
  DashboardCategoriesManagement: typeof import("../../src/components/dashboard/CategoriesManagement.vue")['default']
  DashboardCommentsTable: typeof import("../../src/components/dashboard/CommentsTable.vue")['default']
  DashboardFooterCreditsSettings: typeof import("../../src/components/dashboard/FooterCreditsSettings.vue")['default']
  DashboardLocaleSettingsForm: typeof import("../../src/components/dashboard/LocaleSettingsForm.vue")['default']
  DashboardLogoUpload: typeof import("../../src/components/dashboard/LogoUpload.vue")['default']
  DashboardMediaManager: typeof import("../../src/components/dashboard/MediaManager.vue")['default']
  DashboardMembersManagement: typeof import("../../src/components/dashboard/MembersManagement.vue")['default']
  DashboardPendingComments: typeof import("../../src/components/dashboard/PendingComments.vue")['default']
  DashboardPostFilters: typeof import("../../src/components/dashboard/PostFilters.vue")['default']
  DashboardPostsTable: typeof import("../../src/components/dashboard/PostsTable.vue")['default']
  DashboardProviderSettingsForm: typeof import("../../src/components/dashboard/ProviderSettingsForm.vue")['default']
  DashboardSeriesManagement: typeof import("../../src/components/dashboard/SeriesManagement.vue")['default']
  DashboardSignedLinkDialog: typeof import("../../src/components/dashboard/SignedLinkDialog.vue")['default']
  DashboardStatsOverview: typeof import("../../src/components/dashboard/StatsOverview.vue")['default']
  DashboardStatsSettingsForm: typeof import("../../src/components/dashboard/StatsSettingsForm.vue")['default']
  LayoutFooter: typeof import("../../src/components/layout/Footer.vue")['default']
  LayoutLocaleSwitcher: typeof import("../../src/components/layout/LocaleSwitcher.vue")['default']
  LayoutNavbar: typeof import("../../src/components/layout/Navbar.vue")['default']
  UiCheckbox: typeof import("../../src/components/ui/Checkbox.vue")['default']
  NuxtWelcome: typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtLinkLocale: typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']
  SwitchLocalePathLink: typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']
  NuxtPage: typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyCategoriesDropdown: LazyComponent<typeof import("../../src/components/CategoriesDropdown.vue")['default']>
  LazyComments: LazyComponent<typeof import("../../src/components/Comments.vue")['default']>
  LazyConfirmDialog: LazyComponent<typeof import("../../src/components/ConfirmDialog.vue")['default']>
  LazyGlobalSearch: LazyComponent<typeof import("../../src/components/GlobalSearch.vue")['default']>
  LazyNoImage: LazyComponent<typeof import("../../src/components/NoImage.vue")['default']>
  LazyPost: LazyComponent<typeof import("../../src/components/Post.vue")['default']>
  LazyPostForm: LazyComponent<typeof import("../../src/components/PostForm.vue")['default']>
  LazyPostLoader: LazyComponent<typeof import("../../src/components/PostLoader.vue")['default']>
  LazyRouteLoadingOverlay: LazyComponent<typeof import("../../src/components/RouteLoadingOverlay.vue")['default']>
  LazySeriesNav: LazyComponent<typeof import("../../src/components/SeriesNav.vue")['default']>
  LazyUserDropdown: LazyComponent<typeof import("../../src/components/UserDropdown.vue")['default']>
  LazyDashboardAuthProvidersSettingsForm: LazyComponent<typeof import("../../src/components/dashboard/AuthProvidersSettingsForm.vue")['default']>
  LazyDashboardBrandingMetaForm: LazyComponent<typeof import("../../src/components/dashboard/BrandingMetaForm.vue")['default']>
  LazyDashboardCategoriesManagement: LazyComponent<typeof import("../../src/components/dashboard/CategoriesManagement.vue")['default']>
  LazyDashboardCommentsTable: LazyComponent<typeof import("../../src/components/dashboard/CommentsTable.vue")['default']>
  LazyDashboardFooterCreditsSettings: LazyComponent<typeof import("../../src/components/dashboard/FooterCreditsSettings.vue")['default']>
  LazyDashboardLocaleSettingsForm: LazyComponent<typeof import("../../src/components/dashboard/LocaleSettingsForm.vue")['default']>
  LazyDashboardLogoUpload: LazyComponent<typeof import("../../src/components/dashboard/LogoUpload.vue")['default']>
  LazyDashboardMediaManager: LazyComponent<typeof import("../../src/components/dashboard/MediaManager.vue")['default']>
  LazyDashboardMembersManagement: LazyComponent<typeof import("../../src/components/dashboard/MembersManagement.vue")['default']>
  LazyDashboardPendingComments: LazyComponent<typeof import("../../src/components/dashboard/PendingComments.vue")['default']>
  LazyDashboardPostFilters: LazyComponent<typeof import("../../src/components/dashboard/PostFilters.vue")['default']>
  LazyDashboardPostsTable: LazyComponent<typeof import("../../src/components/dashboard/PostsTable.vue")['default']>
  LazyDashboardProviderSettingsForm: LazyComponent<typeof import("../../src/components/dashboard/ProviderSettingsForm.vue")['default']>
  LazyDashboardSeriesManagement: LazyComponent<typeof import("../../src/components/dashboard/SeriesManagement.vue")['default']>
  LazyDashboardSignedLinkDialog: LazyComponent<typeof import("../../src/components/dashboard/SignedLinkDialog.vue")['default']>
  LazyDashboardStatsOverview: LazyComponent<typeof import("../../src/components/dashboard/StatsOverview.vue")['default']>
  LazyDashboardStatsSettingsForm: LazyComponent<typeof import("../../src/components/dashboard/StatsSettingsForm.vue")['default']>
  LazyLayoutFooter: LazyComponent<typeof import("../../src/components/layout/Footer.vue")['default']>
  LazyLayoutLocaleSwitcher: LazyComponent<typeof import("../../src/components/layout/LocaleSwitcher.vue")['default']>
  LazyLayoutNavbar: LazyComponent<typeof import("../../src/components/layout/Navbar.vue")['default']>
  LazyUiCheckbox: LazyComponent<typeof import("../../src/components/ui/Checkbox.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtLinkLocale: LazyComponent<typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']>
  LazySwitchLocalePathLink: LazyComponent<typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
