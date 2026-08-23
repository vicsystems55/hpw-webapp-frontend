<script setup>
import { computed } from 'vue'
import { Award, CheckCircle2, Clock3, Download, Sparkles } from '@lucide/vue'
import { useApiList } from '../composables/useApiList'
import PageHeader from '../components/ui/PageHeader.vue'
import StatCard from '../components/ui/StatCard.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const { items, loading, error } = useApiList('/course-performances', data => data.data)
const issued = computed(() => items.value.filter(item => item.certificate_status === 'issued').length)
const pending = computed(() => items.value.length - issued.value)
</script>

<template>
  <div>
    <PageHeader title="Certificates" description="Review achievements and issue certificates for completed learning." />
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <div class="mb-6 grid gap-4 sm:grid-cols-3"><StatCard label="Eligible records" :value="items.length" note="Completed performances" :icon="Sparkles" tone="blue" /><StatCard label="Certificates issued" :value="issued" note="Ready to access" :icon="CheckCircle2" tone="mint" /><StatCard label="Awaiting issue" :value="pending" note="Pending generation" :icon="Clock3" tone="orange" /></div>
    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!items.length" title="No certificate records" message="Eligible course completions will appear here." :icon="Award" />
    <div v-else class="grid gap-4 lg:grid-cols-2">
      <article v-for="item in items" :key="item.id" class="card relative overflow-hidden p-5">
        <div class="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-brand-orange/8" />
        <div class="relative flex items-start gap-4"><span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-cream text-brand-orange"><Award :size="23" /></span><div class="min-w-0 flex-1"><p class="text-xs font-extrabold uppercase tracking-wider text-brand-blue">{{ item.certificate_status === 'issued' ? 'Certificate issued' : 'Ready to generate' }}</p><h2 class="mt-1 font-black text-brand-navy">{{ item.user?.name || 'Staff member' }}</h2><p class="mt-1 text-sm text-slate-500">{{ item.course?.title || 'Course' }} · Grade {{ item.grade }}</p></div></div>
        <button class="relative mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold" :class="item.certificate_status === 'issued' ? 'bg-brand-sky text-brand-blue' : 'bg-brand-blue text-white'"><Download :size="17" /> {{ item.certificate_status === 'issued' ? 'Open certificate' : 'Generate certificate' }}</button>
      </article>
    </div>
  </div>
</template>
