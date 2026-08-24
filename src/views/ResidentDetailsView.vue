<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft, CalendarDays, FileText, HeartPulse, Home, Mail, Phone, ShieldAlert, UserRound, Utensils } from '@lucide/vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import PageHeader from '../components/ui/PageHeader.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'

const route = useRoute()
const resident = ref(null)
const caregiver = ref(null)
const loading = ref(true)
const error = ref('')
const storageBase = (api.defaults.baseURL || '').replace(/\/api\/?$/, '/storage/')
const fileUrl = path => path ? `${storageBase}${path}` : null
const initials = computed(() => resident.value?.fullname?.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase() || 'HP')
const formatDate = value => value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Not recorded'

async function loadResident() {
  loading.value = true
  try {
    const { data } = await api.get(`/residents-management/${route.params.id}`)
    resident.value = data.data || data
    if (resident.value.caregiver_id) {
      const response = await api.get(`/staff-records/${resident.value.caregiver_id}`)
      caregiver.value = response.data.data || response.data
    }
  } catch (requestError) {
    error.value = requestError.response?.status === 404 ? 'This resident record could not be found.' : (requestError.response?.data?.message || 'The resident record could not be loaded.')
  } finally {
    loading.value = false
  }
}

onMounted(loadResident)
</script>

<template>
  <div>
    <RouterLink to="/residents" class="mb-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand-blue"><ArrowLeft :size="17" /> Back to residents</RouterLink>
    <PageHeader title="Resident details" description="Identity, contacts, care needs and key records in one place." />
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <LoadingState v-if="loading" />
    <div v-else-if="resident" class="space-y-5">
      <section class="card overflow-hidden"><div class="h-24 bg-gradient-to-r from-brand-orange via-brand-yellow to-brand-mint" /><div class="flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end"><div class="-mt-12 grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-3xl border-4 border-white bg-brand-navy text-2xl font-black text-white shadow-lg"><img v-if="resident.passport_file" :src="fileUrl(resident.passport_file)" :alt="resident.fullname" class="h-full w-full object-cover" /><span v-else>{{ initials }}</span></div><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><h2 class="text-2xl font-black text-brand-navy">{{ resident.fullname }}</h2><StatusBadge :status="resident.status" /></div><p class="mt-1 font-extrabold text-brand-blue">{{ resident.resident_code || `Resident #${resident.id}` }}</p></div><div class="rounded-2xl bg-brand-sky px-4 py-3 text-sm"><p class="font-bold text-slate-500">Assigned carer</p><p class="mt-1 font-black text-brand-navy">{{ caregiver?.fullname || 'Not assigned' }}</p></div></div></section>
      <div class="grid gap-5 lg:grid-cols-3">
        <section class="card p-5"><h3 class="flex items-center gap-2 font-black text-brand-navy"><UserRound :size="19" class="text-brand-blue" /> Personal details</h3><dl class="detail-list"><div><dt>Date of birth</dt><dd>{{ formatDate(resident.date_of_birth) }}</dd></div><div><dt>Gender</dt><dd>{{ resident.gender }}</dd></div><div><dt>Address</dt><dd>{{ resident.address }}</dd></div><div><dt>NHS number</dt><dd>{{ resident.nhs_number || 'Not recorded' }}</dd></div><div><dt>NI number</dt><dd>{{ resident.national_insurance_number || 'Not recorded' }}</dd></div></dl></section>
        <section class="card p-5"><h3 class="flex items-center gap-2 font-black text-brand-navy"><Home :size="19" class="text-brand-mint" /> Placement</h3><dl class="detail-list"><div><dt>Room</dt><dd>{{ resident.room_assignment || 'Not assigned' }}</dd></div><div><dt>Care level</dt><dd>{{ resident.care_level || 'Not specified' }}</dd></div><div><dt>Admission</dt><dd>{{ formatDate(resident.admission_date) }}</dd></div><div><dt>Discharge</dt><dd>{{ formatDate(resident.discharge_date) }}</dd></div></dl></section>
        <section class="card p-5"><h3 class="flex items-center gap-2 font-black text-brand-navy"><Phone :size="19" class="text-brand-orange" /> Emergency contact</h3><dl class="detail-list"><div><dt>Name</dt><dd>{{ resident.emergency_contact_name || 'Not recorded' }}</dd></div><div><dt>Relationship</dt><dd>{{ resident.emergency_contact_relationship || 'Not recorded' }}</dd></div><div><dt>Phone</dt><dd>{{ resident.emergency_contact_phone || 'Not recorded' }}</dd></div></dl></section>
      </div>
      <div class="grid gap-5 lg:grid-cols-2">
        <section class="card p-5"><h3 class="flex items-center gap-2 font-black text-brand-navy"><HeartPulse :size="19" class="text-red-500" /> Health and care</h3><div class="mt-4 grid gap-3"><div class="care-box"><p><ShieldAlert :size="17" /> Allergies</p><span>{{ resident.allergies || 'None recorded' }}</span></div><div class="care-box"><p><Utensils :size="17" /> Dietary restrictions</p><span>{{ resident.dietary_restrictions || 'None recorded' }}</span></div><div class="care-box"><p><FileText :size="17" /> Medical history</p><span>{{ resident.medical_history || 'No history recorded' }}</span></div></div></section>
        <section class="card p-5"><h3 class="flex items-center gap-2 font-black text-brand-navy"><CalendarDays :size="19" class="text-brand-blue" /> Notes and documents</h3><p class="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{{ resident.special_requests_or_notes || 'No special requests or care notes recorded.' }}</p><div class="mt-4 flex flex-wrap gap-2"><a v-if="resident.government_details_file" :href="fileUrl(resident.government_details_file)" target="_blank" class="doc-link">Government details</a><a v-if="resident.past_records_file" :href="fileUrl(resident.past_records_file)" target="_blank" class="doc-link">Past records</a></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-list { margin-top: 1.1rem; display: grid; gap: .9rem; font-size: .875rem; }
.detail-list dt { font-weight: 700; color: #94a3b8; }
.detail-list dd { margin-top: .2rem; font-weight: 700; color: #102a43; }
.care-box { border-radius: .85rem; background: #f8fafc; padding: 1rem; }
.care-box p { display: flex; align-items: center; gap: .45rem; font-size: .78rem; font-weight: 900; color: #102a43; }
.care-box span { margin-top: .45rem; display: block; font-size: .875rem; line-height: 1.5; color: #64748b; white-space: pre-line; }
.doc-link { border-radius: .7rem; background: #eaf7ff; padding: .65rem .9rem; font-size: .75rem; font-weight: 800; color: #087fc3; }
</style>
