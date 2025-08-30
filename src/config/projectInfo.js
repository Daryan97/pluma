
const projectName = import.meta.env.VITE_PROJECT_NAME || "Pluma";
const projectDescription = import.meta.env.VITE_PROJECT_DESCRIPTION || "A modern blogging platform";
const projectVersion = import.meta.env.VITE_PROJECT_VERSION || "1.0.0";
const projectAuthor = import.meta.env.VITE_PROJECT_AUTHOR || "Daryan Latif";
const projectLicense = import.meta.env.VITE_PROJECT_LICENSE || "MIT";
const projectRepository = import.meta.env.VITE_PROJECT_REPOSITORY || "";
const projectHomepage = import.meta.env.VITE_PROJECT_HOMEPAGE || "https://example.com";
const projectSupportEmail = import.meta.env.VITE_PROJECT_SUPPORT_EMAIL || "admin@example.com";
const projectSupportLink = import.meta.env.VITE_PROJECT_SUPPORT_LINK || "https://support.example.com";
const projectDocumentation = import.meta.env.VITE_PROJECT_DOCUMENTATION || "https://docs.example.com";
const socialLinksEnv = {
    twitter: { url: import.meta.env.VITE_PROJECT_TWITTER, icon: "mdi:twitter" },
    github: { url: import.meta.env.VITE_PROJECT_GITHUB, icon: "mdi:github" },
    facebook: { url: import.meta.env.VITE_PROJECT_FACEBOOK, icon: "mdi:facebook" },
    instagram: { url: import.meta.env.VITE_PROJECT_INSTAGRAM, icon: "mdi:instagram" },
    linkedin: { url: import.meta.env.VITE_PROJECT_LINKEDIN, icon: "mdi:linkedin" },
    youtube: { url: import.meta.env.VITE_PROJECT_YOUTUBE, icon: "mdi:youtube" },
    discord: { url: import.meta.env.VITE_PROJECT_DISCORD, icon: "mdi:discord" },
    reddit: { url: import.meta.env.VITE_PROJECT_REDDIT, icon: "mdi:reddit" },
    tiktok: { url: import.meta.env.VITE_PROJECT_TIKTOK, icon: "ic:baseline-tiktok" },
    pinterest: { url: import.meta.env.VITE_PROJECT_PINTEREST, icon: "mdi:pinterest" },
    medium: { url: import.meta.env.VITE_PROJECT_MEDIUM, icon: "mdi:medium" },
    devto: { url: import.meta.env.VITE_PROJECT_DEVTO, icon: "simple-icons:devdotto" },
    stackoverflow: { url: import.meta.env.VITE_PROJECT_STACKOVERFLOW, icon: "mdi:stack-overflow" },
    hackernews: { url: import.meta.env.VITE_PROJECT_HACKERNEWS, icon: "mdi:hackernews" },
    quora: { url: import.meta.env.VITE_PROJECT_QUORA, icon: "mdi:quora" },
    telegram: { url: import.meta.env.VITE_PROJECT_TELEGRAM, icon: "mdi:telegram" },
    whatsapp: { url: import.meta.env.VITE_PROJECT_WHATSAPP, icon: "mdi:whatsapp" },
    slack: { url: import.meta.env.VITE_PROJECT_SLACK, icon: "mdi:slack" },
    wechat: { url: import.meta.env.VITE_PROJECT_WECHAT, icon: "mdi:wechat" },
    vk: { url: import.meta.env.VITE_PROJECT_VK, icon: "mdi:vk" },
    line: { url: import.meta.env.VITE_PROJECT_LINE, icon: "mdi:line-scan" },
    signal: { url: import.meta.env.VITE_PROJECT_SIGNAL, icon: "mdi:signal" },
    skype: { url: import.meta.env.VITE_PROJECT_SKYPE, icon: "mdi:skype" },
    viber: { url: import.meta.env.VITE_PROJECT_VIBER, icon: "fa6-brands:viber" },
    tumblr: { url: import.meta.env.VITE_PROJECT_TUMBLR, icon: "mdi:tumblr" },
    flickr: { url: import.meta.env.VITE_PROJECT_FLICKR, icon: "mdi:flickr" },
    soundcloud: { url: import.meta.env.VITE_PROJECT_SOUNDCLOUD, icon: "mdi:soundcloud" },
    spotify: { url: import.meta.env.VITE_PROJECT_SPOTIFY, icon: "mdi:spotify" },
    appleMusic: { url: import.meta.env.VITE_PROJECT_APPLEMUSIC, icon: "mdi:apple" },
    amazonMusic: { url: import.meta.env.VITE_PROJECT_AMAZONMUSIC, icon: "mdi:amazon" },
    itunes: { url: import.meta.env.VITE_PROJECT_ITUNES, icon: "mdi:itunes" },
    googlePlay: { url: import.meta.env.VITE_PROJECT_GOOGLEPLAY, icon: "mdi:google-play" },
    deezer: { url: import.meta.env.VITE_PROJECT_DEEZER, icon: "simple-icons:deezer" },
    bandcamp: { url: import.meta.env.VITE_PROJECT_BANDCAMP, icon: "simple-icons:bandcamp" },
    patreon: { url: import.meta.env.VITE_PROJECT_PATREON, icon: "mdi:patreon" },
    koFi: { url: import.meta.env.VITE_PROJECT_KOFI, icon: "simple-icons:kofi" },
    buyMeACoffee: { url: import.meta.env.VITE_PROJECT_BUYMEACOFFEE, icon: "simple-icons:buymeacoffee" },
    substack: { url: import.meta.env.VITE_PROJECT_SUBSTACK, icon: "simple-icons:substack" },
    newsletter: { url: import.meta.env.VITE_PROJECT_NEWSLETTER, icon: "mdi:email-newsletter" }
};

const projectSocialLinks = Object.fromEntries(
    Object.entries(socialLinksEnv).filter(([_, v]) => v && typeof v.url === "string" && v.url.trim() !== "")
);

export const projectInfo = {
    name: projectName,
    description: projectDescription,
    version: projectVersion,
    author: projectAuthor,
    license: projectLicense,
    repository: projectRepository,
    homepage: projectHomepage,
    supportEmail: projectSupportEmail,
    supportLink: projectSupportLink,
    documentation: projectDocumentation,
    socialLinks: projectSocialLinks
};
