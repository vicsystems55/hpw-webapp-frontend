<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import DayPilotVue from '@daypilot/daypilot-lite-vue'
import { ChevronLeft, ChevronRight, MapPin, Plus, Save, Trash2, X } from '@lucide/vue'
import api from '../services/api'
import PageHeader from '../components/ui/PageHeader.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const { DayPilot, DayPilotCalendar, DayPilotMonth } = DayPilotVue

const events = ref([])
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const modalOpen = ref(false)
const editingId = ref(null)
const activeView = ref('month')
const startDate = ref(DayPilot.Date.today())
const form = reactive({ title: '', start: '', end: '', allDay: false, calendar: 'General', location: '', description: '' })
const categories = ['General', 'Care', 'Appointment', 'Supervision', 'Training']
const colours = { General: '#087fc3', Care: '#22b8a7', Appointment: '#f55b00', Supervision: '#7c3aed', Training: '#d97706' }

const localDate = value => {
  const date = new Date(value)
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return adjusted.toISOString().slice(0, 16)
}
const dateOnly = value => String(value || '').slice(0, 10)
const dayPilotDate = (value, allDay) => value ? (allDay ? dateOnly(value) : localDate(value)) : null

const fallbackEnd = event => {
  if (event.end) return dayPilotDate(event.end, event.allDay)
  const date = new Date(event.allDay ? `${dateOnly(event.start)}T00:00:00` : event.start)
  if (event.allDay) date.setDate(date.getDate() + 1)
  else date.setHours(date.getHours() + 1)
  return event.allDay ? date.toISOString().slice(0, 10) : localDate(date)
}

const calendarEvents = computed(() => events.value.map(event => {
  const colour = colours[event.extendedProps?.calendar] || colours.General
  return {
    id: event.id,
    text: event.title,
    start: dayPilotDate(event.start, event.allDay),
    end: fallbackEnd(event),
    backColor: colour,
    borderColor: colour,
    fontColor: '#ffffff',
    tags: {
      allDay: event.allDay,
      calendar: event.extendedProps?.calendar || 'General',
      location: event.extendedProps?.location || '',
      description: event.extendedProps?.description || '',
    },
  }
}))

const activeEventDays = computed(() => new Set(events.value.map(event => dateOnly(event.start))))

function styleMonthCell(args) {
  const day = dateOnly(args.cell.start.toString())
  const today = dateOnly(DayPilot.Date.today().toString())
  const dayOfWeek = new Date(`${day}T00:00:00`).getDay()

  if (dayOfWeek === 0 || dayOfWeek === 6) args.cell.properties.backColor = '#fffaf3'
  if (activeEventDays.value.has(day)) {
    args.cell.properties.backColor = '#eaf7ff'
    args.cell.properties.cssClass = 'hpw-active-day'
  }
  if (day === today) {
    args.cell.properties.backColor = '#fff1e7'
    args.cell.properties.cssClass = 'hpw-today'
  }
}

function styleTimeCell(args) {
  const day = dateOnly(args.cell.start.toString())
  if (activeEventDays.value.has(day)) args.cell.properties.backColor = '#f1faff'
  if (day === dateOnly(DayPilot.Date.today().toString())) args.cell.properties.backColor = '#fff7ed'
}

function styleTimeHeader(args) {
  const day = dateOnly(args.header.start.toString())
  if (activeEventDays.value.has(day)) args.header.backColor = '#dff4ff'
  if (day === dateOnly(DayPilot.Date.today().toString())) args.header.backColor = '#ffe4cf'
}

const visibleTitle = computed(() => {
  const date = new Date(`${dateOnly(startDate.value.toString())}T00:00:00`)
  if (activeView.value === 'day') return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  if (activeView.value === 'week') return `Week of ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
})

async function loadEvents() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/calendar-events')
    events.value = data.data || data
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Calendar events could not be loaded.'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(form, { title: '', start: '', end: '', allDay: false, calendar: 'General', location: '', description: '' })
  editingId.value = null
}

function openCreate(selection = null) {
  resetForm()
  if (selection) Object.assign(form, selection)
  else form.start = localDate(new Date())
  modalOpen.value = true
}

function selectRange(args, allDay) {
  args.control.clearSelection()
  openCreate({
    allDay,
    start: allDay ? dateOnly(args.start.toString()) : localDate(args.start.toString()),
    end: allDay ? dateOnly(args.end.toString()) : localDate(args.end.toString()),
  })
}

function openEvent(args) {
  const selected = events.value.find(event => String(event.id) === String(args.e.id()))
  if (!selected) return
  editingId.value = selected.id
  Object.assign(form, {
    title: selected.title,
    start: selected.allDay ? dateOnly(selected.start) : localDate(selected.start),
    end: selected.end ? (selected.allDay ? dateOnly(selected.end) : localDate(selected.end)) : '',
    allDay: selected.allDay,
    calendar: selected.extendedProps?.calendar || 'General',
    location: selected.extendedProps?.location || '',
    description: selected.extendedProps?.description || '',
  })
  modalOpen.value = true
}

const payload = computed(() => ({
  title: form.title,
  start: form.allDay ? form.start : new Date(form.start).toISOString(),
  end: form.end ? (form.allDay ? form.end : new Date(form.end).toISOString()) : null,
  allDay: form.allDay,
  calendar: form.calendar,
  location: form.location || null,
  description: form.description || null,
}))

async function saveEvent() {
  saving.value = true
  error.value = ''
  try {
    if (editingId.value) await api.put(`/calendar-events/${editingId.value}`, payload.value)
    else await api.post('/calendar-events', payload.value)
    modalOpen.value = false
    await loadEvents()
  } catch (requestError) {
    const errors = requestError.response?.data?.errors
    error.value = errors ? Object.values(errors).flat()[0] : (requestError.response?.data?.message || 'The event could not be saved.')
  } finally {
    saving.value = false
  }
}

async function deleteEvent() {
  if (!editingId.value || !window.confirm('Delete this calendar event?')) return
  saving.value = true
  try {
    await api.delete(`/calendar-events/${editingId.value}`)
    modalOpen.value = false
    await loadEvents()
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'The event could not be deleted.'
  } finally {
    saving.value = false
  }
}

async function moveEvent(args) {
  const data = args.e.data
  const allDay = Boolean(data.tags?.allDay)
  try {
    await api.put(`/calendar-events/${data.id}`, {
      title: data.text,
      start: allDay ? dateOnly(args.newStart.toString()) : new Date(args.newStart.toString()).toISOString(),
      end: allDay ? dateOnly(args.newEnd.toString()) : new Date(args.newEnd.toString()).toISOString(),
      allDay,
      calendar: data.tags?.calendar || 'General',
      location: data.tags?.location || null,
      description: data.tags?.description || null,
    })
    await loadEvents()
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'The event change could not be saved.'
    await loadEvents()
  }
}

function navigate(amount) {
  const date = new Date(`${dateOnly(startDate.value.toString())}T00:00:00`)
  if (activeView.value === 'month') date.setMonth(date.getMonth() + amount, 1)
  else date.setDate(date.getDate() + amount * (activeView.value === 'week' ? 7 : 1))
  startDate.value = new DayPilot.Date(date.toISOString().slice(0, 10))
}

function goToday() {
  startDate.value = DayPilot.Date.today()
}

onMounted(loadEvents)
</script>

<template>
  <div>
    <PageHeader title="Calendar" description="Coordinate appointments, supervision, learning and important care dates.">
      <template #actions><button class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white" @click="openCreate()"><Plus :size="18" /> Add event</button></template>
    </PageHeader>
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <LoadingState v-if="loading" />
    <section v-else class="calendar-shell card overflow-hidden p-3 sm:p-5">
      <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center gap-2">
          <button class="calendar-nav" aria-label="Previous" @click="navigate(-1)"><ChevronLeft :size="18" /></button>
          <button class="calendar-today" @click="goToday">Today</button>
          <button class="calendar-nav" aria-label="Next" @click="navigate(1)"><ChevronRight :size="18" /></button>
        </div>
        <h2 class="text-lg font-black text-brand-navy">{{ visibleTitle }}</h2>
        <div class="grid grid-cols-3 rounded-xl bg-slate-100 p-1">
          <button v-for="item in ['month', 'week', 'day']" :key="item" class="rounded-lg px-3 py-2 text-xs font-extrabold capitalize" :class="activeView === item ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500'" @click="activeView = item">{{ item }}</button>
        </div>
      </div>

      <DayPilotMonth v-if="activeView === 'month'" :start-date="startDate" :events="calendarEvents" :week-starts="1" :event-height="28" :cell-height="110" :on-before-cell-render="styleMonthCell" event-click-handling="Enabled" time-range-selected-handling="Enabled" @event-click="openEvent" @time-range-selected="args => selectRange(args, true)" @event-moved="moveEvent" @event-resized="moveEvent" />
      <DayPilotCalendar v-else :view-type="activeView === 'week' ? 'Week' : 'Day'" :start-date="startDate" :events="calendarEvents" :week-starts="1" :business-begins-hour="7" :business-ends-hour="21" :day-begins-hour="6" :day-ends-hour="22" :cell-duration="30" :on-before-cell-render="styleTimeCell" :on-before-header-render="styleTimeHeader" height-spec="BusinessHoursNoScroll" event-click-handling="Enabled" time-range-selected-handling="Enabled" @event-click="openEvent" @time-range-selected="args => selectRange(args, false)" @event-moved="moveEvent" @event-resized="moveEvent" />
    </section>
    <div class="mt-4 flex flex-wrap gap-3"><span v-for="category in categories" :key="category" class="inline-flex items-center gap-2 text-xs font-bold text-slate-500"><span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: colours[category] }" />{{ category }}</span></div>

    <div v-if="modalOpen" class="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-brand-navy/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <section class="my-6 w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div class="flex items-start justify-between gap-4"><div><p class="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-orange">Team calendar</p><h2 class="mt-1 text-xl font-black text-brand-navy">{{ editingId ? 'Event details' : 'Create event' }}</h2></div><button class="rounded-xl p-2 text-slate-400 hover:bg-slate-100" aria-label="Close" @click="modalOpen = false"><X :size="20" /></button></div>
        <form class="mt-6 grid gap-4 sm:grid-cols-2" @submit.prevent="saveEvent">
          <label class="block sm:col-span-2"><span class="mb-2 block text-sm font-extrabold text-brand-navy">Event title</span><input v-model="form.title" required class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" placeholder="e.g. Monthly supervision" /></label>
          <label class="block"><span class="mb-2 block text-sm font-extrabold text-brand-navy">Starts</span><input v-model="form.start" :type="form.allDay ? 'date' : 'datetime-local'" required class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" /></label>
          <label class="block"><span class="mb-2 block text-sm font-extrabold text-brand-navy">Ends</span><input v-model="form.end" :type="form.allDay ? 'date' : 'datetime-local'" class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" /></label>
          <label class="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-brand-navy"><input v-model="form.allDay" type="checkbox" class="h-4 w-4 accent-brand-blue" /> All-day event</label>
          <label class="block"><span class="mb-2 block text-sm font-extrabold text-brand-navy">Category</span><select v-model="form.calendar" class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue"><option v-for="category in categories" :key="category">{{ category }}</option></select></label>
          <label class="block sm:col-span-2"><span class="mb-2 flex items-center gap-2 text-sm font-extrabold text-brand-navy"><MapPin :size="16" /> Location</span><input v-model="form.location" class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" /></label>
          <label class="block sm:col-span-2"><span class="mb-2 block text-sm font-extrabold text-brand-navy">Description</span><textarea v-model="form.description" rows="3" class="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" /></label>
          <div class="flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-5 sm:col-span-2"><button v-if="editingId" type="button" :disabled="saving" class="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-extrabold text-red-700" @click="deleteEvent"><Trash2 :size="17" /> Delete</button><span v-else /><button type="submit" :disabled="saving" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-50"><Save :size="17" /> {{ saving ? 'Saving…' : 'Save event' }}</button></div>
        </form>
      </section>
    </div>
  </div>
</template>

<style>
.calendar-shell { min-height: 520px; }
.calendar-nav, .calendar-today { display: inline-flex; min-height: 2.5rem; align-items: center; justify-content: center; border: 1px solid #dbe5ef; border-radius: .7rem; background: #fff; color: #102a43; font-size: .78rem; font-weight: 800; }
.calendar-nav { width: 2.5rem; }
.calendar-today { padding: 0 .9rem; }
.calendar-shell [class*="month_default_main"], .calendar-shell [class*="calendar_default_main"] { border-color: #e2e8f0 !important; font-family: inherit !important; }
.calendar-shell .hpw-active-day [class*="cell_header"] { color: #087fc3 !important; font-weight: 900 !important; }
.calendar-shell .hpw-today { box-shadow: inset 0 0 0 2px #f55b00; }
.calendar-shell .hpw-today [class*="cell_header"] { color: #f55b00 !important; font-weight: 900 !important; }
@media (max-width: 639px) { .calendar-shell { min-height: 430px; padding: .75rem; } .calendar-shell [class*="month_default_event_inner"] { font-size: 11px !important; } }
</style>
