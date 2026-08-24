<script setup>
import { computed, reactive, ref } from 'vue'
import { Eye, HeartPulse, Plus, Save, Search, UserRound, X } from '@lucide/vue'
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
const staffOptions = ref([])
const passportFile = ref(null)
const { items, loading, error, load } = useApiList('/residents-management')
const form = reactive({ name: '', date_of_birth: '', gender: '', address: '', caregiver_id: '', emergency_contact_name: '', emergency_contact_relationship: '', emergency_contact_phone: '', care_level: '', room_assignment: '', admission_date: '', medical_history: '', allergies: '', dietary_restrictions: '', special_requests_or_notes: '', national_insurance_number: '', nhs_number: '' })
const filtered = computed(() => items.value.filter(item => [item.fullname, item.room_assignment, item.care_level].some(value => value?.toLowerCase().includes(search.value.toLowerCase()))))

async function openCreate() {
  error.value = ''
  try {
    const { data } = await api.get('/staff-records')
    staffOptions.value = data.data || data
    modalOpen.value = true
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Staff records could not be loaded for carer assignment.'
  }
}

async function createResident() {
  saving.value = true
  error.value = ''
  const body = new FormData()
  Object.entries(form).forEach(([key, value]) => { if (value !== '') body.append(key, value) })
  if (passportFile.value) body.append('passport_file', passportFile.value)
  try {
    await api.post('/residents-management', body)
    modalOpen.value = false
    Object.keys(form).forEach(key => { form[key] = '' })
    passportFile.value = null
    await load()
  } catch (requestError) {
    const errors = requestError.response?.data?.errors
    error.value = errors ? Object.values(errors).flat()[0] : (requestError.response?.data?.message || 'The resident record could not be created.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <PageHeader title="Resident care" description="Keep essential care information accurate, accessible and easy to act on.">
      <template #actions><button class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-brand-blue/20 hover:bg-brand-blue-dark" @click="openCreate"><Plus :size="18" /> Add resident</button></template>
    </PageHeader>
    <ErrorBanner :message="error" @dismiss="error = ''" />

    <div class="card mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div class="relative w-full sm:max-w-sm"><Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input v-model="search" class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-blue focus:bg-white" placeholder="Search residents…" /></div><p class="text-sm font-bold text-slate-500"><span class="text-brand-blue">{{ filtered.length }}</span> resident{{ filtered.length === 1 ? '' : 's' }}</p></div>

    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!filtered.length" title="No resident records found" message="Add a resident or adjust your search to see care records." :icon="HeartPulse" />
    <div v-else class="card overflow-hidden">
      <div class="hidden overflow-x-auto md:block"><table class="w-full text-left text-sm"><thead class="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500"><tr><th class="px-5 py-4">Resident</th><th class="px-5 py-4">Room</th><th class="px-5 py-4">Care level</th><th class="px-5 py-4">Emergency contact</th><th class="px-5 py-4">Status</th><th class="px-5 py-4"></th></tr></thead><tbody class="divide-y divide-slate-100"><tr v-for="item in filtered" :key="item.id" class="hover:bg-brand-sky/35"><td class="px-5 py-4"><div class="flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-xl bg-brand-sky text-brand-blue"><UserRound :size="18" /></span><div><p class="font-extrabold text-brand-navy">{{ item.fullname }}</p><p class="mt-0.5 text-xs text-slate-400">{{ item.resident_code || `Resident #${item.id}` }}</p></div></div></td><td class="px-5 py-4 font-semibold text-slate-600">{{ item.room_assignment || 'Not assigned' }}</td><td class="px-5 py-4 text-slate-600">{{ item.care_level || 'Not specified' }}</td><td class="px-5 py-4"><p class="font-semibold text-slate-600">{{ item.emergency_contact_name || 'Not provided' }}</p><p class="text-xs text-slate-400">{{ item.emergency_contact_phone }}</p></td><td class="px-5 py-4"><StatusBadge :status="item.status" /></td><td class="px-5 py-4"><RouterLink :to="`/residents/${item.id}`" class="inline-flex items-center gap-2 rounded-lg bg-brand-sky px-3 py-2 text-xs font-extrabold text-brand-blue"><Eye :size="15" /> View</RouterLink></td></tr></tbody></table></div>
      <div class="divide-y divide-slate-100 md:hidden"><article v-for="item in filtered" :key="item.id" class="p-4"><div class="flex items-start justify-between gap-3"><div class="flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-xl bg-brand-sky text-brand-blue"><UserRound :size="18" /></span><div><p class="font-extrabold text-brand-navy">{{ item.fullname }}</p><p class="text-xs text-slate-400">Room {{ item.room_assignment || 'unassigned' }}</p></div></div><StatusBadge :status="item.status" /></div><div class="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs"><div><p class="font-bold text-slate-400">Care level</p><p class="mt-1 font-semibold text-slate-600">{{ item.care_level || 'Not specified' }}</p></div><div><p class="font-bold text-slate-400">Emergency contact</p><p class="mt-1 font-semibold text-slate-600">{{ item.emergency_contact_name || 'Not provided' }}</p></div></div><RouterLink :to="`/residents/${item.id}`" class="mt-3 flex items-center justify-center gap-2 rounded-xl bg-brand-sky px-4 py-2.5 text-sm font-extrabold text-brand-blue"><Eye :size="16" /> View resident details</RouterLink></article></div>
    </div>

    <div v-if="modalOpen" class="fixed inset-0 z-[70] overflow-y-auto bg-brand-navy/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><section class="mx-auto my-6 w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-extrabold uppercase tracking-[.18em] text-brand-orange">New admission</p><h2 class="mt-1 text-2xl font-black text-brand-navy">Add resident</h2><p class="mt-1 text-sm text-slate-500">Record identity, care needs and emergency information.</p></div><button class="rounded-xl p-2 text-slate-400 hover:bg-slate-100" @click="modalOpen = false"><X :size="21" /></button></div>
      <p v-if="error" class="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{{ error }}</p>
      <form class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" @submit.prevent="createResident">
        <label class="field lg:col-span-2"><span>Full name *</span><input v-model="form.name" required /></label><label class="field"><span>Date of birth *</span><input v-model="form.date_of_birth" type="date" required /></label><label class="field"><span>Gender *</span><select v-model="form.gender" required><option value="" disabled>Select gender</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label><label class="field lg:col-span-2"><span>Address *</span><input v-model="form.address" required /></label><label class="field"><span>Assigned carer *</span><select v-model="form.caregiver_id" required><option value="" disabled>Select staff member</option><option v-for="staff in staffOptions" :key="staff.id" :value="staff.id">{{ staff.fullname }}</option></select></label><label class="field"><span>Room</span><input v-model="form.room_assignment" /></label><label class="field"><span>Care level</span><select v-model="form.care_level"><option value="">Not specified</option><option>Low support</option><option>Moderate support</option><option>High support</option><option>Complex care</option></select></label><label class="field"><span>Admission date</span><input v-model="form.admission_date" type="date" /></label><label class="field"><span>Emergency contact *</span><input v-model="form.emergency_contact_name" required /></label><label class="field"><span>Relationship *</span><input v-model="form.emergency_contact_relationship" required /></label><label class="field"><span>Emergency phone *</span><input v-model="form.emergency_contact_phone" required /></label><label class="field"><span>NHS number</span><input v-model="form.nhs_number" /></label><label class="field"><span>NI number</span><input v-model="form.national_insurance_number" /></label><label class="field"><span>Resident photo</span><input type="file" accept="image/png,image/jpeg" @change="passportFile = $event.target.files?.[0] || null" /></label><label class="field sm:col-span-2"><span>Medical history</span><textarea v-model="form.medical_history" rows="3" /></label><label class="field"><span>Allergies</span><textarea v-model="form.allergies" rows="3" /></label><label class="field"><span>Dietary restrictions</span><textarea v-model="form.dietary_restrictions" rows="3" /></label><label class="field sm:col-span-2"><span>Care notes or requests</span><textarea v-model="form.special_requests_or_notes" rows="3" /></label><div class="flex justify-end gap-3 border-t border-slate-100 pt-5 sm:col-span-2 lg:col-span-3"><button type="button" class="rounded-xl px-5 py-3 text-sm font-extrabold text-slate-500" @click="modalOpen = false">Cancel</button><button :disabled="saving" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-extrabold text-white disabled:opacity-50"><Save :size="18" /> {{ saving ? 'Saving…' : 'Create resident' }}</button></div>
      </form></section></div>
  </div>
</template>

<style scoped>
.field { display: block; }
.field span { margin-bottom: .45rem; display: block; font-size: .82rem; font-weight: 800; color: #102a43; }
.field input, .field select, .field textarea { width: 100%; border: 1px solid #e2e8f0; border-radius: .75rem; background: #f8fafc; padding: .72rem .9rem; font-size: .875rem; outline: none; }
.field input:focus, .field select:focus, .field textarea:focus { border-color: #087fc3; background: white; }
</style>
