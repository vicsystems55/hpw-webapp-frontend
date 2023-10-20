import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        pageTitle: 'Home',
        breadcrumb: [
          {
            text: 'Home',
            active: true,
          },
        ],
      },
    },
    {
      path: '/second-page',
      name: 'second-page',
      component: () => import('@/views/SecondPage.vue'),
      meta: {
        pageTitle: 'Second Page',
        breadcrumb: [
          {
            text: 'Second Page',
            active: true,
          },
        ],
      },
    },

    {
      path: '/submissions',
      name: 'submissions',
      component: () => import('@/views/Submissions.vue'),
      meta: {
        pageTitle: 'Submissions',
        breadcrumb: [
          {
            text: 'Submissions',
            active: true,
          },
        ],
      },
    },

    {
      path: '/submission/:id',
      name: 'submission',
      component: () => import('@/views/Submission.vue'),
      meta: {
        pageTitle: 'Submission Details',
        breadcrumb: [
          {
            text: 'Submission',
            active: true,
          },
        ],
      },
    },

    {
      path: '/create-submission',
      name: 'create-submission',
      component: () => import('@/views/CreateSubmission.vue'),
      meta: {
        pageTitle: 'Create Submission',
        breadcrumb: [
          {
            text: 'Create Submission',
            active: true,
          },
        ],
      },
    },

    {
      path: '/create-ad',
      name: 'create-ad',
      component: () => import('@/views/CreateAdvert.vue'),
      meta: {
        pageTitle: 'Create Advert',
        breadcrumb: [
          {
            text: 'Create Advert',
            active: true,
          },
        ],
      },
    },

    {
      path: '/departments',
      name: 'departments',
      component: () => import('@/views/Departments.vue'),
      meta: {
        pageTitle: 'Departments',
        breadcrumb: [
          {
            text: 'Departments',
            active: true,
          },
        ],
      },
    },

    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('@/views/Notifications.vue'),
      meta: {
        pageTitle: 'Notifications',
        breadcrumb: [
          {
            text: 'Notifications',
            active: true,
          },
        ],
      },
    },

    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue'),
      meta: {
        pageTitle: 'Settings',
        breadcrumb: [
          {
            text: 'Settings',
            active: true,
          },
        ],
      },
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full',
      },
    },

    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },

    {
      path: '/submission-success',
      name: 'submission-success',
      component: () => import('@/views/error/SubmissionSuccess.vue'),
      meta: {
        layout: 'full',
      },
    },

    {
      path: '/track-submission',
      name: 'track-submission',
      component: () => import('@/views/error/TrackSubmission.vue'),
      meta: {
        layout: 'full',
      },
    },

    {
      path: '/contractor-application',
      name: 'contractor-application',
      component: () => import('@/views/error/ContractorApplication.vue'),
      meta: {
        layout: 'full',
      },
    },

    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  console.log(router.currentRoute.name)
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
  if (localStorage.getItem('token') || router.currentRoute.name === 'register' || router.currentRoute.name === 'track-submission' || router.currentRoute.name === 'contractor-application') {
    console.log('yes')
    // eslint-disable-next-line no-undef
    // next()
  } else {
    console.log('no board')
    router.push({
      path: '/login',
      replace: true,
    })
  }
})

export default router
