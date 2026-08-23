<script setup>
import { computed } from 'vue'
import { Award, BookOpenCheck, ChartNoAxesCombined, CircleCheckBig, Target } from '@lucide/vue'
import { useApiList } from '../composables/useApiList'
import PageHeader from '../components/ui/PageHeader.vue'
import StatCard from '../components/ui/StatCard.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const { items, loading, error } = useApiList('/my-performances', data => data.data)
const passed = computed(() => items.value.filter(item => item.status === 'passed').length)
const certificates = computed(() => items.value.filter(item => item.certificate_status === 'issued').length)
const average = computed(() => {
  if (!items.value.length) return 0
  const sum = items.value.reduce((total, item) => total + (item.expected_score ? (item.total_score / item.expected_score) * 100 : 0), 0)
  return Math.round(sum / items.value.length)
})
</script>

<template>
  <div>
    <PageHeader title="My performance" description="See your learning results, completed assessments and earned achievements." />
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <div class="mb-6 grid gap-4 sm:grid-cols-3"><StatCard label="Assessments" :value="items.length" note="Total attempts recorded" :icon="BookOpenCheck" tone="blue" /><StatCard label="Passed" :value="passed" note="Successfully completed" :icon="CircleCheckBig" tone="mint" /><StatCard label="Average score" :value="`${average}%`" note="Across all assessments" :icon="Target" tone="orange" /></div>
    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!items.length" title="No performance yet" message="Your results will appear after you complete a course assessment." :icon="ChartNoAxesCombined" />
    <div v-else class="space-y-4">
      <article v-for="item in items" :key="item.id" class="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-sky text-brand-blue"><Award :size="22" /></span>
        <div class="min-w-0 flex-1"><h2 class="font-black text-brand-navy">{{ item.course?.title || 'Course assessment' }}</h2><p class="mt-1 text-sm text-slate-500">Grade {{ item.grade || '—' }} · {{ item.total_score }}/{{ item.expected_score }} points</p></div>
        <div class="flex items-center gap-3"><StatusBadge :status="item.status" /><span v-if="item.certificate_status === 'issued'" class="rounded-full bg-brand-cream px-2.5 py-1 text-xs font-bold text-brand-orange">Certificate ready</span></div>
      </article>
    </div>
  </div>
</template>
