let projectName = "";
let projectDescription = "";


export const projectInfo = {
    get name() { return projectName; },
    get description() { return projectDescription; },
    applyBranding(branding) {
        if (branding && Object.prototype.hasOwnProperty.call(branding, 'siteName')) {
            projectName = branding.siteName || '';
        }
        if (branding && Object.prototype.hasOwnProperty.call(branding, 'siteDescription')) {
            projectDescription = branding.siteDescription || '';
        }
        if (Array.isArray(branding?.socialLinks)) {
            this.socialLinks = Object.fromEntries(branding.socialLinks.filter(l => l.url).map(l => [l.label, { url: l.url, icon: l.icon || 'mdi:link-variant' }]));
        }
    }
};
