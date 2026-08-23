<script setup>
import { computed, ref } from 'vue'
import { BadgeCheck, Plus, Search, ShieldCheck, UserRound } from '@lucide/vue'
import { useApiList } from '../composables/useApiList'
import PageHeader from '../components/ui/PageHeader.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const search = ref('')
const { items, loading, error } = useApiList('/staff-records')
const filtered = computed(() => items.value.filter(item => [item.fullname, item.staff_id, item.email].some(value => value?.toLowerCase().includes(search.value.toLowerCase()))))
</script>

<template>
  <div>
    <PageHeader title="Staff records" description="Manage team profiles, qualifications, DBS information and supervision readiness.">
      <template #actions><button class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-brand-blue/20 hover:bg-brand-blue-dark"><Plus :size="18" /> Add team member</button></template>
    </PageHeader>
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <div class="card mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full sm:max-w-sm"><Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input v-model="search" class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-blue focus:bg-white" placeholder="Search team members…" /></div>
      <p class="text-sm font-bold text-slate-500"><span class="text-brand-blue">{{ filtered.length }}</span> team members</p>
    </div>
    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!filtered.length" title="No staff records found" message="Add a team member or adjust your search." :icon="ShieldCheck" />
    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article v-for="item in filtered" :key="item.id" class="card group p-5 hover:-translate-y-1 hover:shadow-xl">
        <div class="flex items-start justify-between gap-3"><span class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-mint text-white"><UserRound :size="22" /></span><StatusBadge :status="item.status" /></div>
        <h2 class="mt-4 text-lg font-black text-brand-navy">{{ item.fullname }}</h2>
        <p class="mt-1 text-sm font-bold text-brand-blue">{{ item.staff_id }}</p>
        <p class="mt-3 truncate text-sm text-slate-500">{{ item.email || 'No email linked' }}</p>
        <div class="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
          <div><p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Qualifications</p><p class="mt-1 text-lg font-black text-brand-navy">{{ item.qualifications?.length || 0 }}</p></div>
          <div><p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Supervisions</p><p class="mt-1 text-lg font-black text-brand-navy">{{ item.supervision_schedule?.length || 0 }}</p></div>
        </div>
        <button class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-extrabold text-brand-navy hover:bg-brand-sky hover:text-brand-blue"><BadgeCheck :size="17" /> View staff profile</button>
      </article>
    </div>
  </div>
</template>
