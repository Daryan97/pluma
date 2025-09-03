import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/services/supabase'
import { projectInfo } from '@/config/projectInfo'

const Home = () => import('@/pages/Home.vue')
const PostDetail = () => import('@/pages/PostDetail.vue')
const Login = () => import('@/pages/Login.vue')
const Signup = () => import('@/pages/Signup.vue')
const NewPost = () => import('@/pages/NewPost.vue')
const Dashboard = () => import('@/pages/Dashboard.vue')
const ChangePassword = () => import('@/pages/ChangePassword.vue')
const EditPost = () => import('@/pages/EditPost.vue')
const Profile = () => import('@/pages/Profile.vue')
const Install = () => import('@/pages/Install.vue')
const Test = () => import('@/pages/Test.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        baseTitle: 'Home',
        description: () => projectInfo.description
      }
    },
    {
      path: '/install',
      name: 'Install',
      component: Install,
      meta: { baseTitle: 'Install', description: 'Initial setup wizard.' }
    },
    {
      path: '/posts/:slug',
      name: 'PostDetail',
      component: PostDetail,
      props: true,
      meta: { baseTitle: 'Post Detail', description: 'Read the full post and explore more details.' }
    },
    {
      path: '/post/:slug',
      redirect: (to) => {
        return `/posts/${to.params.slug}`;
      }
    }
    ,
    {
      path: '/category/:slug',
      name: 'CategoryPosts',
      component: () => import('@/pages/CategoryPosts.vue'),
      props: true,
      meta: { baseTitle: 'Category Posts', description: 'Explore posts in this category.' }
    },
    {
      path: '/categories/:slug',
      redirect: (to) => {
        return `/category/${to.params.slug}`;
      }
    },
    {
      path: '/author/:username',
      name: 'AuthorPosts',
      component: () => import('@/pages/AuthorPosts.vue'),
      props: true,
      meta: { baseTitle: 'Author Posts', description: 'View posts by this author.' }
    },
    {
      path: '/authors/:username',
      redirect: (to) => {
        return `/author/${to.params.username}`;
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requireAnonymous: true, baseTitle: 'Login', description: 'Login to your account to access more features.' }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
      meta: { requireAnonymous: true, baseTitle: 'Sign Up', description: 'Create a new account to join our community.' }
    },
    {
      path: '/dashboard/new-post',
      name: 'NewPost',
      component: NewPost,
      meta: { requiresAuth: true, requiresAuthorOrAdmin: true, baseTitle: 'New Post', description: 'Write and publish a new post.' }
    },
    {
      path: '/dashboard/edit/:id',
      name: 'EditPost',
      component: EditPost,
      props: true,
      meta: { requiresAuth: true, requiresAuthorOrAdmin: true, baseTitle: 'Edit Post', description: 'Edit an existing post.' }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true, requiresAuthorOrAdmin: true, baseTitle: 'Dashboard', description: 'Admin dashboard for managing the platform.' }
    },
    {
      path: '/change-password',
      name: 'ChangePassword',
      component: ChangePassword,
      meta: { requiresAuth: true, baseTitle: 'Change Password', description: 'Change your account password securely.' }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { requiresAuth: true, baseTitle: 'Profile', description: 'View and edit your profile information.' },
    },
    {
      path: '/test',
      name: 'Test',
      component: Test,
      meta: { devOnly: true, baseTitle: 'Test', description: 'Test page (development only).' }
    }
  ]
})

import { useToast } from 'vue-toastification'

const toast = useToast()

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  if (user && to.name !== 'Profile') {
    const { data: prof, error: profErr } = await supabase
      .from('profiles')
      .select('username, display_name, role')
      .eq('id', user.id)
      .single()
    if (!profErr && (!prof?.username || !prof?.display_name)) {
      toast.error('Please complete your profile before proceeding.')
      return next({ name: 'Profile', query: { edit: 'true' } })
    } else if (!profErr && prof?.role === 'disabled') {
      toast.error('Your account has been banned. Please contact support for assistance.')
      await supabase.auth.signOut()
      return next('/login')
    }
  }

  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin
  const devOnly = to.meta.devOnly
  if (devOnly) {
    const isDev = import.meta.env.VITE_ENV === 'development'
    if (!isDev) {
      return next('/')
    }
  }
  const requiresAuthorOrAdmin = to.meta.requiresAuthorOrAdmin
  const requireAnonymous = to.meta.requireAnonymous

  try {
    const isInstallRoute = to.name === 'Install'
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'installation')
      .maybeSingle()

    if (!error && data && typeof data.value === 'object' && data.value !== null) {
      if ('complete' in data.value) {
        data.value = data.value.complete === true
      }
    }

    const installDone = !error && data?.value === true

    if (!installDone && !isInstallRoute) {
      return next({ name: 'Install' })
    }
    if (installDone && isInstallRoute) {
      return next('/')
    }
  } catch (e) {
    console.error('Failed to fetch installation status', e)
    if (to.name !== 'Install') {
      return next({ name: 'Install' })
    }
  }

  if (requireAnonymous && user) {
    return next('/')
  }

  if (requiresAuth && !user) {
    return next('/login')
  }

  if ((requiresAdmin || requiresAuthorOrAdmin) && user) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error || !profile?.role) {
      return next('/')
    }

    if (requiresAdmin && profile.role !== 'admin') {
      return next('/')
    }

    if (requiresAuthorOrAdmin && !['admin', 'author'].includes(profile.role)) {
      return next('/')
    }
  }

  next()
})

router.afterEach((to) => {
  const base = to.meta?.baseTitle;
  if (base) document.title = `${base} | ${projectInfo.name}`; else document.title = projectInfo.name;
  const descRaw = to.meta?.description;
  const desc = typeof descRaw === 'function' ? descRaw() : descRaw || projectInfo.description;
  const metaTag = document.querySelector('meta[name="description"]');
  if (metaTag) metaTag.setAttribute('content', desc);
  // Open Graph & Twitter meta
  const ensure = (name, attr = 'property') => {
    let el = document.head.querySelector(`${attr === 'name' ? 'meta[name' : 'meta[property'}="${name}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); } return el;
  };
  ensure('og:title').setAttribute('content', document.title);
  ensure('og:description').setAttribute('content', desc);
  ensure('og:type').setAttribute('content', to.name === 'PostDetail' ? 'article' : 'website');
  ensure('og:site_name').setAttribute('content', projectInfo.name);
  ensure('twitter:card', 'name').setAttribute('content', 'summary_large_image');
  ensure('twitter:title', 'name').setAttribute('content', document.title);
  ensure('twitter:description', 'name').setAttribute('content', desc);
  // Canonical
  const canonicalHref = window.location.origin + to.fullPath.split('?')[0];
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
  canonical.setAttribute('href', canonicalHref);
  // Basic JSON-LD (Home & PostDetail)
  const prior = document.getElementById('ld-primary'); if (prior) prior.remove();
  let ld = null;
  if (to.name === 'Home') {
    ld = { '@context': 'https://schema.org', '@type': 'WebSite', name: projectInfo.name, description: desc, url: canonicalHref };
  } else if (to.name === 'PostDetail' && window.__PLUMA_CURRENT_POST) {
    const p = window.__PLUMA_CURRENT_POST;
    ld = { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, datePublished: p.created_at, dateModified: p.updated_at || p.created_at, author: p.author?.display_name || p.author?.username || 'Unknown', keywords: (p.tags || []).join(', '), mainEntityOfPage: canonicalHref };
  }
  if (ld) { const script = document.createElement('script'); script.id = 'ld-primary'; script.type = 'application/ld+json'; script.textContent = JSON.stringify(ld); document.head.appendChild(script); }
})

export default router
