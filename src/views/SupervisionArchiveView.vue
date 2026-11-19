<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Archive, ArrowLeft, Check, ChevronRight, ClipboardCheck, FileJson, Printer, Search, ShieldCheck, Upload, Users, X } from '@lucide/vue'
import api from '../services/api'
import PageHeader from '../components/ui/PageHeader.vue'
import StatCard from '../components/ui/StatCard.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const baseUrl = '/admin/supervision-archives'
const archives = ref([])
const archive = ref(null)
const selectedArchiveId = ref('')
const selectedStaffId = ref(null)
const selectedSessionId = ref(null)
const session = ref(null)
const search = ref('')
const loading = ref(true)
const archiveLoading = ref(false)
const sessionLoading = ref(false)
const loadFailed = ref(false)
const sessionLoadFailed = ref(false)
const error = ref('')
const sessionError = ref('')
const success = ref('')
const fileInput = ref(null)
const importDialog = ref(null)
const importFile = ref(null)
const preview = ref(null)
const previewing = ref(false)
const importing = ref(false)
const importError = ref('')
let archiveRequest = 0
let sessionRequest = 0
let returnFocus = null

const sameId = (left, right) => String(left) === String(right)
const selectedStaff = computed(() => archive.value?.staff.find(person => sameId(person.legacy_staff_id, selectedStaffId.value)))
const filteredStaff = computed(() => {
  const term = search.value.trim().toLowerCase()
  return (archive.value?.staff || []).filter(person => !term || [person.fullname, person.staff_id]
    .some(value => String(value || '').toLowerCase().includes(term)))
})
const staffSessions = computed(() => (archive.value?.sessions || [])
  .filter(item => sameId(item.legacy_staff_id, selectedStaffId.value))
  .sort((left, right) => String(right.answer_dates?.last_saved_at || '').localeCompare(String(left.answer_dates?.last_saved_at || '')) || right.legacy_session_id - left.legacy_session_id))
const answerGroups = computed(() => {
  const groups = new Map()
  for (const answer of session.value?.answers || []) {
    const id = String(answer.legacy_question_id)
    if (!groups.has(id)) groups.set(id, { id, question: answer.question_snapshot?.text || 'Question unavailable in source', answers: [] })
    groups.get(id).answers.push(answer)
  }
  return [...groups.values()]
})
const counts = computed(() => archive.value?.counts || { staff: 0, completed_sessions: 0, answer_rows: 0 })

function formatDate(value) {
  if (!value) return 'Not recorded'
  const text = String(value)
  if (!/^\d{4}-\d{2}-\d{2}/.test(text)) return text
  const date = new Date(`${text.slice(0, 10)}T12:00:00Z`)
  return Number.isNaN(date.getTime()) ? text : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

function requestMessage(requestError, fallback) {
  const errors = requestError.response?.data?.errors
  return (errors ? Object.values(errors).flat()[0] : requestError.response?.data?.message) || fallback
}

async function loadArchives(preferredId = '') {
  loading.value = true
  loadFailed.value = false
  error.value = ''
  try {
    const { data } = await api.get(baseUrl)
    archives.value = data.data || []
    const id = preferredId || selectedArchiveId.value
    selectedArchiveId.value = archives.value.find(item => item.id === id)?.id || archives.value[0]?.id || ''
    if (selectedArchiveId.value) await loadArchive()
    else { archive.value = null; session.value = null }
  } catch (requestError) {
    loadFailed.value = true
    error.value = requestMessage(requestError, 'The supervision archives could not be loaded.')
  } finally {
    loading.value = false
  }
}

async function loadArchive() {
  const request = ++archiveRequest
  ++sessionRequest
  archiveLoading.value = true
  archive.value = null
  session.value = null
  sessionLoading.value = false
  loadFailed.value = false
  sessionLoadFailed.value = false
  error.value = ''
  sessionError.value = ''
  search.value = ''
  try {
    const { data } = await api.get(`${baseUrl}/${selectedArchiveId.value}`)
    if (request !== archiveRequest) return
    archive.value = data.data
    if (archive.value.staff.length) await selectStaff(archive.value.staff[0])
  } catch (requestError) {
    if (request === archiveRequest) {
      loadFailed.value = true
      error.value = requestMessage(requestError, 'This archive could not be opened.')
    }
  } finally {
    if (request === archiveRequest) archiveLoading.value = false
  }
}

async function selectStaff(person) {
  selectedStaffId.value = person.legacy_staff_id
  selectedSessionId.value = null
  session.value = null
  if (staffSessions.value.length) await selectSession(staffSessions.value[0])
}

async function selectSession(item) {
  const request = ++sessionRequest
  selectedSessionId.value = item.legacy_session_id
  session.value = null
  sessionError.value = ''
  sessionLoadFailed.value = false
  sessionLoading.value = true
  try {
    const { data } = await api.get(`${baseUrl}/${selectedArchiveId.value}/sessions/${item.legacy_session_id}`)
    if (request === sessionRequest) session.value = data.data
  } catch (requestError) {
    if (request === sessionRequest) {
      sessionLoadFailed.value = true
      sessionError.value = requestMessage(requestError, 'The saved supervision responses could not be loaded.')
    }
  } finally {
    if (request === sessionRequest) sessionLoading.value = false
  }
}

function chooseImport(event) {
  returnFocus = event.currentTarget
  fileInput.value.value = ''
  fileInput.value.click()
}

async function previewImport(event) {
  const file = event.target.files?.[0]
  if (!file) return
  importFile.value = file
  preview.value = null
  importError.value = ''
  previewing.value = true
  await nextTick()
  importDialog.value.showModal()
  try {
    if (!file.name.toLowerCase().endsWith('.json') || file.size > 5 * 1024 * 1024) throw new Error('Choose a prepared archive JSON file smaller than 5 MB.')
    const body = new FormData()
    body.append('archive', file)
    const { data } = await api.post(`${baseUrl}/preview`, body)
    preview.value = data.data
  } catch (requestError) {
    importError.value = requestMessage(requestError, requestError.message || 'The archive could not be checked.')
  } finally {
    previewing.value = false
  }
}

function closeImport() {
  if (importing.value || previewing.value) return
  importDialog.value.close()
  importFile.value = null
  preview.value = null
  importError.value = ''
  nextTick(() => returnFocus?.isConnected && returnFocus.focus())
}

async function saveImport() {
  if (!preview.value || !importFile.value || importing.value) return
  importing.value = true
  importError.value = ''
  let importedId
  try {
    const body = new FormData()
    body.append('archive', importFile.value)
    const { data } = await api.post(baseUrl, body)
    importedId = data.data.id
    success.value = data.message || 'Completed supervision archive imported.'
  } catch (requestError) {
    importError.value = requestMessage(requestError, 'The archive could not be imported.')
  } finally {
    importing.value = false
  }
  if (importedId) {
    closeImport()
    await loadArchives(importedId)
  }
}

const beforePrint = () => { if (session.value) document.body.classList.add('printing-supervision-archive') }
const afterPrint = () => document.body.classList.remove('printing-supervision-archive')
function printSession() {
  if (!session.value) return
  beforePrint()
  try { window.print() } finally { afterPrint() }
}
onMounted(() => {
  loadArchives()
  window.addEventListener('beforeprint', beforePrint)
  window.addEventListener('afterprint', afterPrint)
})
onBeforeUnmount(() => {
  ++archiveRequest
  ++sessionRequest
  importDialog.value?.close()
  window.removeEventListener('beforeprint', beforePrint)
  window.removeEventListener('afterprint', afterPrint)
  afterPrint()
})
</script>

<template>
  <div class="supervision-archive-page">
    <div class="archive-controls">
      <RouterLink to="/supervision" class="mb-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand-blue"><ArrowLeft :size="17" /> Supervision question bank</RouterLink>
      <PageHeader title="Completed supervision archive" description="Read historical staff supervision sessions, with the questions and responses preserved from each backup.">
        <template #actions><button type="button" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white" @click="chooseImport"><Upload :size="18" /> Import archive</button></template>
      </PageHeader>
      <input ref="fileInput" type="file" accept=".json,application/json" class="hidden" aria-label="Choose a prepared supervision archive" @change="previewImport" />
      <ErrorBanner :message="error" @dismiss="error = ''" />
      <p v-if="success" role="status" class="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"><Check :size="18" />{{ success }}</p>
      <div v-if="archives.length" class="card mb-5 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <label class="min-w-0 text-xs font-extrabold text-slate-500">Source backup<select v-model="selectedArchiveId" :disabled="loading" class="mt-2 block max-w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-brand-navy sm:max-w-md" @change="loadArchive"><option v-for="item in archives" :key="item.id" :value="item.id">{{ item.source.file_name }} · {{ item.source.exported_at_label }}</option></select></label>
        <p class="flex max-w-sm items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck :size="18" class="mt-0.5 shrink-0 text-brand-mint" /> Confidential historical records. Staff names are shown as recorded in the backup.</p>
      </div>
    </div>

    <LoadingState v-if="loading || archiveLoading" class="archive-controls" />
    <div v-else-if="loadFailed" class="card archive-controls p-6"><button type="button" class="rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white" @click="loadArchives()">Try again</button></div>
    <EmptyState v-else-if="!archives.length" class="archive-controls" title="No completed archives imported" message="Use Import archive to preview and add the prepared JSON file. Only completed supervision records will be accepted." :icon="Archive" />
    <template v-else-if="archive">
      <div class="archive-controls mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Historical staff" :value="counts.staff" note="With completed sessions" :icon="Users" tone="blue" />
        <StatCard label="Completed sessions" :value="counts.completed_sessions" note="As marked in the source" :icon="ClipboardCheck" tone="mint" />
        <StatCard label="Saved answers" :value="counts.answer_rows" note="All saved versions retained" :icon="FileJson" tone="orange" />
      </div>
      <div class="archive-layout grid items-start gap-5 xl:grid-cols-[17rem_minmax(0,1fr)]">
        <aside class="archive-controls card p-4">
          <label class="relative block"><span class="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">Find staff</span><Search :size="16" class="pointer-events-none absolute bottom-3 left-3 text-slate-400" /><input v-model="search" type="search" placeholder="Name or staff reference" class="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-blue" /></label>
          <div class="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <button v-for="person in filteredStaff" :key="person.legacy_staff_id" type="button" :aria-pressed="sameId(person.legacy_staff_id, selectedStaffId)" class="rounded-xl border p-3 text-left" :class="sameId(person.legacy_staff_id, selectedStaffId) ? 'border-brand-blue bg-brand-sky' : 'border-slate-100 bg-white hover:bg-slate-50'" @click="selectStaff(person)"><span class="block text-sm font-black text-brand-navy">{{ person.fullname }}</span><span class="mt-1 block text-xs text-slate-500">{{ person.staff_id || 'No staff reference' }}</span><span class="mt-2 block text-xs font-extrabold text-brand-blue">{{ person.session_ids.length }} completed sessions</span></button>
          </div>
          <p v-if="!filteredStaff.length" class="py-6 text-center text-sm text-slate-400">No matching staff.</p>
        </aside>

        <div class="min-w-0">
          <div class="archive-controls mb-4 flex items-center justify-between gap-3"><h2 class="text-lg font-black text-brand-navy">{{ selectedStaff?.fullname }}</h2><button type="button" :disabled="!session || sessionLoading" class="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-brand-blue disabled:opacity-40" @click="printSession"><Printer :size="16" /> Print session</button></div>
          <nav class="archive-controls mb-5 flex gap-2 overflow-x-auto pb-2" aria-label="Completed sessions">
            <button v-for="item in staffSessions" :key="item.legacy_session_id" type="button" :aria-pressed="sameId(item.legacy_session_id, selectedSessionId)" class="min-w-48 shrink-0 rounded-xl border px-4 py-3 text-left" :class="sameId(item.legacy_session_id, selectedSessionId) ? 'border-brand-blue bg-brand-sky' : 'border-slate-200 bg-white hover:bg-slate-50'" @click="selectSession(item)"><span class="flex items-center justify-between gap-3 text-sm font-black text-brand-navy">Session #{{ item.legacy_session_id }}<ChevronRight :size="15" /></span><span class="mt-1 block text-xs text-slate-500">Scheduled {{ formatDate(item.scheduled_date) }}</span><span class="mt-1 block text-[11px] text-slate-500">{{ item.answer_count }} answers · Saved {{ formatDate(item.answer_dates?.last_saved_at) }}</span><span v-if="item.duplicate_groups?.length" class="mt-1 block text-[10px] font-bold text-amber-700">Multiple responses retained</span></button>
          </nav>
          <ErrorBanner :message="sessionError" class="archive-controls" @dismiss="sessionError = ''" />
          <button v-if="sessionLoadFailed" type="button" class="archive-controls mb-4 rounded-xl bg-brand-blue px-4 py-2 text-sm font-bold text-white" @click="selectSession({ legacy_session_id: selectedSessionId })">Retry session</button>
          <LoadingState v-if="sessionLoading" class="archive-controls" />
          <article v-else-if="session" class="archive-session card p-5 sm:p-7" aria-label="Archived supervision record">
            <header class="archive-record-header"><p class="text-[11px] font-extrabold uppercase tracking-[.18em] text-brand-orange">Hope Pathway · Independent Living</p><h2 class="mt-2 text-xl font-black text-brand-navy">{{ selectedStaff?.fullname }} — Supervision #{{ session.legacy_session_id }}</h2><span class="mt-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">Completed in source backup</span></header>
            <dl class="archive-metadata my-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
              <div><dt class="text-xs font-bold text-slate-400">Staff reference</dt><dd class="mt-1 font-semibold text-brand-navy">{{ selectedStaff?.staff_id || 'Not recorded' }}</dd></div>
              <div><dt class="text-xs font-bold text-slate-400">Scheduled date</dt><dd class="mt-1 font-semibold text-brand-navy">{{ formatDate(session.scheduled_date) }}</dd></div>
              <div><dt class="text-xs font-bold text-slate-400">First answer saved</dt><dd class="mt-1 font-semibold text-brand-navy">{{ session.answer_dates?.first_saved_at || 'Not recorded' }}</dd></div>
              <div><dt class="text-xs font-bold text-slate-400">Last answer saved</dt><dd class="mt-1 font-semibold text-brand-navy">{{ session.answer_dates?.last_saved_at || 'Not recorded' }}</dd></div>
            </dl>
            <p class="archive-record-note rounded-xl bg-brand-sky p-4 text-xs leading-6 text-slate-600">The scheduled date is not a verified meeting or completion date. Questions and answers are reproduced from the backup. Supervisor identity, signatures and formal sign-off were not recorded. Source timestamps do not specify a timezone.</p>
            <p v-if="session.duplicate_groups?.length || session.question_snapshot_uncertain" class="archive-record-note mt-3 rounded-xl bg-amber-50 p-4 text-xs leading-6 text-amber-800"><span v-if="session.duplicate_groups?.length">Multiple responses were saved for some questions; all are shown for review. </span><span v-if="session.question_snapshot_uncertain">Some answers predate the saved question wording. The exact wording at submission time cannot be confirmed.</span></p>
            <section v-for="(group, questionIndex) in answerGroups" :key="group.id" class="archive-question mt-6 border-t border-slate-100 pt-5">
              <p class="text-[10px] font-extrabold uppercase tracking-wider text-brand-blue">Question {{ questionIndex + 1 }} · Source ID {{ group.id }}</p><h3 class="mt-2 whitespace-pre-wrap break-words text-sm font-extrabold leading-6 text-brand-navy">{{ group.question }}</h3>
              <div v-for="(answer, answerIndex) in group.answers" :key="answer.legacy_answer_id" class="archive-answer mt-3 rounded-xl border-l-4 border-sky-100 bg-slate-50 px-4 py-3">
                <p v-if="group.answers.length > 1" class="mb-2 text-xs font-extrabold text-amber-700">Saved response {{ answerIndex + 1 }} of {{ group.answers.length }}</p>
                <p class="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">{{ answer.text }}</p><p class="mt-3 text-[10px] leading-5 text-slate-400">Answer #{{ answer.legacy_answer_id }} · Saved {{ answer.created_at || 'date not recorded' }}</p>
              </div>
            </section>
            <footer class="mt-7 border-t border-slate-100 pt-4 text-[10px] leading-5 text-slate-400">Source: {{ archive.source.file_name }} · Exported {{ archive.source.exported_at_label }} · Historical staff record #{{ selectedStaff?.legacy_staff_id }} · Session #{{ session.legacy_session_id }}</footer>
          </article>
        </div>
      </div>
    </template>

    <Teleport to="body">
      <dialog ref="importDialog" class="supervision-import-dialog m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-2xl overflow-y-auto rounded-3xl border-0 bg-white p-5 text-brand-navy shadow-2xl sm:p-7" aria-labelledby="archive-import-title" @cancel.prevent="closeImport" @click="event => event.target === importDialog && closeImport()">
        <div class="flex items-start justify-between gap-4"><div><p class="text-xs font-extrabold uppercase tracking-widest text-brand-orange">Private supervision records</p><h2 id="archive-import-title" class="mt-1 text-xl font-black">Review archive import</h2></div><button type="button" :disabled="previewing || importing" aria-label="Close import preview" class="rounded-xl p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-40" @click="closeImport"><X :size="20" /></button></div>
        <p class="mt-3 break-all text-xs text-slate-500">{{ importFile?.name }}</p>
        <LoadingState v-if="previewing" class="mt-5" />
        <template v-if="preview">
          <div class="mt-5 rounded-2xl bg-brand-sky p-4"><p class="font-extrabold">{{ preview.source.file_name }}</p><p class="mt-1 text-xs text-slate-500">{{ preview.source.exported_at_label }}</p><p class="mt-3 text-sm font-bold">{{ preview.counts.staff }} staff · {{ preview.counts.completed_sessions }} completed sessions · {{ preview.counts.answer_rows }} saved answers</p></div>
          <h3 class="mb-2 mt-5 text-sm font-extrabold">Included staff</h3><ul class="max-h-48 space-y-2 overflow-y-auto"><li v-for="person in preview.staff" :key="person.legacy_staff_id" class="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm"><span class="font-bold">{{ person.fullname }}</span><span class="shrink-0 text-xs text-slate-500">{{ person.session_ids.length }} sessions</span></li></ul>
          <p class="mt-4 text-xs leading-6 text-slate-500">This adds a read-only historical archive in private storage. The backup's staff identities and question wording will be preserved together. Current staff and supervision records will not be overwritten.</p>
          <p v-if="preview.counts.duplicate_answer_groups || preview.counts.sessions_with_question_snapshot_uncertainty" class="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">Review flags: {{ preview.counts.duplicate_answer_groups || 0 }} duplicate-answer groups; {{ preview.counts.sessions_with_question_snapshot_uncertainty || 0 }} sessions with uncertain question wording. These records will be retained with the warnings shown.</p>
          <p v-if="preview.existing" class="mt-3 text-sm font-bold text-brand-blue">This archive is already imported. It will be opened without creating a duplicate.</p>
        </template>
        <p v-if="importError" role="alert" class="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{{ importError }}</p>
        <div class="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" :disabled="previewing || importing" class="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-40" @click="closeImport">Cancel</button><button v-if="preview" type="button" :disabled="importing" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50" @click="saveImport"><Upload :size="17" />{{ importing ? 'Importing…' : (preview.existing ? 'Open existing archive' : 'Import completed records') }}</button></div>
      </dialog>
    </Teleport>
  </div>
</template>

<style>
.supervision-import-dialog::backdrop { background: rgb(16 42 67 / 65%); backdrop-filter: blur(4px); }
@media print {
  @page { size: A4; margin: 16mm; }
  body.printing-supervision-archive { background: white !important; color: black; }
  body.printing-supervision-archive #app > div { display: block !important; min-height: 0 !important; }
  body.printing-supervision-archive #app > div > aside,
  body.printing-supervision-archive #app > div > .fixed,
  body.printing-supervision-archive #app > div > div > header,
  body.printing-supervision-archive .archive-controls { display: none !important; }
  body.printing-supervision-archive main { padding: 0 !important; max-width: none !important; }
  body.printing-supervision-archive .archive-layout { display: block; }
  body.printing-supervision-archive .archive-session { border: 0; border-radius: 0; box-shadow: none; padding: 0; background: white; }
  body.printing-supervision-archive .archive-metadata { grid-template-columns: 1fr 1fr; background: white; padding: 0; }
  body.printing-supervision-archive .archive-record-header,
  body.printing-supervision-archive .archive-record-note { break-inside: avoid; }
  body.printing-supervision-archive .archive-question h3 { break-after: avoid; }
  body.printing-supervision-archive .archive-answer { background: white; }
}
</style>
