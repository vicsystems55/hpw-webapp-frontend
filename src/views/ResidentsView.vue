<script setup>
import { computed, ref } from 'vue'
import { HeartPulse, Plus, Search, UserRound, Users } from '@lucide/vue'
import { useApiList } from '../composables/useApiList'
import PageHeader from '../components/ui/PageHeader.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const search = ref('')
const { items, loading, error, load } = useApiList('/residents-management')
const filtered = computed(() => items.value.filter(item => [item.fullname, item.room_assignment, item.care_level].some(value => value?.toLowerCase().includes(search.value.toLowerCase()))))
</script>

<template>
  <div>
    <PageHeader title="Resident care" description="Keep essential care information accurate, accessible and easy to act on.">
      <template #actions>
        <button class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-brand-blue/20 hover:bg-brand-blue-dark"><Plus :size="18" /> Add resident</button>
      </template>
    </PageHeader>
    <ErrorBanner :message="error" @dismiss="error = ''" />

    <div class="card mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full sm:max-w-sm">
        <Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input v-model="search" class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-blue focus:bg-white" placeholder="Search residents…" />
      </div>
      <p class="text-sm font-bold text-slate-500"><span class="text-brand-blue">{{ filtered.length }}</span> resident{{ filtered.length === 1 ? '' : 's' }}</p>
    </div>

    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!filtered.length" title="No resident records found" message="Add a resident or adjust your search to see care records." :icon="HeartPulse" />
    <div v-else class="card overflow-hidden">
      <div class="hidden overflow-x-auto md:block">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500"><tr><th class="px-5 py-4">Resident</th><th class="px-5 py-4">Room</th><th class="px-5 py-4">Care level</th><th class="px-5 py-4">Emergency contact</th><th class="px-5 py-4">Status</th></tr></thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in filtered" :key="item.id" class="hover:bg-brand-sky/35">
              <td class="px-5 py-4"><div class="flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-xl bg-brand-sky text-brand-blue"><UserRound :size="18" /></span><div><p class="font-extrabold text-brand-navy">{{ item.fullname }}</p><p class="mt-0.5 text-xs text-slate-400">{{ item.resident_code || `Resident #${item.id}` }}</p></div></div></td>
              <td class="px-5 py-4 font-semibold text-slate-600">{{ item.room_assignment || 'Not assigned' }}</td>
              <td class="px-5 py-4 text-slate-600">{{ item.care_level || 'Not specified' }}</td>
              <td class="px-5 py-4"><p class="font-semibold text-slate-600">{{ item.emergency_contact_name || 'Not provided' }}</p><p class="text-xs text-slate-400">{{ item.emergency_contact_phone }}</p></td>
              <td class="px-5 py-4"><StatusBadge :status="item.status" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="divide-y divide-slate-100 md:hidden">
        <article v-for="item in filtered" :key="item.id" class="p-4">
          <div class="flex items-start justify-between gap-3"><div class="flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-xl bg-brand-sky text-brand-blue"><UserRound :size="18" /></span><div><p class="font-extrabold text-brand-navy">{{ item.fullname }}</p><p class="text-xs text-slate-400">Room {{ item.room_assignment || 'unassigned' }}</p></div></div><StatusBadge :status="item.status" /></div>
          <div class="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs"><div><p class="font-bold text-slate-400">Care level</p><p class="mt-1 font-semibold text-slate-600">{{ item.care_level || 'Not specified' }}</p></div><div><p class="font-bold text-slate-400">Emergency contact</p><p class="mt-1 font-semibold text-slate-600">{{ item.emergency_contact_name || 'Not provided' }}</p></div></div>
        </article>
      </div>
    </div>
  </div>
</template>
