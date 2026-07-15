
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


export const CategoriesDropdown: typeof import("../src/components/CategoriesDropdown.vue")['default']
export const Comments: typeof import("../src/components/Comments.vue")['default']
export const ConfirmDialog: typeof import("../src/components/ConfirmDialog.vue")['default']
export const GlobalSearch: typeof import("../src/components/GlobalSearch.vue")['default']
export const NoImage: typeof import("../src/components/NoImage.vue")['default']
export const Post: typeof import("../src/components/Post.vue")['default']
export const PostForm: typeof import("../src/components/PostForm.vue")['default']
export const PostLoader: typeof import("../src/components/PostLoader.vue")['default']
export const RouteLoadingOverlay: typeof import("../src/components/RouteLoadingOverlay.vue")['default']
export const SeriesNav: typeof import("../src/components/SeriesNav.vue")['default']
export const UserDropdown: typeof import("../src/components/UserDropdown.vue")['default']
export const DashboardAuthProvidersSettingsForm: typeof import("../src/components/dashboard/AuthProvidersSettingsForm.vue")['default']
export const DashboardBrandingMetaForm: typeof import("../src/components/dashboard/BrandingMetaForm.vue")['default']
export const DashboardCategoriesManagement: typeof import("../src/components/dashboard/CategoriesManagement.vue")['default']
export const DashboardCommentsTable: typeof import("../src/components/dashboard/CommentsTable.vue")['default']
export const DashboardFooterCreditsSettings: typeof import("../src/components/dashboard/FooterCreditsSettings.vue")['default']
export const DashboardLocaleSettingsForm: typeof import("../src/components/dashboard/LocaleSettingsForm.vue")['default']
export const DashboardLogoUpload: typeof import("../src/components/dashboard/LogoUpload.vue")['default']
export const DashboardMediaManager: typeof import("../src/components/dashboard/MediaManager.vue")['default']
export const DashboardMembersManagement: typeof import("../src/components/dashboard/MembersManagement.vue")['default']
export const DashboardPendingComments: typeof import("../src/components/dashboard/PendingComments.vue")['default']
export const DashboardPostFilters: typeof import("../src/components/dashboard/PostFilters.vue")['default']
export const DashboardPostsTable: typeof import("../src/components/dashboard/PostsTable.vue")['default']
export const DashboardProviderSettingsForm: typeof import("../src/components/dashboard/ProviderSettingsForm.vue")['default']
export const DashboardSeriesManagement: typeof import("../src/components/dashboard/SeriesManagement.vue")['default']
export const DashboardSignedLinkDialog: typeof import("../src/components/dashboard/SignedLinkDialog.vue")['default']
export const DashboardStatsOverview: typeof import("../src/components/dashboard/StatsOverview.vue")['default']
export const DashboardStatsSettingsForm: typeof import("../src/components/dashboard/StatsSettingsForm.vue")['default']
export const LayoutFooter: typeof import("../src/components/layout/Footer.vue")['default']
export const LayoutLocaleSwitcher: typeof import("../src/components/layout/LocaleSwitcher.vue")['default']
export const LayoutNavbar: typeof import("../src/components/layout/Navbar.vue")['default']
export const UiCheckbox: typeof import("../src/components/ui/Checkbox.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtLinkLocale: typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']
export const SwitchLocalePathLink: typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyCategoriesDropdown: LazyComponent<typeof import("../src/components/CategoriesDropdown.vue")['default']>
export const LazyComments: LazyComponent<typeof import("../src/components/Comments.vue")['default']>
export const LazyConfirmDialog: LazyComponent<typeof import("../src/components/ConfirmDialog.vue")['default']>
export const LazyGlobalSearch: LazyComponent<typeof import("../src/components/GlobalSearch.vue")['default']>
export const LazyNoImage: LazyComponent<typeof import("../src/components/NoImage.vue")['default']>
export const LazyPost: LazyComponent<typeof import("../src/components/Post.vue")['default']>
export const LazyPostForm: LazyComponent<typeof import("../src/components/PostForm.vue")['default']>
export const LazyPostLoader: LazyComponent<typeof import("../src/components/PostLoader.vue")['default']>
export const LazyRouteLoadingOverlay: LazyComponent<typeof import("../src/components/RouteLoadingOverlay.vue")['default']>
export const LazySeriesNav: LazyComponent<typeof import("../src/components/SeriesNav.vue")['default']>
export const LazyUserDropdown: LazyComponent<typeof import("../src/components/UserDropdown.vue")['default']>
export const LazyDashboardAuthProvidersSettingsForm: LazyComponent<typeof import("../src/components/dashboard/AuthProvidersSettingsForm.vue")['default']>
export const LazyDashboardBrandingMetaForm: LazyComponent<typeof import("../src/components/dashboard/BrandingMetaForm.vue")['default']>
export const LazyDashboardCategoriesManagement: LazyComponent<typeof import("../src/components/dashboard/CategoriesManagement.vue")['default']>
export const LazyDashboardCommentsTable: LazyComponent<typeof import("../src/components/dashboard/CommentsTable.vue")['default']>
export const LazyDashboardFooterCreditsSettings: LazyComponent<typeof import("../src/components/dashboard/FooterCreditsSettings.vue")['default']>
export const LazyDashboardLocaleSettingsForm: LazyComponent<typeof import("../src/components/dashboard/LocaleSettingsForm.vue")['default']>
export const LazyDashboardLogoUpload: LazyComponent<typeof import("../src/components/dashboard/LogoUpload.vue")['default']>
export const LazyDashboardMediaManager: LazyComponent<typeof import("../src/components/dashboard/MediaManager.vue")['default']>
export const LazyDashboardMembersManagement: LazyComponent<typeof import("../src/components/dashboard/MembersManagement.vue")['default']>
export const LazyDashboardPendingComments: LazyComponent<typeof import("../src/components/dashboard/PendingComments.vue")['default']>
export const LazyDashboardPostFilters: LazyComponent<typeof import("../src/components/dashboard/PostFilters.vue")['default']>
export const LazyDashboardPostsTable: LazyComponent<typeof import("../src/components/dashboard/PostsTable.vue")['default']>
export const LazyDashboardProviderSettingsForm: LazyComponent<typeof import("../src/components/dashboard/ProviderSettingsForm.vue")['default']>
export const LazyDashboardSeriesManagement: LazyComponent<typeof import("../src/components/dashboard/SeriesManagement.vue")['default']>
export const LazyDashboardSignedLinkDialog: LazyComponent<typeof import("../src/components/dashboard/SignedLinkDialog.vue")['default']>
export const LazyDashboardStatsOverview: LazyComponent<typeof import("../src/components/dashboard/StatsOverview.vue")['default']>
export const LazyDashboardStatsSettingsForm: LazyComponent<typeof import("../src/components/dashboard/StatsSettingsForm.vue")['default']>
export const LazyLayoutFooter: LazyComponent<typeof import("../src/components/layout/Footer.vue")['default']>
export const LazyLayoutLocaleSwitcher: LazyComponent<typeof import("../src/components/layout/LocaleSwitcher.vue")['default']>
export const LazyLayoutNavbar: LazyComponent<typeof import("../src/components/layout/Navbar.vue")['default']>
export const LazyUiCheckbox: LazyComponent<typeof import("../src/components/ui/Checkbox.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtLinkLocale: LazyComponent<typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']>
export const LazySwitchLocalePathLink: LazyComponent<typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
