import { createApp, watch } from 'vue'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

import './styles/index.css'
import 'highlight.js/styles/github.css'
import 'highlight.js/styles/github-dark.css'
import { useBranding, fetchBranding as fetchBrandingStore } from '@/stores/brandingStore'
import { projectInfo } from '@/config/projectInfo'

const pinia = createPinia()

const app = createApp(App)
    .use(router)
    .use(pinia)
    .use(Toast, {
        position: POSITION.TOP_RIGHT,
        timeout: 3000,
    })

app.mount('#app')

const { fetchBranding, faviconUrl, logoVersion, siteName, siteDescription, socialLinks } = useBranding()

function updateFavicon(url) {
    if (!url) return;
    const head = document.head;
    head.querySelectorAll('link[rel~="icon"]').forEach(el => el.parentNode.removeChild(el));
    head.querySelectorAll('link[rel="shortcut icon"]').forEach(el => el.parentNode.removeChild(el));

    const base = url.split('?')[0];
    const ext = base.split('.').pop()?.toLowerCase();
    const typeMap = { png: 'image/png', svg: 'image/svg+xml', ico: 'image/x-icon' };
    const versioned = `${url}${url.includes('?') ? '&' : '?'}v=${logoVersion.value}`;
    ['icon', 'shortcut icon'].forEach(rel => {
        const link = document.createElement('link');
        link.rel = rel;
        if (typeMap[ext]) link.type = typeMap[ext];
        link.href = versioned;
        head.appendChild(link);
    });
}

fetchBranding(true).then(() => {
    projectInfo.applyBranding({ siteName: siteName.value, siteDescription: siteDescription.value, socialLinks: socialLinks.value })
    if (!document.title || document.title === 'Loading…') document.title = projectInfo.name
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && (!metaDesc.getAttribute('content') || /modern blogging platform|Loading…/i.test(metaDesc.getAttribute('content')))) {
        metaDesc.setAttribute('content', projectInfo.description)
    }
    updateFavicon(faviconUrl.value)
});

watch([siteName, siteDescription, socialLinks], ([n, d, sl]) => {
    projectInfo.applyBranding({ siteName: n, siteDescription: d, socialLinks: sl })
    const current = document.title || '';
    if (current.includes('|')) {
        const prefix = current.split('|')[0].trim();
        document.title = `${prefix} | ${projectInfo.name}`;
    } else {
        document.title = projectInfo.name;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && d && metaDesc.getAttribute('content') !== d) metaDesc.setAttribute('content', d);
});

watch([faviconUrl, logoVersion], ([url]) => {
    updateFavicon(url);
});
