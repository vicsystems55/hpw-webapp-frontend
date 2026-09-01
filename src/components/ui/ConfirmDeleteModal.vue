<script setup>
import { AlertTriangle, Trash2, X } from '@lucide/vue'

defineProps({
  open: { type: Boolean, default: false },
  busy: { type: Boolean, default: false },
  title: { type: String, required: true },
  itemName: { type: String, default: 'this record' },
  warning: { type: String, default: 'This action is permanent and cannot be undone.' },
})

defineEmits(['cancel', 'confirm'])
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-brand-navy/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" :aria-label="title" @click.self="$emit('cancel')">
    <section class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
      <div class="flex items-start justify-between gap-4">
        <span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-600"><AlertTriangle :size="24" /></span>
        <button type="button" class="rounded-xl p-2 text-slate-400 hover:bg-slate-100" aria-label="Close" :disabled="busy" @click="$emit('cancel')"><X :size="20" /></button>
      </div>
      <h2 class="mt-5 text-xl font-black text-brand-navy">{{ title }}</h2>
      <p class="mt-2 text-sm leading-6 text-slate-600">You are about to permanently remove <strong>{{ itemName }}</strong>.</p>
      <p class="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{{ warning }}</p>
      <div class="mt-6 flex justify-end gap-3">
        <button type="button" class="rounded-xl px-5 py-3 text-sm font-extrabold text-slate-500 hover:bg-slate-100" :disabled="busy" @click="$emit('cancel')">Cancel</button>
        <button type="button" class="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-red-700 disabled:opacity-50" :disabled="busy" @click="$emit('confirm')"><Trash2 :size="17" /> {{ busy ? 'Removing…' : 'Yes, remove' }}</button>
      </div>
    </section>
  </div>
</template>
