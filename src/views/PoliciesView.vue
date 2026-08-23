<script setup>
import { computed, ref } from 'vue'
import { CalendarClock, FilePlus2, FileText, Search } from '@lucide/vue'
import { useApiList } from '../composables/useApiList'
import { useAuthStore } from '../stores/auth'
import PageHeader from '../components/ui/PageHeader.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const auth = useAuthStore()
const search = ref('')
const { items, loading, error } = useApiList('/policies')
const filtered = computed(() => items.value.filter(item => [item.name, item.type].some(value => value?.toLowerCase().includes(search.value.toLowerCase()))))
</script>

<template>
  <div>
    <PageHeader title="Policies & guidance" description="One trusted library for the standards that guide safe, consistent care.">
      <template #actions><button v-if="auth.hasPermission('policies.manage')" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white"><FilePlus2 :size="18" /> New policy</button></template>
    </PageHeader>
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <div class="card mb-6 p-4"><div class="relative max-w-md"><Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input v-model="search" class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-blue focus:bg-white" placeholder="Search policy library…" /></div></div>
    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!filtered.length" title="No policies found" message="Published policies and guidance will appear here." :icon="FileText" />
    <div v-else class="grid gap-4 lg:grid-cols-2">
      <article v-for="policy in filtered" :key="policy.id" class="card flex gap-4 p-5 hover:-translate-y-0.5 hover:shadow-xl">
        <span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-cream text-brand-orange"><FileText :size="22" /></span>
        <div class="min-w-0 flex-1"><div class="flex flex-wrap items-start justify-between gap-2"><div><p class="text-xs font-extrabold uppercase tracking-wider text-brand-blue">{{ policy.type || 'General guidance' }}</p><h2 class="mt-1 truncate text-lg font-black text-brand-navy">{{ policy.name }}</h2></div><StatusBadge :status="policy.status" /></div><div class="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400"><CalendarClock :size="15" /> Review by {{ policy.exp_date || 'Not specified' }}</div></div>
      </article>
    </div>
  </div>
</template>
