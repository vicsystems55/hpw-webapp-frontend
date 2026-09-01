<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ArrowLeft, CalendarClock, Download, FileCheck2, Pencil, Save, ShieldCheck, Trash2, X } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import PageHeader from '../components/ui/PageHeader.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const policy = ref(null)
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const success = ref('')
const modalOpen = ref(false)
const deleteOpen = ref(false)
const deleting = ref(false)
const attachment = ref(null)
const attachmentTitle = ref('')
const form = reactive({ name: '', type: '', exp_date: '', content: '' })
const storageBase = (api.defaults.baseURL || '').replace(/\/api\/?$/, '/storage/')
const fileUrl = path => path ? `${storageBase}${path}` : null
const formatDate = value => value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Not specified'

async function loadPolicy() {
  loading.value = true
  try {
    const { data } = await api.get(`/policies/${route.params.id}`)
    policy.value = data.data || data
  } catch (requestError) {
    error.value = requestError.response?.status === 404 ? 'This policy could not be found.' : (requestError.response?.data?.message || 'The policy could not be loaded.')
  } finally {
    loading.value = false
  }
}

function openReview() {
  Object.assign(form, { name: policy.value.name, type: policy.value.type || '', exp_date: String(policy.value.exp_date || '').slice(0, 10), content: policy.value.content || '' })
  modalOpen.value = true
}

async function saveReview() {
  saving.value = true
  error.value = ''
  success.value = ''
  const body = new FormData()
  body.append('policy_id', policy.value.id)
  Object.entries(form).forEach(([key, value]) => body.append(key, value))
  if (attachment.value) {
    body.append('text_0', attachmentTitle.value || attachment.value.name)
    body.append('file_0', attachment.value)
  }
  try {
    const { data } = await api.post('/update-policies', body)
    policy.value = data.data
    success.value = data.message
    modalOpen.value = false
    attachment.value = null
    attachmentTitle.value = ''
  } catch (requestError) {
    const errors = requestError.response?.data?.errors
    error.value = errors ? Object.values(errors).flat()[0] : (requestError.response?.data?.message || 'The policy review could not be saved.')
  } finally {
    saving.value = false
  }
}

async function removePolicy() {
  deleting.value = true
  error.value = ''
  try {
    await api.delete(`/policies/${policy.value.id}`)
    await router.push('/policies')
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'The policy could not be removed.'
    deleteOpen.value = false
  } finally {
    deleting.value = false
  }
}

onMounted(loadPolicy)
</script>

<template>
  <div>
    <p v-if="error && modalOpen" class="fixed left-1/2 top-5 z-[80] w-[min(90vw,40rem)] -translate-x-1/2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 shadow-xl">{{ error }}</p>
    <RouterLink to="/policies" class="mb-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand-blue"><ArrowLeft :size="17" /> Back to policies</RouterLink>
    <PageHeader title="Policy review" description="Read the current guidance, inspect supporting documents and record the next review."><template #actions><button v-if="policy && auth.hasPermission('policies.manage')" class="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-extrabold text-red-700 hover:bg-red-100" @click="deleteOpen = true"><Trash2 :size="17" /> Remove policy</button><button v-if="policy && auth.hasPermission('policies.manage')" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white" @click="openReview"><Pencil :size="17" /> Review policy</button></template></PageHeader>
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <div v-if="success" class="mb-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{{ success }}</div>
    <LoadingState v-if="loading" />
    <div v-else-if="policy" class="grid gap-5 xl:grid-cols-[1fr_320px]">
      <article class="card overflow-hidden"><div class="bg-gradient-to-r from-brand-navy via-brand-blue to-brand-mint p-6 text-white"><div class="flex flex-wrap items-start justify-between gap-3"><div><p class="text-xs font-extrabold uppercase tracking-[.18em] text-brand-yellow">{{ policy.type || 'General guidance' }}</p><h2 class="mt-2 text-2xl font-black">{{ policy.name }}</h2></div><StatusBadge :status="policy.status" /></div></div><div class="p-6"><div class="whitespace-pre-line text-[15px] leading-7 text-slate-600">{{ policy.content }}</div></div></article>
      <aside class="space-y-5"><section class="card p-5"><h3 class="flex items-center gap-2 font-black text-brand-navy"><CalendarClock :size="19" class="text-brand-orange" /> Review control</h3><p class="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">Next review date</p><p class="mt-2 text-lg font-black text-brand-navy">{{ formatDate(policy.exp_date) }}</p><p class="mt-3 text-xs leading-5 text-slate-500">Use Review policy to update the guidance, confirm its category and set the next review date.</p></section><section class="card p-5"><div class="flex items-center justify-between"><h3 class="flex items-center gap-2 font-black text-brand-navy"><ShieldCheck :size="19" class="text-brand-blue" /> Documents</h3><span class="rounded-full bg-brand-sky px-2.5 py-1 text-xs font-black text-brand-blue">{{ policy.documents?.length || 0 }}</span></div><EmptyState v-if="!policy.documents?.length" class="mt-4" title="No attachments" message="Supporting files added during a review will appear here." :icon="FileCheck2" /><div v-else class="mt-4 space-y-3"><a v-for="document in policy.documents" :key="document.id" :href="fileUrl(document.file_path)" target="_blank" rel="noopener" class="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 text-sm font-extrabold text-brand-blue"><span class="min-w-0 truncate">{{ document.title }}</span><Download :size="16" class="shrink-0" /></a></div></section></aside>
    </div>

    <div v-if="modalOpen" class="fixed inset-0 z-[70] overflow-y-auto bg-brand-navy/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><section class="mx-auto my-6 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-extrabold uppercase tracking-[.18em] text-brand-orange">Governance review</p><h2 class="mt-1 text-2xl font-black text-brand-navy">Review policy</h2></div><button class="rounded-xl p-2 text-slate-400 hover:bg-slate-100" @click="modalOpen = false"><X :size="21" /></button></div><form class="mt-6 grid gap-4 sm:grid-cols-2" @submit.prevent="saveReview"><label class="field sm:col-span-2"><span>Policy name *</span><input v-model="form.name" required /></label><label class="field"><span>Category</span><input v-model="form.type" /></label><label class="field"><span>Next review date *</span><input v-model="form.exp_date" type="date" required /></label><label class="field sm:col-span-2"><span>Reviewed policy content *</span><textarea v-model="form.content" rows="12" required /></label><label class="field"><span>New attachment title</span><input v-model="attachmentTitle" /></label><label class="field"><span>New attachment</span><input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" @change="attachment = $event.target.files?.[0] || null" /></label><div class="flex justify-end gap-3 border-t border-slate-100 pt-5 sm:col-span-2"><button type="button" class="rounded-xl px-5 py-3 text-sm font-extrabold text-slate-500" @click="modalOpen = false">Cancel</button><button :disabled="saving" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-extrabold text-white disabled:opacity-50"><Save :size="18" /> {{ saving ? 'Saving…' : 'Save review' }}</button></div></form></section></div>
    <ConfirmDeleteModal :open="deleteOpen" :busy="deleting" title="Remove policy?" :item-name="policy?.name" warning="The policy and all attached documents will be permanently deleted." @cancel="deleteOpen = false" @confirm="removePolicy" />
  </div>
</template>

<style scoped>
.field { display: block; }
.field span { margin-bottom: .45rem; display: block; font-size: .82rem; font-weight: 800; color: #102a43; }
.field input, .field textarea { width: 100%; border: 1px solid #e2e8f0; border-radius: .75rem; background: #f8fafc; padding: .72rem .9rem; font-size: .875rem; outline: none; }
.field input:focus, .field textarea:focus { border-color: #087fc3; background: white; }
</style>
