<script setup>
import { Bell, CheckCheck, Info } from '@lucide/vue'
import { useApiList } from '../composables/useApiList'
import PageHeader from '../components/ui/PageHeader.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const { items, loading, error } = useApiList('/notifications')
const formatDate = value => value ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : ''
</script>

<template>
  <div>
    <PageHeader title="Notifications" description="Important updates, reminders and activity across your workspace."><template #actions><button class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-brand-navy"><CheckCheck :size="17" /> Mark all read</button></template></PageHeader>
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!items.length" title="You're all caught up" message="There are no notifications for your account." :icon="Bell" />
    <div v-else class="card divide-y divide-slate-100 overflow-hidden">
      <article v-for="item in items" :key="item.id" class="flex gap-4 p-5 hover:bg-brand-sky/30">
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl" :class="item.status === 'unread' ? 'bg-brand-cream text-brand-orange' : 'bg-slate-100 text-slate-500'"><Info :size="20" /></span>
        <div class="min-w-0 flex-1"><div class="flex flex-wrap items-center justify-between gap-2"><h2 class="font-black text-brand-navy">{{ item.subject }}</h2><span class="text-xs font-semibold text-slate-400">{{ formatDate(item.created_at) }}</span></div><p class="mt-1 text-sm leading-6 text-slate-500">{{ item.msg }}</p></div>
        <span v-if="item.status === 'unread'" class="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-orange" />
      </article>
    </div>
  </div>
</template>
