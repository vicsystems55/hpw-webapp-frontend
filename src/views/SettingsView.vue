<script setup>
import { Building2, ChevronRight, KeyRound, ShieldCheck, UserCog } from '@lucide/vue'
import { useRouter } from 'vue-router'
import PageHeader from '../components/ui/PageHeader.vue'

const router = useRouter()
const settings = [
  { title: 'Users & permissions', note: 'Create staff access and manage account protection.', icon: UserCog, tone: 'bg-brand-sky text-brand-blue', to: '/staff-access' },
  { title: 'Organisation', note: 'Configure offices, departments and operational details.', icon: Building2, tone: 'bg-emerald-50 text-brand-mint', status: 'Next' },
  { title: 'Security', note: 'Review sessions, password controls and account protection.', icon: KeyRound, tone: 'bg-brand-cream text-brand-orange', status: 'Planned' },
  { title: 'Compliance controls', note: 'Manage document visibility, retention and audit settings.', icon: ShieldCheck, tone: 'bg-amber-50 text-amber-600', status: 'Planned' },
]

const openSetting = item => item.to && router.push(item.to)
</script>

<template>
  <div>
    <PageHeader title="Settings" description="Manage access, organisation structure and the controls behind safe operations." />
    <div class="grid gap-4 md:grid-cols-2"><button v-for="item in settings" :key="item.title" type="button" :disabled="!item.to" class="card flex items-center gap-4 p-5 text-left disabled:cursor-default disabled:opacity-75 enabled:hover:-translate-y-0.5 enabled:hover:border-brand-blue/20 enabled:hover:shadow-xl" @click="openSetting(item)"><span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" :class="item.tone"><component :is="item.icon" :size="22" /></span><span class="min-w-0 flex-1"><span class="flex items-center gap-2"><span class="block font-black text-brand-navy">{{ item.title }}</span><span v-if="item.status" class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{{ item.status }}</span></span><span class="mt-1 block text-sm leading-6 text-slate-500">{{ item.note }}</span></span><ChevronRight v-if="item.to" :size="20" class="shrink-0 text-slate-300" /></button></div>
  </div>
</template>
