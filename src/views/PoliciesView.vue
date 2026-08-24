<script setup>
import { computed, reactive, ref } from 'vue'
import { ArrowRight, CalendarClock, FilePlus2, FileText, Save, Search, X } from '@lucide/vue'
import api from '../services/api'
import { useApiList } from '../composables/useApiList'
import { useAuthStore } from '../stores/auth'
import PageHeader from '../components/ui/PageHeader.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const auth = useAuthStore()
const search = ref('')
const modalOpen = ref(false)
const saving = ref(false)
const attachment = ref(null)
const attachmentTitle = ref('')
const form = reactive({ name: '', type: '', exp_date: '', content: '' })
const { items, loading, error, load } = useApiList('/policies')
const filtered = computed(() => items.value.filter(item => [item.name, item.type].some(value => value?.toLowerCase().includes(search.value.toLowerCase()))))
const formatDate = value => value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not specified'

async function createPolicy() {
  saving.value = true
  error.value = ''
  const body = new FormData()
  Object.entries(form).forEach(([key, value]) => body.append(key, value))
  if (attachment.value) {
    body.append('text_0', attachmentTitle.value || attachment.value.name)
    body.append('file_0', attachment.value)
  }
  try {
    await api.post('/policies', body)
    modalOpen.value = false
    Object.keys(form).forEach(key => { form[key] = '' })
    attachment.value = null
    attachmentTitle.value = ''
    await load()
  } catch (requestError) {
    const errors = requestError.response?.data?.errors
    error.value = errors ? Object.values(errors).flat()[0] : (requestError.response?.data?.message || 'The policy could not be created.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <p v-if="error && modalOpen" class="fixed left-1/2 top-5 z-[80] w-[min(90vw,40rem)] -translate-x-1/2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 shadow-xl">{{ error }}</p>
    <PageHeader title="Policies & guidance" description="One trusted library for the standards that guide safe, consistent care."><template #actions><button v-if="auth.hasPermission('policies.manage')" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white" @click="modalOpen = true"><FilePlus2 :size="18" /> New policy</button></template></PageHeader>
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <div class="card mb-6 p-4"><div class="relative max-w-md"><Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input v-model="search" class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-blue focus:bg-white" placeholder="Search policy library…" /></div></div>
    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!filtered.length" title="No policies found" message="Published policies and guidance will appear here." :icon="FileText" />
    <div v-else class="grid gap-4 lg:grid-cols-2"><RouterLink v-for="policy in filtered" :key="policy.id" :to="`/policies/${policy.id}`" class="card group flex gap-4 p-5 hover:-translate-y-0.5 hover:shadow-xl"><span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-cream text-brand-orange"><FileText :size="22" /></span><div class="min-w-0 flex-1"><div class="flex flex-wrap items-start justify-between gap-2"><div class="min-w-0"><p class="text-xs font-extrabold uppercase tracking-wider text-brand-blue">{{ policy.type || 'General guidance' }}</p><h2 class="mt-1 truncate text-lg font-black text-brand-navy">{{ policy.name }}</h2></div><StatusBadge :status="policy.status" /></div><p class="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{{ policy.content }}</p><div class="mt-4 flex items-center justify-between gap-3"><span class="flex items-center gap-2 text-xs font-bold text-slate-400"><CalendarClock :size="15" /> Review by {{ formatDate(policy.exp_date) }}</span><span class="inline-flex items-center gap-1 text-xs font-extrabold text-brand-blue">View or review <ArrowRight :size="15" /></span></div></div></RouterLink></div>

    <div v-if="modalOpen" class="fixed inset-0 z-[70] overflow-y-auto bg-brand-navy/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><section class="mx-auto my-6 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-extrabold uppercase tracking-[.18em] text-brand-orange">Policy library</p><h2 class="mt-1 text-2xl font-black text-brand-navy">Create new policy</h2></div><button class="rounded-xl p-2 text-slate-400 hover:bg-slate-100" @click="modalOpen = false"><X :size="21" /></button></div><form class="mt-6 grid gap-4 sm:grid-cols-2" @submit.prevent="createPolicy"><label class="field sm:col-span-2"><span>Policy name *</span><input v-model="form.name" required /></label><label class="field"><span>Category</span><input v-model="form.type" placeholder="e.g. Safeguarding" /></label><label class="field"><span>Next review date *</span><input v-model="form.exp_date" type="date" required /></label><label class="field sm:col-span-2"><span>Policy content *</span><textarea v-model="form.content" rows="10" required placeholder="Write the approved policy and guidance…" /></label><label class="field"><span>Attachment title</span><input v-model="attachmentTitle" placeholder="Optional supporting document" /></label><label class="field"><span>Attachment</span><input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" @change="attachment = $event.target.files?.[0] || null" /></label><div class="flex justify-end gap-3 border-t border-slate-100 pt-5 sm:col-span-2"><button type="button" class="rounded-xl px-5 py-3 text-sm font-extrabold text-slate-500" @click="modalOpen = false">Cancel</button><button :disabled="saving" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-extrabold text-white disabled:opacity-50"><Save :size="18" /> {{ saving ? 'Publishing…' : 'Create policy' }}</button></div></form></section></div>
  </div>
</template>

<style scoped>
.field { display: block; }
.field span { margin-bottom: .45rem; display: block; font-size: .82rem; font-weight: 800; color: #102a43; }
.field input, .field textarea { width: 100%; border: 1px solid #e2e8f0; border-radius: .75rem; background: #f8fafc; padding: .72rem .9rem; font-size: .875rem; outline: none; }
.field input:focus, .field textarea:focus { border-color: #087fc3; background: white; }
</style>
