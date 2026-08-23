<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Check, Copy, KeyRound, Link2, Link2Off, Power, ShieldCheck, UserPlus, UserRoundCog, X } from '@lucide/vue'
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
const credential = ref(null)
const copied = ref(false)

async function loadLinks() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/admin/staff-account-links')
    linked.value = data.linked_staff_records || []
    unlinked.value = data.unlinked_staff_records || []
    accounts.value = data.available_staff_accounts || []
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Staff account access could not be loaded.'
  } finally {
    loading.value = false
  }
}

const requestMessage = requestError => {
  const errors = requestError.response?.data?.errors
  return errors ? Object.values(errors).flat()[0] : requestError.response?.data?.message
}

async function createLogin(record) {
  busyId.value = record.id
  error.value = ''
  success.value = ''
  try {
    const { data } = await api.post(`/admin/staff-records/${record.id}/create-login`)
    success.value = data.message
    if (data.temporary_password) credential.value = { name: record.fullname, email: record.email, password: data.temporary_password }
    await loadLinks()
  } catch (requestError) {
    error.value = requestMessage(requestError) || 'The staff login could not be created.'
  } finally {
    busyId.value = null
  }
}

async function linkAccount(record) {
  if (!selections[record.id]) return
  busyId.value = record.id
  error.value = ''
  success.value = ''
  try {
    const { data } = await api.post(`/admin/staff-records/${record.id}/link-user`, { user_id: Number(selections[record.id]) })
    success.value = data.message
    await loadLinks()
  } catch (requestError) {
    error.value = requestMessage(requestError) || 'The account could not be linked.'
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
    error.value = requestMessage(requestError) || 'The account could not be unlinked.'
  } finally {
    busyId.value = null
  }
}

async function toggleAccess(record) {
  busyId.value = record.id
  error.value = ''
  try {
    const { data } = await api.patch(`/admin/users/${record.user.id}/status`, { is_active: !record.user.is_active })
    success.value = data.message
    await loadLinks()
  } catch (requestError) {
    error.value = requestMessage(requestError) || 'The account status could not be changed.'
  } finally {
    busyId.value = null
  }
}

async function resetPassword(record) {
  busyId.value = record.id
  error.value = ''
  try {
    const { data } = await api.post(`/admin/users/${record.user.id}/reset-password`)
    credential.value = { name: record.fullname, email: record.user.email, password: data.temporary_password }
    success.value = data.message
    await loadLinks()
  } catch (requestError) {
    error.value = requestMessage(requestError) || 'A temporary password could not be generated.'
  } finally {
    busyId.value = null
  }
}

async function copyCredential() {
  if (!credential.value) return
  await navigator.clipboard.writeText(`Hope Pathway staff login\nEmail: ${credential.value.email}\nTemporary password: ${credential.value.password}`)
  copied.value = true
  window.setTimeout(() => { copied.value = false }, 1800)
}

onMounted(loadLinks)
</script>

<template>
  <div>
    <PageHeader title="Users & permissions" description="Create, link and protect staff portal accounts. Temporary passwords are displayed once and must be changed at first login." />
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <div v-if="success" class="mb-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{{ success }}</div>
    <LoadingState v-if="loading" />
    <div v-else class="grid gap-5 xl:grid-cols-2">
      <section class="card p-5">
        <div class="flex items-center gap-3"><span class="grid h-11 w-11 place-items-center rounded-xl bg-brand-sky text-brand-blue"><UserRoundCog :size="22" /></span><div><h2 class="font-black text-brand-navy">Staff awaiting access</h2><p class="text-sm text-slate-500">Create a login or attach one that already exists.</p></div></div>
        <EmptyState v-if="!unlinked.length" class="mt-5" title="Every staff record is linked" message="There are no staff records waiting for portal access." :icon="ShieldCheck" />
        <div v-else class="mt-5 space-y-3">
          <article v-for="record in unlinked" :key="record.id" class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p class="font-extrabold text-brand-navy">{{ record.fullname }}</p><p class="text-sm font-semibold text-brand-blue">{{ record.staff_id }}</p><p class="mt-1 text-xs text-slate-500">{{ record.email || 'Email required before access can be created' }}</p></div><button :disabled="!record.email || busyId === record.id" class="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50" @click="createLogin(record)"><UserPlus :size="17" /> Create login</button></div>
            <div v-if="accounts.length" class="mt-4 border-t border-slate-200 pt-4"><p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Or link an existing login</p><div class="flex flex-col gap-2 sm:flex-row"><select v-model="selections[record.id]" class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-blue"><option value="">Select staff login</option><option v-for="account in accounts" :key="account.id" :value="account.id">{{ account.name }} — {{ account.email }}</option></select><button :disabled="!selections[record.id] || busyId === record.id" class="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-blue/20 bg-white px-4 py-2.5 text-sm font-extrabold text-brand-blue disabled:opacity-50" @click="linkAccount(record)"><Link2 :size="17" /> Link</button></div></div>
          </article>
        </div>
      </section>

      <section class="card p-5">
        <div class="flex items-center gap-3"><span class="grid h-11 w-11 place-items-center rounded-xl bg-brand-cream text-brand-orange"><ShieldCheck :size="22" /></span><div><h2 class="font-black text-brand-navy">Linked staff accounts</h2><p class="text-sm text-slate-500">Control login status and password recovery.</p></div></div>
        <EmptyState v-if="!linked.length" class="mt-5" title="No linked accounts" message="Linked staff accounts will appear here." :icon="Link2" />
        <div v-else class="mt-5 space-y-3">
          <article v-for="record in linked" :key="record.id" class="rounded-2xl border border-slate-100 p-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div class="flex flex-wrap items-center gap-2"><p class="font-extrabold text-brand-navy">{{ record.fullname }}</p><span class="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider" :class="record.user?.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'">{{ record.user?.is_active ? 'Active' : 'Suspended' }}</span><span v-if="record.user?.must_change_password" class="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-700">Temporary password</span></div><p class="mt-1 text-sm text-slate-500">{{ record.user?.email }}</p></div></div>
            <div class="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4"><button :disabled="busyId === record.id" class="inline-flex items-center gap-2 rounded-xl bg-brand-sky px-3 py-2 text-xs font-extrabold text-brand-blue disabled:opacity-50" @click="resetPassword(record)"><KeyRound :size="15" /> Reset password</button><button :disabled="busyId === record.id" class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold disabled:opacity-50" :class="record.user?.is_active ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'" @click="toggleAccess(record)"><Power :size="15" /> {{ record.user?.is_active ? 'Suspend' : 'Activate' }}</button><button :disabled="busyId === record.id" class="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700 disabled:opacity-50" @click="unlinkAccount(record)"><Link2Off :size="15" /> Unlink</button></div>
          </article>
        </div>
      </section>
    </div>

    <div v-if="credential" class="fixed inset-0 z-[70] grid place-items-center bg-brand-navy/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="credential-title">
      <section class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-7"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-orange">Shown once</p><h2 id="credential-title" class="mt-1 text-xl font-black text-brand-navy">Temporary staff login</h2></div><button class="rounded-xl p-2 text-slate-400 hover:bg-slate-100" aria-label="Close" @click="credential = null"><X :size="20" /></button></div><p class="mt-3 text-sm leading-6 text-slate-500">Give these details securely to {{ credential.name }}. They must change the password immediately after signing in.</p><div class="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4"><div><p class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Email</p><p class="mt-1 break-all font-bold text-brand-navy">{{ credential.email }}</p></div><div><p class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Temporary password</p><p class="mt-1 break-all font-mono text-lg font-black text-brand-blue">{{ credential.password }}</p></div></div><button class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 py-3 text-sm font-extrabold text-white" @click="copyCredential"><Check v-if="copied" :size="18" /><Copy v-else :size="18" /> {{ copied ? 'Copied' : 'Copy login details' }}</button></section>
    </div>
  </div>
</template>
