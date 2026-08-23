<script setup>
import { Inbox } from '@lucide/vue'

defineProps({
  title: { type: String, default: 'Nothing here yet' },
  message: { type: String, default: 'New information will appear here when it becomes available.' },
  icon: { type: [Object, Function], default: Inbox },
})
</script>

<template>
  <div class="card grid min-h-52 place-items-center p-8 text-center">
    <div class="max-w-sm">
      <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-sky text-brand-blue"><component :is="icon" :size="25" /></span>
      <h3 class="mt-4 font-extrabold text-brand-navy">{{ title }}</h3>
      <p class="mt-1 text-sm leading-6 text-slate-500">{{ message }}</p>
    </div>
  </div>
</template>
