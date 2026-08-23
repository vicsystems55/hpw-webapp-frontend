<script setup>
import { FileImage, FileText, FolderOpen, HardDrive, ShieldCheck } from '@lucide/vue'
import PageHeader from '../components/ui/PageHeader.vue'

const folders = [
  { name: 'Resident documents', note: 'Identity and care records', icon: ShieldCheck, tone: 'bg-brand-sky text-brand-blue' },
  { name: 'Staff qualifications', note: 'Certificates and evidence', icon: FileText, tone: 'bg-emerald-50 text-brand-mint' },
  { name: 'Policy attachments', note: 'Supporting policy files', icon: FolderOpen, tone: 'bg-brand-cream text-brand-orange' },
  { name: 'Images', note: 'Profile and course images', icon: FileImage, tone: 'bg-amber-50 text-amber-600' },
]
</script>

<template>
  <div>
    <PageHeader title="Secure files" description="A clearer home for documents used across care, staff development and compliance." />
    <div class="mb-6 overflow-hidden rounded-[1.5rem] bg-brand-navy p-6 text-white sm:p-8"><div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-xs font-extrabold uppercase tracking-wider text-brand-yellow">Storage overview</p><h2 class="mt-2 text-2xl font-black">Private document access is next</h2><p class="mt-2 max-w-2xl text-sm leading-6 text-slate-300">The current backend stores uploads publicly. This redesigned area is prepared for secure, permission-controlled file delivery.</p></div><HardDrive :size="54" class="shrink-0 text-brand-mint" /></div></div>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><article v-for="folder in folders" :key="folder.name" class="card group p-5 hover:-translate-y-1 hover:shadow-xl"><span class="grid h-12 w-12 place-items-center rounded-2xl" :class="folder.tone"><component :is="folder.icon" :size="22" /></span><h2 class="mt-5 font-black text-brand-navy">{{ folder.name }}</h2><p class="mt-1 text-sm leading-6 text-slate-500">{{ folder.note }}</p><button class="mt-5 text-sm font-extrabold text-brand-blue">Browse folder →</button></article></div>
  </div>
</template>
