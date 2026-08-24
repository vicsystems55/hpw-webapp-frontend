<script setup>
import { computed, reactive, ref } from 'vue'
import { BadgeCheck, Plus, Save, Search, ShieldCheck, UploadCloud, UserRound, X } from '@lucide/vue'
import api from '../services/api'
import { useApiList } from '../composables/useApiList'
import PageHeader from '../components/ui/PageHeader.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const search = ref('')
const modalOpen = ref(false)
const saving = ref(false)
const passportFile = ref(null)
const dbsFile = ref(null)
const qualificationFile = ref(null)
const qualificationTitle = ref('')
const { items, loading, error, load } = useApiList('/staff-records')
const form = reactive({ fullname: '', date_of_birth: '', gender: '', address: '', phone: '', email: '', dbs_date: '', last_supervision_date: '', notes: '' })
const filtered = computed(() => items.value.filter(item => [item.fullname, item.staff_id, item.email].some(value => value?.toLowerCase().includes(search.value.toLowerCase()))))

async function createStaff() {
  saving.value = true
  error.value = ''
  const body = new FormData()
  Object.entries(form).forEach(([key, value]) => { if (value !== '') body.append(key, value) })
  if (passportFile.value) body.append('passport_file', passportFile.value)
  if (dbsFile.value) body.append('dbs_file', dbsFile.value)
  if (qualificationTitle.value && qualificationFile.value) {
    body.append('qualification_titles[]', qualificationTitle.value)
    body.append('qualification_files[]', qualificationFile.value)
  }
  try {
    await api.post('/staff-records', body)
    modalOpen.value = false
    Object.keys(form).forEach(key => { form[key] = '' })
    passportFile.value = null
    dbsFile.value = null
    qualificationFile.value = null
    qualificationTitle.value = ''
    await load()
  } catch (requestError) {
    const errors = requestError.response?.data?.errors
    error.value = errors ? Object.values(errors).flat()[0] : (requestError.response?.data?.message || 'The staff record could not be created.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <PageHeader title="Staff records" description="Manage team profiles, qualifications, DBS information and supervision readiness."><template #actions><button class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-brand-blue/20 hover:bg-brand-blue-dark" @click="modalOpen = true"><Plus :size="18" /> Add team member</button></template></PageHeader>
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <div class="card mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div class="relative w-full sm:max-w-sm"><Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input v-model="search" class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-blue focus:bg-white" placeholder="Search team members…" /></div><p class="text-sm font-bold text-slate-500"><span class="text-brand-blue">{{ filtered.length }}</span> team members</p></div>
    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!filtered.length" title="No staff records found" message="Add a team member or adjust your search." :icon="ShieldCheck" />
    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><article v-for="item in filtered" :key="item.id" class="card group p-5 hover:-translate-y-1 hover:shadow-xl"><div class="flex items-start justify-between gap-3"><span class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-mint text-white"><UserRound :size="22" /></span><StatusBadge :status="item.status" /></div><h2 class="mt-4 text-lg font-black text-brand-navy">{{ item.fullname }}</h2><p class="mt-1 text-sm font-bold text-brand-blue">{{ item.staff_id }}</p><p class="mt-3 truncate text-sm text-slate-500">{{ item.email || 'No email linked' }}</p><div class="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4"><div><p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Qualifications</p><p class="mt-1 text-lg font-black text-brand-navy">{{ item.qualifications?.length || 0 }}</p></div><div><p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Supervisions</p><p class="mt-1 text-lg font-black text-brand-navy">{{ item.supervision_schedule?.length || 0 }}</p></div></div><RouterLink :to="`/staff/${item.id}`" class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-extrabold text-brand-navy hover:bg-brand-sky hover:text-brand-blue"><BadgeCheck :size="17" /> View staff profile</RouterLink></article></div>

    <div v-if="modalOpen" class="fixed inset-0 z-[70] overflow-y-auto bg-brand-navy/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><section class="mx-auto my-6 w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-extrabold uppercase tracking-[.18em] text-brand-orange">Team records</p><h2 class="mt-1 text-2xl font-black text-brand-navy">Add team member</h2><p class="mt-1 text-sm text-slate-500">Create the employment record first; login access can then be enabled under Staff Access.</p></div><button class="rounded-xl p-2 text-slate-400 hover:bg-slate-100" @click="modalOpen = false"><X :size="21" /></button></div>
      <p v-if="error" class="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{{ error }}</p>
      <form class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" @submit.prevent="createStaff">
        <label class="field lg:col-span-2"><span>Full name *</span><input v-model="form.fullname" required /></label><label class="field"><span>Date of birth *</span><input v-model="form.date_of_birth" type="date" required /></label><label class="field"><span>Gender *</span><select v-model="form.gender" required><option value="" disabled>Select gender</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label><label class="field lg:col-span-2"><span>Address *</span><input v-model="form.address" required /></label><label class="field"><span>Phone *</span><input v-model="form.phone" required /></label><label class="field lg:col-span-2"><span>Email *</span><input v-model="form.email" type="email" required /></label><label class="field"><span>DBS date</span><input v-model="form.dbs_date" type="date" /></label><label class="field"><span>Last supervision</span><input v-model="form.last_supervision_date" type="date" /></label><label class="field"><span>Profile photo</span><input type="file" accept="image/png,image/jpeg" @change="passportFile = $event.target.files?.[0] || null" /></label><label class="field"><span>DBS document</span><input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" @change="dbsFile = $event.target.files?.[0] || null" /></label><label class="field sm:col-span-2 lg:col-span-3"><span>Employment notes</span><textarea v-model="form.notes" rows="3" /></label>
        <div class="rounded-2xl bg-brand-sky/60 p-4 sm:col-span-2 lg:col-span-3"><div class="flex items-center gap-2"><UploadCloud :size="18" class="text-brand-blue" /><h3 class="font-black text-brand-navy">Optional first qualification</h3></div><div class="mt-3 grid gap-3 sm:grid-cols-2"><label class="field"><span>Qualification title</span><input v-model="qualificationTitle" placeholder="e.g. Care Certificate" /></label><label class="field"><span>Certificate file</span><input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" @change="qualificationFile = $event.target.files?.[0] || null" /></label></div></div>
        <div class="flex justify-end gap-3 border-t border-slate-100 pt-5 sm:col-span-2 lg:col-span-3"><button type="button" class="rounded-xl px-5 py-3 text-sm font-extrabold text-slate-500" @click="modalOpen = false">Cancel</button><button :disabled="saving" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-extrabold text-white disabled:opacity-50"><Save :size="18" /> {{ saving ? 'Saving…' : 'Create staff record' }}</button></div>
      </form></section></div>
  </div>
</template>

<style scoped>
.field { display: block; }
.field span { margin-bottom: .45rem; display: block; font-size: .82rem; font-weight: 800; color: #102a43; }
.field input, .field select, .field textarea { width: 100%; border: 1px solid #e2e8f0; border-radius: .75rem; background: #f8fafc; padding: .72rem .9rem; font-size: .875rem; outline: none; }
.field input:focus, .field select:focus, .field textarea:focus { border-color: #087fc3; background: white; }
</style>
