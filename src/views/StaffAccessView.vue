<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Link2, Link2Off, ShieldCheck, UserRoundCog } from '@lucide/vue'
import api from '../services/api'
import PageHeader from '../components/ui/PageHeader.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const linked = ref([])
const unlinked = ref([])
const accounts = ref([])
const selections = reactive({})
const loading = ref(true)
const busyId = ref(null)
const error = ref('')
const success = ref('')

async function loadLinks() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/admin/staff-account-links')
    linked.value = data.linked_staff_records || []
    unlinked.value = data.unlinked_staff_records || []
    accounts.value = data.available_staff_accounts || []
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Staff account links could not be loaded.'
  } finally {
    loading.value = false
  }
}

async function linkAccount(record) {
  if (!selections[record.id]) return
  busyId.value = record.id
  error.value = ''
  try {
    const { data } = await api.post(`/admin/staff-records/${record.id}/link-user`, { user_id: Number(selections[record.id]) })
    success.value = data.message
    await loadLinks()
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'The account could not be linked.'
  } finally {
    busyId.value = null
  }
}

async function unlinkAccount(record) {
  busyId.value = record.id
  error.value = ''
  try {
    const { data } = await api.delete(`/admin/staff-records/${record.id}/link-user`)
    success.value = data.message
    await loadLinks()
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'The account could not be unlinked.'
  } finally {
    busyId.value = null
  }
}

onMounted(loadLinks)
</script>

<template>
  <div>
    <PageHeader title="Staff portal access" description="Connect each staff login to the correct employment record. One account can be linked to one staff record." />
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <div v-if="success" class="mb-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{{ success }}</div>
    <LoadingState v-if="loading" />
    <div v-else class="grid gap-5 xl:grid-cols-2">
      <section class="card p-5">
        <div class="flex items-center gap-3"><span class="grid h-11 w-11 place-items-center rounded-xl bg-brand-sky text-brand-blue"><UserRoundCog :size="22" /></span><div><h2 class="font-black text-brand-navy">Waiting to be linked</h2><p class="text-sm text-slate-500">Choose the matching staff login.</p></div></div>
        <EmptyState v-if="!unlinked.length" class="mt-5" title="All records are linked" message="There are no staff records waiting for an account." :icon="ShieldCheck" />
        <div v-else class="mt-5 space-y-3">
          <article v-for="record in unlinked" :key="record.id" class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p class="font-extrabold text-brand-navy">{{ record.fullname }}</p><p class="text-sm font-semibold text-brand-blue">{{ record.staff_id }}</p>
            <div class="mt-3 flex flex-col gap-2 sm:flex-row"><select v-model="selections[record.id]" class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-blue"><option value="">Select staff login</option><option v-for="account in accounts" :key="account.id" :value="account.id">{{ account.name }} — {{ account.email }}</option></select><button :disabled="!selections[record.id] || busyId === record.id" class="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50" @click="linkAccount(record)"><Link2 :size="17" /> Link</button></div>
          </article>
        </div>
      </section>
      <section class="card p-5">
        <div class="flex items-center gap-3"><span class="grid h-11 w-11 place-items-center rounded-xl bg-brand-cream text-brand-orange"><ShieldCheck :size="22" /></span><div><h2 class="font-black text-brand-navy">Linked accounts</h2><p class="text-sm text-slate-500">Staff with active self-service access.</p></div></div>
        <EmptyState v-if="!linked.length" class="mt-5" title="No linked accounts" message="Linked staff accounts will appear here." :icon="Link2" />
        <div v-else class="mt-5 space-y-3">
          <article v-for="record in linked" :key="record.id" class="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p class="font-extrabold text-brand-navy">{{ record.fullname }}</p><p class="text-sm text-slate-500">{{ record.user?.email }}</p></div><button :disabled="busyId === record.id" class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-extrabold text-red-700 disabled:opacity-50" @click="unlinkAccount(record)"><Link2Off :size="16" /> Unlink</button></article>
        </div>
      </section>
    </div>
  </div>
</template>
