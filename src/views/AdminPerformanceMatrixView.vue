<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { BookOpenCheck, ChartNoAxesCombined, Check, RotateCcw, Save, Search, Sparkles, Users, X } from '@lucide/vue'
import api from '../services/api'
import PageHeader from '../components/ui/PageHeader.vue'
import StatCard from '../components/ui/StatCard.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const courses = ref([])
const staff = ref([])
const loading = ref(true)
const error = ref('')
const success = ref('')
const search = ref('')
const selectedCourse = ref('all')
const editing = ref(null)
const selectedLevel = ref('unassessed')
const saving = ref(false)
const modalError = ref('')
const dialog = ref(null)
let returnFocus = null

const levels = [
  { value: 'beginner', label: 'Beginner', description: 'Developing knowledge; support and practice needed.' },
  { value: 'average', label: 'Average', description: 'Working knowledge; performs with some guidance.' },
  { value: 'advanced', label: 'Advanced', description: 'Strong knowledge; performs confidently and independently.' },
  { value: 'unassessed', label: 'Not assessed', description: 'No expertise level has been confirmed yet.' },
]

const levelStyles = {
  beginner: 'border-rose-200 bg-rose-50 text-rose-700',
  average: 'border-amber-200 bg-amber-50 text-amber-700',
  advanced: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  unassessed: 'border-slate-200 bg-slate-50 text-slate-500',
}

// Assign before filtering so the column, course selector and key always agree.
const codedCourses = computed(() => courses.value.map((course, index) => ({
  ...course,
  code: course.code || String(index + 1).padStart(2, '0'),
})))
const visibleCourses = computed(() => selectedCourse.value === 'all'
  ? codedCourses.value
  : codedCourses.value.filter(course => String(course.id) === selectedCourse.value))

const filteredStaff = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return staff.value
  return staff.value.filter(person => [person.fullname, person.email, person.staff_id]
    .some(value => String(value || '').toLowerCase().includes(term)))
})

const ratedCells = computed(() => staff.value.reduce((total, person) => total
  + Object.values(person.results || {}).filter(result => result.expertise !== 'unassessed').length, 0))
const advancedCells = computed(() => staff.value.reduce((total, person) => total
  + Object.values(person.results || {}).filter(result => result.expertise === 'advanced').length, 0))
const coverage = computed(() => {
  const possible = staff.value.length * courses.value.length
  return possible ? Math.round((ratedCells.value / possible) * 100) : 0
})
const currentResult = computed(() => editing.value
  ? resultFor(editing.value.person, editing.value.course.id)
  : null)
const assessmentPercentage = computed(() => {
  const result = currentResult.value
  return result?.source === 'manual' ? result.assessment_percentage : result?.percentage
})

function resultFor(person, courseId) {
  return person.results?.[String(courseId)] || null
}

function levelLabel(level) {
  return levels.find(item => item.value === level)?.label || 'Not assessed'
}

function cellTitle(person, course) {
  const result = resultFor(person, course.id)
  const score = result?.percentage != null ? `, ${result.percentage}%` : ''
  return `${person.fullname}, ${course.code}: ${course.title}. ${levelLabel(result?.expertise)}${score}. Click to edit expertise.`
}

async function loadMatrix() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/performance-matrix')
    courses.value = data.data?.courses || []
    staff.value = data.data?.staff || []
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'The performance matrix could not be loaded.'
  } finally {
    loading.value = false
  }
}

async function openEditor(person, course, event) {
  returnFocus = event.currentTarget
  editing.value = { person, course }
  selectedLevel.value = resultFor(person, course.id)?.expertise || 'unassessed'
  modalError.value = ''
  success.value = ''
  await nextTick()
  dialog.value?.showModal()
  dialog.value?.querySelector('input:checked')?.focus()
}

function closeEditor() {
  if (saving.value) return
  dialog.value?.close()
  editing.value = null
  modalError.value = ''
  nextTick(() => returnFocus?.isConnected && returnFocus.focus())
}

async function saveExpertise(reset = false) {
  if (!editing.value || saving.value) return
  const { person, course } = editing.value
  saving.value = true
  modalError.value = ''
  try {
    const endpoint = `/performance-matrix/staff/${person.id}/courses/${course.id}`
    const { data } = reset
      ? await api.delete(endpoint)
      : await api.put(endpoint, { expertise: selectedLevel.value })
    // An empty object also converts older array-shaped empty results to a map.
    person.results = { ...(person.results || {}) }
    if (data.data.result) person.results[String(course.id)] = data.data.result
    else delete person.results[String(course.id)]
    success.value = `${person.fullname} · ${course.code}: ${reset ? 'Quiz-based result restored.' : `${levelLabel(selectedLevel.value)} saved.`}`
    saving.value = false
    closeEditor()
  } catch (requestError) {
    const errors = requestError.response?.data?.errors
    modalError.value = errors ? Object.values(errors).flat()[0]
      : (requestError.response?.data?.message || 'The expertise level could not be saved. Please try again.')
  } finally {
    saving.value = false
  }
}

onMounted(loadMatrix)
onBeforeUnmount(() => dialog.value?.close())
</script>

<template>
  <div>
    <PageHeader title="Performance matrix" description="Compare staff expertise across learning courses. Select any cell to update a staff member’s expertise." />
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <p v-if="success" role="status" class="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"><Check :size="18" />{{ success }}</p>

    <div class="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Staff members" :value="staff.length" note="Included in the matrix" :icon="Users" tone="blue" />
      <StatCard label="Courses" :value="courses.length" note="Learning areas tracked" :icon="BookOpenCheck" tone="mint" />
      <StatCard label="Expertise coverage" :value="`${coverage}%`" note="Staff-course pairs with a rating" :icon="ChartNoAxesCombined" tone="orange" />
      <StatCard label="Advanced ratings" :value="advancedCells" note="From admin ratings or quiz results" :icon="Sparkles" tone="yellow" />
    </div>

    <LoadingState v-if="loading" />
    <div v-else-if="error" class="card p-6"><button type="button" class="rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white" @click="loadMatrix">Try again</button></div>
    <EmptyState v-else-if="!staff.length || !courses.length" title="Matrix data is not ready" message="Add staff and courses to start recording expertise." :icon="ChartNoAxesCombined" />

    <template v-else>
      <section class="card overflow-hidden" aria-label="Staff expertise matrix">
        <div class="flex flex-col gap-4 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div class="relative w-full max-w-sm">
            <Search :size="18" class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input v-model="search" aria-label="Search staff" class="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-blue" placeholder="Search staff name, email or ID" />
          </div>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select v-model="selectedCourse" aria-label="Filter courses" class="max-w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-navy outline-none focus:border-brand-blue sm:max-w-64">
              <option value="all">All courses</option>
              <option v-for="course in codedCourses" :key="course.id" :value="String(course.id)">{{ course.code }} · {{ course.title }}</option>
            </select>
            <div class="flex flex-wrap gap-2 text-xs font-bold" aria-label="Expertise colour legend">
              <span v-for="level in levels" :key="level.value" class="rounded-full border px-2.5 py-1" :class="levelStyles[level.value]">{{ level.label }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 text-xs font-semibold text-slate-500">
          <span>{{ filteredStaff.length }} of {{ staff.length }} staff · {{ visibleCourses.length }} courses</span>
          <a href="#course-key" class="font-extrabold text-brand-blue hover:underline">View course code key ↓</a>
        </div>

        <div class="matrix-scroll overflow-auto" tabindex="0" role="region" aria-label="Scrollable performance matrix">
          <table class="min-w-full border-separate border-spacing-0 text-left">
            <caption class="sr-only">Staff expertise by course code. Select a cell to edit its expertise. Course names appear in the course code key below.</caption>
            <thead>
              <tr>
                <th scope="col" class="matrix-staff sticky left-0 top-0 z-30 border-b border-r border-slate-200 bg-slate-50 px-4 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Staff member</th>
                <th v-for="course in visibleCourses" :key="course.id" scope="col" :title="course.title" class="sticky top-0 z-20 min-w-24 border-b border-r border-slate-200 bg-slate-50 px-2 py-4 text-center">
                  <span class="text-sm font-black tracking-wider text-brand-navy" :aria-label="`${course.code}: ${course.title}`">{{ course.code }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="person in filteredStaff" :key="person.id" class="group">
                <th scope="row" class="matrix-staff sticky left-0 z-10 border-b border-r border-slate-100 bg-white px-4 py-4 font-normal group-hover:bg-slate-50">
                  <RouterLink :to="`/staff/${person.id}`" class="text-sm font-black text-brand-navy hover:text-brand-blue">{{ person.fullname }}</RouterLink>
                  <p class="mt-1 text-xs font-semibold text-slate-400">{{ person.staff_id || 'No staff ID' }}<span v-if="!person.has_login"> · No portal login</span></p>
                </th>
                <td v-for="course in visibleCourses" :key="course.id" class="border-b border-r border-slate-100 p-1.5 text-center">
                  <button type="button" :title="cellTitle(person, course)" :aria-label="cellTitle(person, course)" class="flex min-h-16 w-full flex-col items-center justify-center rounded-xl border px-2 py-2 transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2" :class="levelStyles[resultFor(person, course.id)?.expertise || 'unassessed']" @click="openEditor(person, course, $event)">
                    <span class="whitespace-nowrap text-[11px] font-black">{{ levelLabel(resultFor(person, course.id)?.expertise) }}</span>
                    <span v-if="resultFor(person, course.id)?.source === 'manual'" class="mt-1 text-[10px] font-semibold opacity-75">Admin rated</span>
                    <span v-else-if="resultFor(person, course.id)?.percentage != null" class="mt-1 text-sm font-black">{{ resultFor(person, course.id).percentage }}%</span>
                    <span v-else aria-hidden="true" class="mt-1 text-sm">—</span>
                  </button>
                </td>
              </tr>
              <tr v-if="!filteredStaff.length"><td :colspan="visibleCourses.length + 1" class="px-5 py-12 text-center text-sm font-semibold text-slate-400">No staff match your search.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="course-key" class="card mt-6 scroll-mt-6 p-5 sm:p-6" aria-labelledby="course-key-title">
        <h2 id="course-key-title" class="text-lg font-black text-brand-navy">Course code key</h2>
        <p class="mt-1 text-sm text-slate-500">Match the numbers in the matrix to the courses below.</p>
        <dl class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div v-for="course in codedCourses" :key="course.id" class="flex items-start gap-3 rounded-xl border p-3" :class="selectedCourse === String(course.id) ? 'border-sky-200 bg-brand-sky/40' : 'border-slate-100 bg-slate-50/60'">
            <dt class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-sm font-black text-brand-blue shadow-sm">{{ course.code }}</dt>
            <dd class="min-w-0 pt-1.5 text-sm font-bold leading-5 text-brand-navy">{{ course.title }}</dd>
          </div>
        </dl>
        <p class="mt-5 text-xs leading-5 text-slate-500">Admin ratings take priority. Where no admin rating is saved, the best quiz score supplies the level: Beginner below 50%, Average 50–79%, Advanced 80% or above.</p>
      </section>
    </template>

    <Teleport to="body">
      <dialog ref="dialog" class="expertise-dialog m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-3xl bg-white p-0 text-brand-navy shadow-2xl" aria-labelledby="expertise-title" aria-describedby="expertise-description" @cancel.prevent="closeEditor" @click="event => event.target === dialog && closeEditor()">
        <section v-if="editing" class="p-5 sm:p-7">
          <div class="flex items-start justify-between gap-4">
            <div><p class="text-xs font-extrabold uppercase tracking-widest text-brand-orange">Course {{ editing.course.code }}</p><h2 id="expertise-title" class="mt-1 text-xl font-black">Update expertise</h2></div>
            <button type="button" aria-label="Close expertise editor" :disabled="saving" class="rounded-xl p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-40" @click="closeEditor"><X :size="20" /></button>
          </div>
          <div id="expertise-description" class="mt-4 rounded-xl bg-slate-50 p-4"><p class="font-black">{{ editing.person.fullname }}</p><p class="mt-1 text-sm text-slate-600">{{ editing.course.title }}</p></div>
          <p class="mt-3 text-xs leading-5 text-slate-500">
            Current level: <strong>{{ levelLabel(currentResult?.expertise) }}</strong>.
            <template v-if="currentResult?.source === 'manual'">Admin rated<span v-if="currentResult.rated_by_name"> by {{ currentResult.rated_by_name }}</span>.</template>
            <template v-if="assessmentPercentage != null"> Best quiz score: {{ assessmentPercentage }}%.</template>
          </p>
          <form class="mt-5" @submit.prevent="saveExpertise(false)">
            <fieldset :disabled="saving">
              <legend class="mb-3 text-sm font-extrabold">Select expertise level</legend>
              <div class="grid gap-3 sm:grid-cols-2">
                <label v-for="level in levels" :key="level.value" class="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition focus-within:ring-2 focus-within:ring-brand-blue" :class="selectedLevel === level.value ? [levelStyles[level.value], 'ring-1 ring-current'] : 'border-slate-200 bg-white'">
                  <input v-model="selectedLevel" type="radio" name="expertise" :value="level.value" class="mt-0.5 h-4 w-4 shrink-0 accent-brand-blue" />
                  <span><span class="block text-sm font-black">{{ level.label }}</span><span class="mt-1 block text-xs leading-5 opacity-80">{{ level.description }}</span></span>
                </label>
              </div>
            </fieldset>
            <p v-if="modalError" role="alert" class="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{{ modalError }}</p>
            <button v-if="currentResult?.source === 'manual'" type="button" :disabled="saving" class="mt-4 inline-flex items-center gap-2 text-xs font-bold text-brand-blue hover:underline disabled:opacity-50" @click="saveExpertise(true)"><RotateCcw :size="14" /> Use quiz result instead</button>
            <div class="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button type="button" :disabled="saving" class="rounded-xl px-4 py-2.5 text-sm font-extrabold text-slate-500 hover:bg-slate-100 disabled:opacity-50" @click="closeEditor">Cancel</button>
              <button type="submit" :disabled="saving" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50"><Save :size="17" />{{ saving ? 'Saving…' : 'Save expertise' }}</button>
            </div>
          </form>
        </section>
      </dialog>
    </Teleport>
  </div>
</template>

<style scoped>
.matrix-scroll { height: clamp(36rem, 75vh, 64rem); }
.matrix-staff { min-width: 15rem; max-width: 17rem; }
.expertise-dialog { border: 0; }
.expertise-dialog::backdrop { background: rgb(16 42 67 / 65%); backdrop-filter: blur(4px); }
@media (max-width: 767px) {
  .matrix-scroll { height: max(28rem, 65vh); }
  .matrix-staff { min-width: 11rem; max-width: 12rem; }
}
</style>
