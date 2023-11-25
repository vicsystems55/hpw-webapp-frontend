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
      path: '/management',
      name: 'residents-management',
      component: () => import('@/views/ResidentsManagement.vue'),
      meta: {
        pageTitle: 'Manage Records',
        breadcrumb: [
          {
            text: 'Residents Management',
            active: true,
          },
        ],
      },
    },

    {
      path: '/record/:id',
      name: 'record',
      component: () => import('@/views/Record.vue'),
      meta: {
        pageTitle: 'Details Page',
        breadcrumb: [
          {
            text: "Resident's Details",
            active: true,
          },
        ],
      },
    },

    {
      path: '/staff-records',
      name: 'staff-records',
      component: () => import('@/views/StaffRecords.vue'),
      meta: {
        pageTitle: 'Manage Records',
        breadcrumb: [
          {
            text: 'Staff Records',
            active: true,
          },
        ],
      },
    },

    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/views/calendar/Calendar.vue'),
      meta: {
        pageTitle: 'Manage Schedules',
        breadcrumb: [
          {
            text: 'Schedules',
            active: true,
          },
        ],
      },
    },

    {
      path: '/policies',
      name: 'policies',
      component: () => import('@/views/Policies.vue'),
      meta: {
        pageTitle: 'Manage Policies',
        breadcrumb: [
          {
            text: 'Policies',
            active: true,
          },
        ],
      },
    },

    {
      path: '/create-policies',
      name: 'create-policies',
      component: () => import('@/views/CreatePolicies.vue'),
      meta: {
        pageTitle: 'Manage Policies',
        breadcrumb: [
          {
            text: 'Policies',
            active: true,
          },
        ],
      },
    },

    {
      path: '/policy/:id',
      name: 'policy',
      component: () => import('@/views/Policy.vue'),
      meta: {
        pageTitle: 'Manage Policies',
        breadcrumb: [
          {
            text: 'Policy Details',
            active: true,
          },
        ],
      },
    },

    {
      path: '/staff-details/:id',
      name: 'staff-details',
      component: () => import('@/views/StaffRecordDetails.vue'),
      meta: {
        pageTitle: 'Manage Records',

        breadcrumb: [
          {
            text: 'Staff Record Details',
            active: true,
          },
        ],
      },
    },
    {
      path: '/staff-supervision/:id',
      name: 'staff-supervision',
      component: () => import('@/views/supervision/StaffSupervisionDetails.vue'),
      meta: {
        pageTitle: 'Manage Supervision',

        breadcrumb: [
          {
            text: 'Staff Supervision Details',
            active: true,
          },
        ],
      },
    },

    {
      path: '/staff-details-update/:id',
      name: 'staff-details-update',
      component: () => import('@/views/StaffUpdate.vue'),
      meta: {
        pageTitle: 'Manage Records',

        breadcrumb: [
          {
            text: 'Staff Record Details',
            active: true,
          },
        ],
      },
    },

    {
      path: '/update-record/:id',
      name: 'record',
      component: () => import('@/views/UpdateRecord.vue'),
      meta: {
        pageTitle: 'Details Page',
        breadcrumb: [
          {
            text: "Update Resident's Details",
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
      path: '/create-record',
      name: 'create-record',
      component: () => import('@/views/CreateRecord.vue'),
      meta: {
        pageTitle: 'Home',
        breadcrumb: [
          {
            text: 'Residents Management',
            name: 'residents-management',
            active: false,
          },
          {
            text: 'Create Record',
            active: true,
          },
        ],
      },
    },

    {
      path: '/create-staff-record',
      name: 'create-record',
      component: () => import('@/views/CreateStaff.vue'),
      meta: {
        pageTitle: 'Home',
        breadcrumb: [
          {
            text: 'Staff Records',
            name: 'staff-records',
            path: '/staff-records',
            active: false,
          },
          {
            text: 'Create Record',
            active: true,
          },
        ],
      },
    },

    {
      path: '/file-manager',
      name: 'file-manager',
      component: () => import('@/views/FilemanagerComponent.vue'),
      meta: {
        pageTitle: 'Home',
        breadcrumb: [
          {
            text: 'File Manager',
            active: true,
          },
        ],
      },
    },

    {
      path: '/file-browser',
      name: 'file-browser',
      component: () => import('@/views/FileBrowser.vue'),
      meta: {
        pageTitle: 'Home',
        breadcrumb: [
          {
            text: 'File Manager',
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
