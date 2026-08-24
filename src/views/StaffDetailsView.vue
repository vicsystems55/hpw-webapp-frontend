<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft, Award, CalendarClock, Download, FileCheck2, FileText, GraduationCap, Mail, MapPin, Phone, ShieldCheck, UserRound } from '@lucide/vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import PageHeader from '../components/ui/PageHeader.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'

const route = useRoute()
const staff = ref(null)
const loading = ref(true)
const error = ref('')
const initials = computed(() => staff.value?.fullname?.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase() || 'HP')
const storageBase = (api.defaults.baseURL || '').replace(/\/api\/?$/, '/storage/')
const fileUrl = path => path ? `${storageBase}${path}` : null
const formatDate = value => value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not recorded'
const documentLabels = { identity: 'Identity', dbs: 'DBS', qualification: 'Qualification', course_certificate: 'Course certificate', training: 'Training', other: 'Other' }
const formatBytes = bytes => bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

async function downloadDocument(document) {
  error.value = ''
  try {
    const response = await api.get(`/staff-documents/${document.id}/download`, { responseType: 'blob' })
    const url = URL.createObjectURL(response.data)
    const link = window.document.createElement('a')
    link.href = url
    link.download = document.original_name || document.title
    link.click()
    URL.revokeObjectURL(url)
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'The document could not be downloaded.'
  }
}

async function loadStaff() {
  loading.value = true
  try {
    const { data } = await api.get(`/staff-records/${route.params.id}`)
    staff.value = data.data || data
  } catch (requestError) {
    error.value = requestError.response?.status === 404 ? 'This staff record could not be found.' : (requestError.response?.data?.message || 'The staff profile could not be loaded.')
  } finally {
    loading.value = false
  }
}

onMounted(loadStaff)
</script>

<template>
  <div>
    <RouterLink to="/staff" class="mb-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand-blue hover:text-brand-blue-dark"><ArrowLeft :size="17" /> Back to staff records</RouterLink>
    <PageHeader title="Staff profile" description="Employment, compliance, supervision and development details in one place." />
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <LoadingState v-if="loading" />
    <div v-else-if="staff" class="space-y-5">
      <section class="card overflow-hidden"><div class="h-24 bg-gradient-to-r from-brand-blue via-brand-mint to-brand-orange" /><div class="flex flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-end sm:px-7"><div class="-mt-12 grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-3xl border-4 border-white bg-brand-navy text-2xl font-black text-white shadow-lg"><img v-if="staff.passport_file" :src="fileUrl(staff.passport_file)" :alt="staff.fullname" class="h-full w-full object-cover" /><span v-else>{{ initials }}</span></div><div class="min-w-0 flex-1 sm:pb-1"><div class="flex flex-wrap items-center gap-2"><h2 class="text-2xl font-black text-brand-navy">{{ staff.fullname }}</h2><StatusBadge :status="staff.status" /></div><p class="mt-1 font-extrabold text-brand-blue">{{ staff.staff_id }}</p></div><div class="flex flex-wrap gap-2"><span v-if="staff.user" class="rounded-full px-3 py-1.5 text-xs font-extrabold" :class="staff.user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'">Portal {{ staff.user.is_active ? 'active' : 'suspended' }}</span><span v-else class="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-700">No portal login</span></div></div></section>

      <div class="grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
        <div class="space-y-5">
          <section class="card p-5"><h3 class="flex items-center gap-2 font-black text-brand-navy"><UserRound :size="19" class="text-brand-blue" /> Personal and contact details</h3><dl class="mt-5 space-y-4 text-sm"><div><dt class="font-bold text-slate-400">Date of birth</dt><dd class="mt-1 font-semibold text-brand-navy">{{ formatDate(staff.date_of_birth) }}</dd></div><div><dt class="font-bold text-slate-400">Gender</dt><dd class="mt-1 font-semibold text-brand-navy">{{ staff.gender || 'Not recorded' }}</dd></div><div><dt class="font-bold text-slate-400">Email</dt><dd class="mt-1 flex items-center gap-2 break-all font-semibold text-brand-navy"><Mail :size="16" class="text-brand-orange" /> {{ staff.email }}</dd></div><div><dt class="font-bold text-slate-400">Phone</dt><dd class="mt-1 flex items-center gap-2 font-semibold text-brand-navy"><Phone :size="16" class="text-brand-orange" /> {{ staff.phone_number || 'Not recorded' }}</dd></div><div><dt class="font-bold text-slate-400">Address</dt><dd class="mt-1 flex items-start gap-2 font-semibold leading-6 text-brand-navy"><MapPin :size="16" class="mt-1 shrink-0 text-brand-orange" /> {{ staff.address || 'Not recorded' }}</dd></div></dl></section>
          <section class="card p-5"><h3 class="flex items-center gap-2 font-black text-brand-navy"><ShieldCheck :size="19" class="text-brand-blue" /> Compliance</h3><div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1"><div class="rounded-xl bg-slate-50 p-4"><p class="text-xs font-bold uppercase tracking-wider text-slate-400">DBS date</p><p class="mt-2 font-extrabold text-brand-navy">{{ formatDate(staff.dbs_date) }}</p></div><div class="rounded-xl bg-slate-50 p-4"><p class="text-xs font-bold uppercase tracking-wider text-slate-400">Last supervision</p><p class="mt-2 font-extrabold text-brand-navy">{{ formatDate(staff.last_supervision_date) }}</p></div></div><a v-if="staff.dbs_path" :href="fileUrl(staff.dbs_path)" target="_blank" rel="noopener" class="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand-blue"><FileCheck2 :size="17" /> View DBS document</a></section>
        </div>

        <div class="space-y-5">
          <section class="card p-5"><div class="flex items-center justify-between"><h3 class="flex items-center gap-2 font-black text-brand-navy"><Award :size="19" class="text-brand-orange" /> Qualifications</h3><span class="rounded-full bg-brand-sky px-2.5 py-1 text-xs font-extrabold text-brand-blue">{{ staff.qualifications?.length || 0 }}</span></div><EmptyState v-if="!staff.qualifications?.length" class="mt-4" title="No qualifications recorded" message="Qualifications added to this staff record will appear here." :icon="Award" /><div v-else class="mt-4 grid gap-3 sm:grid-cols-2"><article v-for="item in staff.qualifications" :key="item.id" class="rounded-xl border border-slate-100 bg-slate-50 p-4"><p class="font-extrabold text-brand-navy">{{ item.qualification_title || item.qualification || 'Qualification' }}</p><a v-if="item.file_path" :href="fileUrl(item.file_path)" target="_blank" rel="noopener" class="mt-2 inline-flex text-xs font-bold text-brand-blue">View certificate</a></article></div></section>
          <section class="card p-5"><div class="flex items-center justify-between"><div><h3 class="flex items-center gap-2 font-black text-brand-navy"><FileText :size="19" class="text-brand-blue" /> Staff-uploaded documents</h3><p class="mt-1 text-xs text-slate-500">Private files submitted through the staff portal</p></div><span class="rounded-full bg-brand-sky px-2.5 py-1 text-xs font-extrabold text-brand-blue">{{ staff.documents?.length || 0 }}</span></div><EmptyState v-if="!staff.documents?.length" class="mt-4" title="No staff uploads" message="Documents and course certificates uploaded by this staff member will appear here." :icon="FileText" /><div v-else class="mt-4 grid gap-3 sm:grid-cols-2"><article v-for="document in staff.documents" :key="document.id" class="rounded-xl border border-slate-100 bg-slate-50 p-4"><p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-blue">{{ documentLabels[document.type] || 'Document' }}</p><p class="mt-1 font-extrabold text-brand-navy">{{ document.title }}</p><p v-if="document.course_name" class="mt-1 text-sm text-slate-500">{{ document.course_name }}</p><div class="mt-2 flex flex-wrap gap-2 text-xs text-slate-400"><span>{{ document.original_name }}</span><span>{{ formatBytes(document.file_size) }}</span><span v-if="document.issued_on">Issued {{ formatDate(document.issued_on) }}</span><span v-if="document.expires_on">Expires {{ formatDate(document.expires_on) }}</span></div><button class="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-extrabold text-brand-blue shadow-sm" @click="downloadDocument(document)"><Download :size="15" /> Download privately</button></article></div></section>
          <section class="card p-5"><div class="flex items-center justify-between"><h3 class="flex items-center gap-2 font-black text-brand-navy"><CalendarClock :size="19" class="text-brand-blue" /> Supervision history</h3><span class="rounded-full bg-brand-sky px-2.5 py-1 text-xs font-extrabold text-brand-blue">{{ staff.supervision_schedule?.length || 0 }}</span></div><EmptyState v-if="!staff.supervision_schedule?.length" class="mt-4" title="No supervision sessions" message="Scheduled supervision will appear here." :icon="CalendarClock" /><div v-else class="mt-4 space-y-3"><article v-for="item in staff.supervision_schedule.slice(0, 6)" :key="item.id" class="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"><div><p class="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled</p><p class="mt-1 font-extrabold text-brand-navy">{{ formatDate(item.next_supervision_date) }}</p></div><StatusBadge :status="item.status" /></article></div></section>
          <section class="card p-5"><div class="flex items-center justify-between"><h3 class="flex items-center gap-2 font-black text-brand-navy"><GraduationCap :size="19" class="text-brand-mint" /> Training</h3><span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700">{{ staff.staff_trainings?.length || 0 }}</span></div><EmptyState v-if="!staff.staff_trainings?.length" class="mt-4" title="No training assignments" message="Assigned programmes and grades will appear here." :icon="GraduationCap" /><div v-else class="mt-4 grid gap-3 sm:grid-cols-2"><article v-for="item in staff.staff_trainings" :key="item.id" class="rounded-xl border border-slate-100 p-4"><p class="font-extrabold text-brand-navy">{{ item.training_programme?.name || item.training_programme?.title || 'Training programme' }}</p><p class="mt-2 text-sm font-bold text-brand-blue">Grade: {{ item.grade || 'Not graded' }}</p></article></div></section>
        </div>
      </div>
    </div>
  </div>
</template>
