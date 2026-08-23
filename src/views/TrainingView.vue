<script setup>
import { BookMarked, Clock3, GraduationCap, Plus } from '@lucide/vue'
import { useApiList } from '../composables/useApiList'
import { useAuthStore } from '../stores/auth'
import PageHeader from '../components/ui/PageHeader.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const auth = useAuthStore()
const endpoint = auth.isAdmin ? '/training-programmes' : '/staff/training'
const { items, loading, error } = useApiList(endpoint, response => auth.isAdmin ? response : (response.data || []))

const programme = item => item.training_programme || item
const trainingStatus = item => auth.isAdmin ? (item.status || 'active') : (Number(item.grade) > 0 ? 'completed' : 'assigned')
</script>

<template>
  <div>
    <PageHeader title="Staff training" description="Keep required learning visible and professional development moving forward.">
      <template #actions><button v-if="auth.hasPermission('training.manage')" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white"><Plus :size="18" /> Add programme</button></template>
    </PageHeader>
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!items.length" title="No training programmes" message="Training programmes will appear here when configured." :icon="GraduationCap" />
    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article v-for="(item, index) in items" :key="item.id" class="card overflow-hidden p-5">
        <div class="flex items-start justify-between"><span class="grid h-12 w-12 place-items-center rounded-2xl" :class="index % 2 ? 'bg-brand-cream text-brand-orange' : 'bg-brand-sky text-brand-blue'"><BookMarked :size="22" /></span><StatusBadge :status="trainingStatus(item)" /></div>
        <h2 class="mt-5 text-lg font-black text-brand-navy">{{ programme(item).name || programme(item).title }}</h2>
        <p class="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-500"><Clock3 :size="16" /> {{ programme(item).duration || 'Flexible duration' }}</p>
        <div class="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full w-0 rounded-full bg-gradient-to-r from-brand-blue to-brand-mint" /></div>
        <p class="mt-2 text-xs font-semibold text-slate-400">{{ auth.isAdmin ? 'Manage this programme and its staff assignments.' : (Number(item.grade) > 0 ? `Recorded grade: ${item.grade}` : 'Assigned to your staff learning record.') }}</p>
      </article>
    </div>
  </div>
</template>
