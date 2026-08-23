<script setup>
import { computed } from 'vue'
import { CalendarDays, Clock3, MapPin, Plus } from '@lucide/vue'
import { useApiList } from '../composables/useApiList'
import PageHeader from '../components/ui/PageHeader.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const { items, loading, error } = useApiList('/calendar-events', data => data.data || data)
const sortedEvents = computed(() => [...items.value].sort((a, b) => new Date(a.start) - new Date(b.start)))
const dateParts = value => {
  const date = value ? new Date(value) : new Date()
  return { day: date.toLocaleDateString('en-GB', { day: '2-digit' }), month: date.toLocaleDateString('en-GB', { month: 'short' }), time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }
}
</script>

<template>
  <div>
    <PageHeader title="Calendar" description="Coordinate appointments, supervision, learning and important care dates."><template #actions><button class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white"><Plus :size="18" /> Add event</button></template></PageHeader>
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!sortedEvents.length" title="No events scheduled" message="Add an event to start building the team calendar." :icon="CalendarDays" />
    <div v-else class="grid gap-4 lg:grid-cols-2">
      <article v-for="event in sortedEvents" :key="event.id" class="card flex gap-4 p-5">
        <div class="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-sky text-center"><div><p class="text-xl font-black leading-none text-brand-blue">{{ dateParts(event.start).day }}</p><p class="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-blue-dark">{{ dateParts(event.start).month }}</p></div></div>
        <div class="min-w-0"><h2 class="truncate font-black text-brand-navy">{{ event.title }}</h2><p class="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-500"><Clock3 :size="15" /> {{ dateParts(event.start).time }}</p><p v-if="event.extendedProps?.location" class="mt-1.5 flex items-center gap-2 text-xs font-semibold text-slate-500"><MapPin :size="15" /> {{ event.extendedProps.location }}</p></div>
      </article>
    </div>
  </div>
</template>
