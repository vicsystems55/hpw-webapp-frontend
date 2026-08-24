<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Award, BadgeCheck, Download, FileText, Mail, MapPin, Phone, Save, Trash2, UploadCloud, UserRound } from '@lucide/vue'
import api from '../services/api'
import PageHeader from '../components/ui/PageHeader.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'

const profile = ref(null)
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const error = ref('')
const success = ref('')
const selectedFile = ref(null)
const fileInput = ref(null)
const form = reactive({ phone_number: '', address: '' })
const documentForm = reactive({ type: 'course_certificate', title: '', course_name: '', issued_on: '', expires_on: '' })
const documentTypes = [
  ['course_certificate', 'Course certificate'],
  ['qualification', 'Qualification'],
  ['training', 'Training document'],
  ['dbs', 'DBS document'],
  ['identity', 'Identity document'],
  ['other', 'Other document'],
]

const typeLabel = type => documentTypes.find(item => item[0] === type)?.[1] || 'Document'
const formatDate = value => value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null
const formatBytes = bytes => bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

async function loadProfile() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/staff/profile')
    profile.value = data.data
    form.phone_number = profile.value.phone_number || ''
    form.address = profile.value.address || ''
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Your staff profile could not be loaded.'
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    const { data } = await api.put('/staff/profile', form)
    profile.value = data.data
    success.value = data.message
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Your profile could not be updated.'
  } finally {
    saving.value = false
  }
}

function chooseFile(event) {
  selectedFile.value = event.target.files?.[0] || null
}

async function uploadDocument() {
  if (!selectedFile.value) {
    error.value = 'Choose a document to upload.'
    return
  }
  uploading.value = true
  error.value = ''
  success.value = ''
  const body = new FormData()
  Object.entries(documentForm).forEach(([key, value]) => { if (value) body.append(key, value) })
  body.append('file', selectedFile.value)
  try {
    const { data } = await api.post('/staff/documents', body)
    success.value = data.message
    Object.assign(documentForm, { type: 'course_certificate', title: '', course_name: '', issued_on: '', expires_on: '' })
    selectedFile.value = null
    if (fileInput.value) fileInput.value.value = ''
    await loadProfile()
  } catch (requestError) {
    const errors = requestError.response?.data?.errors
    error.value = errors ? Object.values(errors).flat()[0] : (requestError.response?.data?.message || 'The document could not be uploaded.')
  } finally {
    uploading.value = false
  }
}

async function removeDocument(document) {
  if (!window.confirm(`Remove “${document.title}”?`)) return
  error.value = ''
  try {
    const { data } = await api.delete(`/staff/documents/${document.id}`)
    success.value = data.message
    await loadProfile()
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'The document could not be removed.'
  }
}

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

onMounted(loadProfile)
</script>

<template>
  <div>
    <PageHeader title="My staff profile" description="Keep your contact details, compliance documents and course certificates current." />
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <div v-if="success" class="mb-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{{ success }}</div>
    <LoadingState v-if="loading" />
    <div v-else-if="profile" class="space-y-5">
      <div class="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <section class="card p-6">
          <div class="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
            <span class="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-blue via-brand-mint to-brand-orange text-white"><UserRound :size="30" /></span>
            <div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><h2 class="text-xl font-black text-brand-navy">{{ profile.fullname }}</h2><StatusBadge :status="profile.status" /></div><p class="mt-1 font-bold text-brand-blue">{{ profile.staff_id }}</p><p class="mt-2 flex items-center gap-2 text-sm text-slate-500"><Mail :size="16" /> {{ profile.email }}</p></div>
          </div>
          <form class="mt-6 space-y-5" @submit.prevent="saveProfile">
            <label class="block"><span class="mb-2 flex items-center gap-2 text-sm font-extrabold text-brand-navy"><Phone :size="16" /> Phone number</span><input v-model="form.phone_number" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:bg-white" /></label>
            <label class="block"><span class="mb-2 flex items-center gap-2 text-sm font-extrabold text-brand-navy"><MapPin :size="16" /> Address</span><textarea v-model="form.address" rows="4" class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:bg-white" /></label>
            <button :disabled="saving" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60"><Save :size="18" /> {{ saving ? 'Saving…' : 'Save changes' }}</button>
          </form>
        </section>

        <section class="card p-6">
          <div class="flex items-center gap-3"><span class="grid h-11 w-11 place-items-center rounded-xl bg-brand-cream text-brand-orange"><BadgeCheck :size="22" /></span><div><h2 class="font-black text-brand-navy">Qualifications</h2><p class="text-sm text-slate-500">Credentials held on your existing record</p></div></div>
          <div v-if="profile.qualifications?.length" class="mt-5 space-y-3"><div v-for="qualification in profile.qualifications" :key="qualification.id" class="rounded-xl border border-slate-100 bg-slate-50 p-4"><p class="font-extrabold text-brand-navy">{{ qualification.qualification_title || qualification.qualification || 'Qualification' }}</p><p class="mt-1 text-sm text-slate-500">Verified record held by Hope Pathway</p></div></div>
          <p v-else class="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No qualifications have been added to your record yet.</p>
        </section>
      </div>

      <section class="card overflow-hidden">
        <div class="bg-gradient-to-r from-brand-navy via-brand-blue to-brand-mint p-6 text-white"><div class="flex items-center gap-3"><UploadCloud :size="28" /><div><h2 class="text-xl font-black">My documents and certificates</h2><p class="mt-1 text-sm text-blue-100">Upload compliance evidence and certificates from completed courses. Files are private to you and administrators.</p></div></div></div>
        <div class="grid gap-6 p-6 xl:grid-cols-[.85fr_1.15fr]">
          <form class="space-y-4 rounded-2xl bg-slate-50 p-5" @submit.prevent="uploadDocument">
            <div><h3 class="font-black text-brand-navy">Upload a document</h3><p class="mt-1 text-xs text-slate-500">PDF, Word, JPG or PNG up to 10 MB</p></div>
            <label class="block"><span class="mb-2 block text-sm font-extrabold text-brand-navy">Document type</span><select v-model="documentForm.type" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"><option v-for="item in documentTypes" :key="item[0]" :value="item[0]">{{ item[1] }}</option></select></label>
            <label class="block"><span class="mb-2 block text-sm font-extrabold text-brand-navy">Title</span><input v-model="documentForm.title" required class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm" placeholder="e.g. Level 3 Health and Social Care" /></label>
            <label v-if="documentForm.type === 'course_certificate'" class="block"><span class="mb-2 block text-sm font-extrabold text-brand-navy">Course completed</span><input v-model="documentForm.course_name" required class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm" placeholder="Course name" /></label>
            <div class="grid gap-3 sm:grid-cols-2"><label><span class="mb-2 block text-sm font-extrabold text-brand-navy">Issued on</span><input v-model="documentForm.issued_on" type="date" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm" /></label><label><span class="mb-2 block text-sm font-extrabold text-brand-navy">Expires on</span><input v-model="documentForm.expires_on" type="date" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm" /></label></div>
            <label class="block rounded-xl border-2 border-dashed border-brand-blue/25 bg-white p-4 text-center"><input ref="fileInput" type="file" required accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="sr-only" @change="chooseFile" /><UploadCloud :size="24" class="mx-auto text-brand-blue" /><span class="mt-2 block text-sm font-extrabold text-brand-blue">{{ selectedFile?.name || 'Choose file' }}</span></label>
            <button :disabled="uploading" class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60"><UploadCloud :size="18" /> {{ uploading ? 'Uploading…' : 'Upload securely' }}</button>
          </form>

          <div><div class="flex items-center justify-between gap-3"><div><h3 class="font-black text-brand-navy">Uploaded files</h3><p class="mt-1 text-sm text-slate-500">You can download or replace your own evidence.</p></div><span class="rounded-full bg-brand-sky px-3 py-1 text-xs font-black text-brand-blue">{{ profile.documents?.length || 0 }}</span></div>
            <div v-if="profile.documents?.length" class="mt-4 grid gap-3 sm:grid-cols-2">
              <article v-for="document in profile.documents" :key="document.id" class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><div class="flex items-start gap-3"><span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl" :class="document.type === 'course_certificate' ? 'bg-brand-cream text-brand-orange' : 'bg-brand-sky text-brand-blue'"><Award v-if="document.type === 'course_certificate'" :size="20" /><FileText v-else :size="20" /></span><div class="min-w-0"><p class="text-xs font-extrabold uppercase tracking-wider text-brand-blue">{{ typeLabel(document.type) }}</p><h4 class="mt-1 break-words font-black text-brand-navy">{{ document.title }}</h4><p v-if="document.course_name" class="mt-1 text-sm text-slate-500">{{ document.course_name }}</p></div></div><div class="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-slate-400"><span>{{ document.original_name }}</span><span>{{ formatBytes(document.file_size) }}</span><span v-if="document.issued_on">Issued {{ formatDate(document.issued_on) }}</span><span v-if="document.expires_on">Expires {{ formatDate(document.expires_on) }}</span></div><div class="mt-4 flex gap-2"><button class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-sky px-3 py-2 text-xs font-extrabold text-brand-blue" @click="downloadDocument(document)"><Download :size="15" /> Download</button><button class="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600" aria-label="Remove document" @click="removeDocument(document)"><Trash2 :size="15" /></button></div></article>
            </div>
            <div v-else class="mt-4 grid min-h-56 place-items-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center"><div><FileText :size="36" class="mx-auto text-slate-300" /><p class="mt-3 font-black text-brand-navy">No uploaded documents</p><p class="mt-1 text-sm text-slate-500">Your files and course certificates will appear here.</p></div></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
