<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { CalendarDays, MapPin, Plus, Save, Trash2, X } from '@lucide/vue'
import api from '../services/api'
import PageHeader from '../components/ui/PageHeader.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const events = ref([])
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const modalOpen = ref(false)
const editingId = ref(null)
const form = reactive({ title: '', start: '', end: '', allDay: false, calendar: 'General', location: '', description: '' })
const categories = ['General', 'Care', 'Appointment', 'Supervision', 'Training']
const colours = { General: '#087fc3', Care: '#22b8a7', Appointment: '#f55b00', Supervision: '#7c3aed', Training: '#d97706' }

const toInput = value => {
  if (!value) return ''
  const date = new Date(value)
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

const decorate = event => ({
  ...event,
  backgroundColor: colours[event.extendedProps?.calendar] || colours.General,
  borderColor: colours[event.extendedProps?.calendar] || colours.General,
})

async function loadEvents() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/calendar-events')
    events.value = (data.data || data).map(decorate)
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

function openCreate(dateInfo = null) {
  resetForm()
  if (dateInfo) {
    form.allDay = dateInfo.allDay
    form.start = dateInfo.allDay ? dateInfo.dateStr : toInput(dateInfo.date)
  } else {
    form.start = toInput(new Date())
  }
  modalOpen.value = true
}

function openEvent(info) {
  const event = info.event
  editingId.value = event.id
  Object.assign(form, {
    title: event.title,
    start: event.allDay ? event.startStr.slice(0, 10) : toInput(event.start),
    end: event.end ? (event.allDay ? event.endStr.slice(0, 10) : toInput(event.end)) : '',
    allDay: event.allDay,
    calendar: event.extendedProps.calendar || 'General',
    location: event.extendedProps.location || '',
    description: event.extendedProps.description || '',
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

async function moveEvent(info) {
  const event = info.event
  try {
    await api.put(`/calendar-events/${event.id}`, {
      title: event.title,
      start: event.start?.toISOString(),
      end: event.end?.toISOString() || null,
      allDay: event.allDay,
      calendar: event.extendedProps.calendar || 'General',
      location: event.extendedProps.location || null,
      description: event.extendedProps.description || null,
    })
    await loadEvents()
  } catch (requestError) {
    info.revert()
    error.value = requestError.response?.data?.message || 'The event could not be moved.'
  }
}

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: window.innerWidth < 640 ? 'listMonth' : 'dayGridMonth',
  headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,listMonth' },
  buttonText: { today: 'Today', month: 'Month', week: 'Week', list: 'Agenda' },
  events: events.value,
  selectable: true,
  editable: true,
  dayMaxEvents: true,
  nowIndicator: true,
  height: 'auto',
  dateClick: openCreate,
  eventClick: openEvent,
  eventDrop: moveEvent,
  eventResize: moveEvent,
}))

onMounted(loadEvents)
</script>

<template>
  <div>
    <PageHeader title="Calendar" description="Coordinate appointments, supervision, learning and important care dates."><template #actions><button class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white" @click="openCreate()"><Plus :size="18" /> Add event</button></template></PageHeader>
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <LoadingState v-if="loading" />
    <section v-else class="calendar-shell card overflow-hidden p-3 sm:p-5"><FullCalendar :options="calendarOptions" /></section>
    <div class="mt-4 flex flex-wrap gap-3"><span v-for="category in categories" :key="category" class="inline-flex items-center gap-2 text-xs font-bold text-slate-500"><span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: colours[category] }" />{{ category }}</span></div>

    <div v-if="modalOpen" class="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-brand-navy/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <section class="my-6 w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-orange">Team calendar</p><h2 class="mt-1 text-xl font-black text-brand-navy">{{ editingId ? 'Event details' : 'Create event' }}</h2></div><button class="rounded-xl p-2 text-slate-400 hover:bg-slate-100" aria-label="Close" @click="modalOpen = false"><X :size="20" /></button></div>
        <form class="mt-6 grid gap-4 sm:grid-cols-2" @submit.prevent="saveEvent"><label class="block sm:col-span-2"><span class="mb-2 block text-sm font-extrabold text-brand-navy">Event title</span><input v-model="form.title" required class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" placeholder="e.g. Monthly supervision" /></label><label class="block"><span class="mb-2 block text-sm font-extrabold text-brand-navy">Starts</span><input v-model="form.start" :type="form.allDay ? 'date' : 'datetime-local'" required class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" /></label><label class="block"><span class="mb-2 block text-sm font-extrabold text-brand-navy">Ends</span><input v-model="form.end" :type="form.allDay ? 'date' : 'datetime-local'" class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" /></label><label class="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-brand-navy"><input v-model="form.allDay" type="checkbox" class="h-4 w-4 accent-brand-blue" /> All-day event</label><label class="block"><span class="mb-2 block text-sm font-extrabold text-brand-navy">Category</span><select v-model="form.calendar" class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue"><option v-for="category in categories" :key="category">{{ category }}</option></select></label><label class="block sm:col-span-2"><span class="mb-2 flex items-center gap-2 text-sm font-extrabold text-brand-navy"><MapPin :size="16" /> Location</span><input v-model="form.location" class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" /></label><label class="block sm:col-span-2"><span class="mb-2 block text-sm font-extrabold text-brand-navy">Description</span><textarea v-model="form.description" rows="3" class="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" /></label><div class="flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-5 sm:col-span-2"><button v-if="editingId" type="button" :disabled="saving" class="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-extrabold text-red-700" @click="deleteEvent"><Trash2 :size="17" /> Delete</button><span v-else /><button type="submit" :disabled="saving" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-50"><Save :size="17" /> {{ saving ? 'Saving…' : 'Save event' }}</button></div></form>
      </section>
    </div>
  </div>
</template>

<style>
.calendar-shell { --fc-border-color: #e2e8f0; --fc-button-bg-color: #087fc3; --fc-button-border-color: #087fc3; --fc-button-hover-bg-color: #06679e; --fc-button-hover-border-color: #06679e; --fc-button-active-bg-color: #102a43; --fc-button-active-border-color: #102a43; --fc-today-bg-color: #eaf7ff; }
.calendar-shell .fc { color: #334155; font-family: inherit; }
.calendar-shell .fc-toolbar-title { color: #102a43; font-size: 1.15rem; font-weight: 900; }
.calendar-shell .fc-button { border-radius: .7rem; box-shadow: none; font-size: .78rem; font-weight: 800; padding: .55rem .75rem; }
.calendar-shell .fc-col-header-cell-cushion { color: #102a43; font-size: .72rem; font-weight: 800; padding: .7rem .25rem; text-transform: uppercase; }
.calendar-shell .fc-daygrid-day-number { color: #475569; font-size: .8rem; font-weight: 700; padding: .55rem; }
.calendar-shell .fc-event { border-radius: .45rem; cursor: pointer; font-size: .72rem; font-weight: 700; padding: .1rem .25rem; }
@media (max-width: 639px) { .calendar-shell .fc-header-toolbar { align-items: stretch; flex-direction: column; gap: .75rem; } .calendar-shell .fc-toolbar-chunk { display: flex; justify-content: center; } }
</style>
