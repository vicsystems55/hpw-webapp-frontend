<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { CalendarClock, ClipboardCheck, RefreshCw, X } from '@lucide/vue'
import api from '../../services/api'
import LoadingState from '../ui/LoadingState.vue'
import EmptyState from '../ui/EmptyState.vue'
import StatusBadge from '../ui/StatusBadge.vue'

const props = defineProps({
  schedule: { type: Object, default: null },
  staffName: { type: String, default: '' },
  staffId: { type: [String, Number], required: true },
})
const emit = defineEmits(['close'])
const dialog = ref(null)
const answers = ref([])
const loading = ref(false)
const error = ref('')
let request = 0
let disposed = false
let returnFocus = null

const groups = computed(() => {
  const grouped = new Map()
  for (const answer of answers.value) {
    const id = String(answer.supervision_question_id)
    if (!grouped.has(id)) grouped.set(id, { id, answers: [] })
    grouped.get(id).answers.push(answer)
  }
  return [...grouped.values()]
})
const formatDate = value => {
  if (!value) return 'Not recorded'
  const raw = String(value)
  if (!/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw
  const date = new Date(`${raw.slice(0, 10)}T12:00:00Z`)
  return Number.isNaN(date.getTime()) ? raw : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

function restoreFocus() {
  const target = returnFocus
  returnFocus = null
  nextTick(() => { if (target?.isConnected) target.focus() })
}

function close() {
  ++request
  answers.value = []
  loading.value = false
  error.value = ''
  dialog.value?.close()
  restoreFocus()
  emit('close')
}

async function loadAnswers(id, current = ++request) {
  loading.value = true
  error.value = ''
  answers.value = []
  try {
    const { data } = await api.get(`/staff-supervision/${id}`)
    if (disposed || current !== request) return
    const schedule = data.scheduleData
    if (!schedule || String(schedule.id) !== String(id)
      || (schedule.staff_record_id != null && String(schedule.staff_record_id) !== String(props.staffId))) {
      throw new Error('These responses could not be matched to this staff supervision session.')
    }
    answers.value = Array.isArray(data.supervisionAnswers) ? data.supervisionAnswers : []
  } catch (requestError) {
    if (disposed || current !== request) return
    error.value = requestError.response?.status === 404
      ? 'This supervision session could not be found.'
      : (requestError.response?.data?.message || requestError.message || 'The supervision answers could not be loaded.')
  } finally {
    if (!disposed && current === request) loading.value = false
  }
}

watch(() => [props.schedule?.id, props.staffId], async ([id]) => {
  const current = ++request
  answers.value = []
  error.value = ''
  loading.value = false
  if (id == null) {
    dialog.value?.close()
    restoreFocus()
    return
  }
  if (!dialog.value?.open && !returnFocus) returnFocus = document.activeElement
  await nextTick()
  if (disposed || current !== request) return
  if (!dialog.value?.open) dialog.value?.showModal()
  await loadAnswers(id, current)
}, { immediate: true, flush: 'post' })

onBeforeUnmount(() => {
  disposed = true
  ++request
  dialog.value?.close()
  restoreFocus()
})
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="supervision-answers-dialog m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-3xl overflow-y-auto rounded-3xl bg-white p-5 text-brand-navy shadow-2xl sm:p-7" aria-labelledby="supervision-answers-title" @cancel.prevent="close" @click="event => event.target === dialog && close()">
      <header class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-extrabold uppercase tracking-widest text-brand-orange">Staff supervision</p>
          <h2 id="supervision-answers-title" class="mt-1 text-xl font-black">{{ staffName }} — saved answers</h2>
          <p class="mt-2 flex items-center gap-2 text-sm text-slate-500"><CalendarClock :size="16" /> Scheduled date: {{ formatDate(schedule?.next_supervision_date) }}</p>
        </div>
        <button type="button" autofocus aria-label="Close supervision answers" class="shrink-0 rounded-xl p-2 text-slate-400 hover:bg-slate-100" @click="close"><X :size="21" /></button>
      </header>
      <div class="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500"><StatusBadge :status="schedule?.status" /><span>Session #{{ schedule?.id }}</span><span v-if="!loading && !error">{{ answers.length }} saved answers</span></div>
      <LoadingState v-if="loading" class="mt-5" />
      <div v-else-if="error" class="mt-5 rounded-2xl bg-red-50 p-4">
        <p role="alert" class="text-sm font-semibold text-red-700">{{ error }}</p>
        <button type="button" class="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-extrabold text-brand-blue" @click="loadAnswers(schedule.id)"><RefreshCw :size="16" /> Try again</button>
      </div>
      <EmptyState v-else-if="!answers.length" class="mt-5" title="No answers saved for this session" message="No responses have been saved for this session. Completed records imported from a backup are available separately in Supervision archive." :icon="ClipboardCheck" />
      <div v-else class="mt-5">
        <p class="rounded-xl bg-brand-sky p-4 text-xs leading-6 text-slate-600">This is a read-only view of saved responses. Question wording comes from the current question bank and may have changed since submission. The scheduled date is not a verified completion date.</p>
        <section v-for="(group, index) in groups" :key="group.id" class="mt-6 border-t border-slate-100 pt-5">
          <p class="text-[10px] font-extrabold uppercase tracking-wider text-brand-blue">Question {{ index + 1 }} · Source ID {{ group.id }}</p>
          <div v-for="(answer, answerIndex) in group.answers" :key="answer.id" class="mt-3">
            <h3 class="whitespace-pre-wrap break-words text-sm font-extrabold leading-6 text-brand-navy">{{ answer.questions?.question || 'Original question wording unavailable' }}</h3>
            <div class="mt-2 rounded-xl border-l-4 border-sky-100 bg-slate-50 px-4 py-3">
              <p v-if="group.answers.length > 1" class="mb-2 text-xs font-extrabold text-amber-700">Saved response {{ answerIndex + 1 }} of {{ group.answers.length }}</p>
              <p class="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">{{ answer.answer == null || answer.answer === '' ? 'No response text recorded.' : answer.answer }}</p>
              <p class="mt-3 text-[10px] leading-5 text-slate-400">Answer #{{ answer.id }} · Saved {{ answer.created_at || 'date not recorded' }}</p>
            </div>
          </div>
        </section>
      </div>
      <footer class="mt-6 flex justify-end border-t border-slate-100 pt-4"><button type="button" class="rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white" @click="close">Close answers</button></footer>
    </dialog>
  </Teleport>
</template>

<style>
.supervision-answers-dialog { border: 0; }
.supervision-answers-dialog::backdrop { background: rgb(16 42 67 / 65%); backdrop-filter: blur(4px); }
</style>
