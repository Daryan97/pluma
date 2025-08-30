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

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: `Home | ${projectInfo.name}`,
        description: `${projectInfo.description}`
      }
    },
    {
      path: '/posts/:slug',
      name: 'PostDetail',
      component: PostDetail,
      props: true,
      meta: {
        title: `Post Detail | ${projectInfo.name}`,
        description: 'Read the full post and explore more details.'
      }
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
      meta: {
        title: `Category Posts | ${projectInfo.name}`,
        description: 'Explore posts in this category.'
      }
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
      meta: {
        title: `Author Posts | ${projectInfo.name}`,
        description: 'View posts by this author.'
      }
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
      meta: {
        requireAnonymous: true,
        title: `Login | ${projectInfo.name}`,
        description: 'Login to your account to access more features.'
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
      meta: {
        requireAnonymous: true,
        title: `Sign Up | ${projectInfo.name}`,
        description: 'Create a new account to join our community.'
      }
    },
    {
      path: '/dashboard/new-post',
      name: 'NewPost',
      component: NewPost,
      meta: {
        requiresAuth: true,
        requiresAuthorOrAdmin: true,
        title: `New Post | ${projectInfo.name}`,
        description: 'Write and publish a new post.'
      }
    },
    {
      path: '/dashboard/edit/:id',
      name: 'EditPost',
      component: EditPost,
      props: true,
      meta: {
        requiresAuth: true,
        requiresAuthorOrAdmin: true,
        title: `Edit Post | ${projectInfo.name}`,
        description: 'Edit an existing post.'
      }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
        requiresAuthorOrAdmin: true,
        title: `Dashboard | ${projectInfo.name}`,
        description: 'Admin dashboard for managing the platform.'
      }
    },
    {
      path: '/change-password',
      name: 'ChangePassword',
      component: ChangePassword,
      meta: {
        requiresAuth: true,
        title: `Change Password | ${projectInfo.name}`,
        description: 'Change your account password securely.'
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/pages/Profile.vue'),
      meta: {
        requiresAuth: true,
        title: `Profile | ${projectInfo.name}`,
        description: 'View and edit your profile information.'
      }
    },
    {
      path: '/dashboard/members',
      name: 'Members',
      component: () => import('@/pages/Members.vue'),
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
        title: `Members | ${projectInfo.name}`,
        description: 'Manage user roles on the platform.'
      }
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
      .select('username, display_name')
      .eq('id', user.id)
      .single()
    if (!profErr && (!prof.username || !prof.display_name)) {
      toast.error('Please complete your profile before proceeding.')
      return next({ name: 'Profile', query: { edit: 'true' } })
    }
  }

  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin
  const requiresAuthorOrAdmin = to.meta.requiresAuthorOrAdmin
  const requireAnonymous = to.meta.requireAnonymous

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
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'Pluma'
  }
  if (to.meta && to.meta.description) {
    document
      .querySelector('meta[name="description"]')
      .setAttribute('content', to.meta.description)
  } else {
    document
      .querySelector('meta[name="description"]')
      .setAttribute('content', projectInfo.description)
  }
})

export default router
