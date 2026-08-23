import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppShell from '../layouts/AppShell.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true, title: 'Sign in' },
  },
  {
    path: '/',
    component: AppShell,
    children: [
      { path: '', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { permission: 'dashboard.view', title: 'Overview' } },
      { path: 'profile', name: 'profile', component: () => import('../views/StaffProfileView.vue'), meta: { permission: 'staff.profile.view', roles: ['staff'], title: 'My profile' } },
      { path: 'residents', name: 'residents', component: () => import('../views/ResidentsView.vue'), meta: { permission: 'residents.manage', title: 'Residents' } },
      { path: 'staff', name: 'staff', component: () => import('../views/StaffView.vue'), meta: { permission: 'staff.manage', title: 'Staff records' } },
      { path: 'staff/:id', name: 'staff-details', component: () => import('../views/StaffDetailsView.vue'), meta: { permission: 'staff.manage', roles: ['admin'], title: 'Staff profile' } },
      { path: 'staff-access', name: 'staff-access', component: () => import('../views/StaffAccessView.vue'), meta: { permission: 'users.manage', roles: ['admin'], title: 'Staff access' } },
      { path: 'supervision', name: 'supervision', component: () => import('../views/SupervisionView.vue'), meta: { permission: 'supervision.manage', title: 'Supervision' } },
      { path: 'my-supervision', name: 'my-supervision', component: () => import('../views/MySupervisionView.vue'), meta: { permission: 'supervision.view-own', roles: ['staff'], title: 'My supervision' } },
      { path: 'courses', name: 'courses', component: () => import('../views/CoursesView.vue'), meta: { permission: 'courses.view', title: 'Courses' } },
      { path: 'performance', name: 'performance', component: () => import('../views/PerformanceView.vue'), meta: { permission: 'performance.view-own', roles: ['staff'], title: 'My performance' } },
      { path: 'certificates', name: 'certificates', component: () => import('../views/CertificatesView.vue'), meta: { permission: 'certificates.issue', title: 'Certificates' } },
      { path: 'policies', name: 'policies', component: () => import('../views/PoliciesView.vue'), meta: { permission: 'policies.view', title: 'Policies' } },
      { path: 'calendar', name: 'calendar', component: () => import('../views/CalendarView.vue'), meta: { permission: 'calendar.manage', title: 'Calendar' } },
      { path: 'training', name: 'training', component: () => import('../views/TrainingView.vue'), meta: { permissions: ['training.manage', 'training.view-own'], title: 'Training' } },
      { path: 'files', name: 'files', component: () => import('../views/FilesView.vue'), meta: { permission: 'files.view', title: 'Files' } },
      { path: 'notifications', name: 'notifications', component: () => import('../views/NotificationsView.vue'), meta: { permission: 'notifications.view', title: 'Notifications' } },
      { path: 'settings', name: 'settings', component: () => import('../views/SettingsView.vue'), meta: { permission: 'organisation.manage', title: 'Settings' } },
      { path: 'change-password', name: 'change-password', component: () => import('../views/ChangePasswordView.vue'), meta: { title: 'Change password' } },
      { path: 'forbidden', name: 'forbidden', component: () => import('../views/ForbiddenView.vue'), meta: { title: 'Access denied' } },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async to => {
  const auth = useAuthStore()
  document.title = `${to.meta.title || 'Portal'} · Hope Pathway`

  if (to.meta.guest) {
    return auth.isAuthenticated ? { name: 'dashboard' } : true
  }

  if (!auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }

  if (auth.permissions.length === 0) {
    try {
      await auth.refreshUser()
    } catch {
      await auth.logout()
      return { name: 'login' }
    }
  }

  if (auth.user?.must_change_password && to.name !== 'change-password') {
    return { name: 'change-password' }
  }

  if (to.meta.permission && !auth.hasPermission(to.meta.permission)) {
    return { name: 'forbidden' }
  }

  if (to.meta.permissions && !to.meta.permissions.some(permission => auth.hasPermission(permission))) {
    return { name: 'forbidden' }
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.user?.role)) {
    return { name: 'forbidden' }
  }

  return true
})

export default router
