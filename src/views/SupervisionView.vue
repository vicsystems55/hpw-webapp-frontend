<script setup>
import { Archive, ClipboardCheck, GripVertical, MessageSquareText, Plus } from '@lucide/vue'
import { useApiList } from '../composables/useApiList'
import PageHeader from '../components/ui/PageHeader.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const { items, loading, error } = useApiList('/staff-supervision', data => data.supervisionQuestions)
</script>

<template>
  <div>
    <PageHeader title="Staff supervision" description="Build reflective, consistent supervision conversations that support staff and care quality."><template #actions><RouterLink to="/supervision/archive" class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-brand-blue"><Archive :size="18" /> Completed archive</RouterLink><button class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white"><Plus :size="18" /> Add question</button></template></PageHeader>
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <div class="mb-6 rounded-2xl border border-brand-blue/15 bg-brand-sky p-5"><div class="flex gap-3"><span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand-blue"><MessageSquareText :size="19" /></span><div><h2 class="font-extrabold text-brand-navy">Supervision question bank</h2><p class="mt-1 text-sm leading-6 text-slate-500">These questions form the shared structure for staff supervision sessions.</p></div></div></div>
    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!items.length" title="No supervision questions" message="Add the first prompt to begin structuring sessions." :icon="ClipboardCheck" />
    <div v-else class="card divide-y divide-slate-100 overflow-hidden">
      <article v-for="(item, index) in items" :key="item.id" class="flex items-start gap-3 p-4 sm:p-5"><GripVertical :size="19" class="mt-1 shrink-0 text-slate-300" /><span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-cream text-xs font-black text-brand-orange">{{ index + 1 }}</span><div class="flex-1"><p class="text-sm font-bold leading-6 text-brand-navy">{{ item.question }}</p><p v-if="item.question_type" class="mt-1 text-xs font-semibold capitalize text-slate-400">{{ item.question_type }}</p></div></article>
    </div>
  </div>
</template>
