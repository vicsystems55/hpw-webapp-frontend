<script setup>
import { CalendarClock, CheckCircle2, ClipboardCheck } from '@lucide/vue'
import { useApiList } from '../composables/useApiList'
import PageHeader from '../components/ui/PageHeader.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const { items, loading, error } = useApiList('/staff/supervisions', response => response.data || [])
</script>

<template>
  <div>
    <PageHeader title="My supervision" description="See your scheduled supervision sessions and completion history." />
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!items.length" title="No supervision sessions" message="Your scheduled sessions will appear here once an administrator assigns them." :icon="ClipboardCheck" />
    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="item in items" :key="item.id" class="card p-5">
        <div class="flex items-start justify-between gap-3"><span class="grid h-12 w-12 place-items-center rounded-2xl bg-brand-sky text-brand-blue"><ClipboardCheck :size="23" /></span><StatusBadge :status="item.status" /></div>
        <p class="mt-5 text-xs font-extrabold uppercase tracking-wider text-slate-400">Supervision date</p>
        <p class="mt-2 flex items-center gap-2 font-black text-brand-navy"><CalendarClock :size="18" class="text-brand-orange" /> {{ item.next_supervision_date }}</p>
        <div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm"><span class="font-semibold text-slate-500">Answers recorded</span><span class="flex items-center gap-1.5 font-extrabold text-brand-blue"><CheckCircle2 :size="16" /> {{ item.answers_count || 0 }}</span></div>
      </article>
    </div>
  </div>
</template>
