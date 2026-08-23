<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowUpRight, Bell, BookOpen, CalendarClock, CheckCircle2, FileText, HeartPulse, ShieldCheck, Sparkles, Users } from '@lucide/vue'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import PageHeader from '../components/ui/PageHeader.vue'
import StatCard from '../components/ui/StatCard.vue'

const auth = useAuthStore()
const loading = ref(true)
const notifications = ref([])
const residents = ref([])
const totalPolicies = ref(0)
const totalStaff = ref(0)
const performances = ref([])

const firstName = computed(() => auth.user?.name?.split(' ')[0] || 'there')
const passedCount = computed(() => performances.value.filter(item => item.status === 'passed').length)
const stats = computed(() => auth.isAdmin
  ? [
      { label: 'Residents', value: residents.value.length, note: 'People currently in care', icon: HeartPulse, tone: 'blue' },
      { label: 'Team members', value: totalStaff.value, note: 'Across staff records', icon: Users, tone: 'mint' },
      { label: 'Active policies', value: totalPolicies.value, note: 'Ready for team access', icon: FileText, tone: 'orange' },
      { label: 'Open notifications', value: notifications.value.length, note: 'Latest account updates', icon: Bell, tone: 'yellow' },
    ]
  : [
      { label: 'Courses taken', value: performances.value.length, note: 'Your learning activity', icon: BookOpen, tone: 'blue' },
      { label: 'Courses passed', value: passedCount.value, note: 'Completed successfully', icon: CheckCircle2, tone: 'mint' },
      { label: 'Notifications', value: notifications.value.length, note: 'Updates for your account', icon: Bell, tone: 'orange' },
      { label: 'Certificates', value: performances.value.filter(item => item.certificate_status === 'issued').length, note: 'Available achievements', icon: ShieldCheck, tone: 'yellow' },
    ])

const quickActions = computed(() => auth.isAdmin
  ? [
      { label: 'Add resident', note: 'Create a new care record', to: '/residents', icon: HeartPulse, color: 'bg-brand-blue' },
      { label: 'Add staff member', note: 'Build a staff profile', to: '/staff', icon: Users, color: 'bg-brand-mint' },
      { label: 'Review supervision', note: 'Check upcoming sessions', to: '/supervision', icon: CalendarClock, color: 'bg-brand-orange' },
    ]
  : [
      { label: 'Continue learning', note: 'Return to your courses', to: '/courses', icon: BookOpen, color: 'bg-brand-blue' },
      { label: 'My performance', note: 'See results and progress', to: '/performance', icon: CheckCircle2, color: 'bg-brand-mint' },
      { label: 'Read policies', note: 'Stay current and informed', to: '/policies', icon: FileText, color: 'bg-brand-orange' },
    ])

async function loadDashboard() {
  loading.value = true
  const tasks = [api.get('/notifications').then(({ data }) => { notifications.value = data.slice(0, 5) }).catch(() => {})]

  if (auth.isAdmin) {
    tasks.push(api.get('/residents-management', { params: { dashboard: true } }).then(({ data }) => {
      residents.value = data.residentsRecords || []
      totalPolicies.value = data.total_policies || 0
      totalStaff.value = data.total_staff || 0
    }).catch(() => {}))
  } else {
    tasks.push(api.get('/my-performances').then(({ data }) => { performances.value = data.data || [] }).catch(() => {}))
  }

  await Promise.all(tasks)
  loading.value = false
}

onMounted(loadDashboard)
</script>

<template>
  <div>
    <PageHeader :title="`Good day, ${firstName}`" :description="auth.isAdmin ? 'A clear view of care, people and compliance across Hope Pathway.' : 'Everything you need for your work, learning and development.'">
      <template #actions>
        <RouterLink to="/notifications" class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-navy shadow-sm hover:border-brand-blue hover:text-brand-blue">
          <Bell :size="17" /> View updates
        </RouterLink>
      </template>
    </PageHeader>

    <section class="relative mb-6 overflow-hidden rounded-[1.5rem] bg-gradient-to-r from-brand-blue via-[#078abf] to-brand-mint p-6 text-white shadow-xl shadow-brand-blue/15 sm:p-8">
      <div class="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[38px] border-white/10" />
      <div class="relative max-w-2xl">
        <span class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider"><Sparkles :size="15" /> Today at Hope Pathway</span>
        <h2 class="mt-5 text-2xl font-black sm:text-3xl">Care feels better when everyone has clarity.</h2>
        <p class="mt-3 max-w-xl text-sm leading-6 text-white/80">Keep records current, stay ahead of compliance, and help every person receive thoughtful, consistent support.</p>
      </div>
    </section>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard v-for="item in stats" :key="item.label" v-bind="item" />
    </div>

    <div class="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <section class="card p-5 sm:p-6">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-wider text-brand-orange">Shortcuts</p>
            <h2 class="mt-1 text-xl font-black text-brand-navy">What would you like to do?</h2>
          </div>
        </div>
        <div class="grid gap-3 md:grid-cols-3">
          <RouterLink v-for="action in quickActions" :key="action.label" :to="action.to" class="group rounded-2xl border border-slate-100 bg-slate-50 p-4 hover:-translate-y-1 hover:border-brand-blue/20 hover:bg-white hover:shadow-lg">
            <span class="grid h-10 w-10 place-items-center rounded-xl text-white" :class="action.color"><component :is="action.icon" :size="19" /></span>
            <h3 class="mt-4 font-extrabold text-brand-navy">{{ action.label }}</h3>
            <p class="mt-1 text-xs leading-5 text-slate-500">{{ action.note }}</p>
            <ArrowUpRight :size="17" class="mt-4 text-slate-400 group-hover:text-brand-blue" />
          </RouterLink>
        </div>
      </section>

      <section class="card p-5 sm:p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-wider text-brand-orange">Recent</p>
            <h2 class="mt-1 text-xl font-black text-brand-navy">Notifications</h2>
          </div>
          <RouterLink to="/notifications" class="text-xs font-extrabold text-brand-blue">View all</RouterLink>
        </div>
        <div v-if="notifications.length" class="mt-5 space-y-4">
          <div v-for="item in notifications" :key="item.id" class="flex gap-3">
            <span class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-orange ring-4 ring-brand-cream" />
            <div>
              <p class="text-sm font-bold text-brand-navy">{{ item.subject }}</p>
              <p class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{{ item.msg }}</p>
            </div>
          </div>
        </div>
        <div v-else class="mt-6 rounded-2xl bg-brand-sky p-5 text-center">
          <Bell :size="24" class="mx-auto text-brand-blue" />
          <p class="mt-2 text-sm font-bold text-brand-navy">You’re all caught up</p>
          <p class="mt-1 text-xs text-slate-500">New updates will appear here.</p>
        </div>
      </section>
    </div>
  </div>
</template>
