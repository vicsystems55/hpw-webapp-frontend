<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  note: { type: String, default: '' },
  icon: { type: [Object, Function], required: true },
  tone: { type: String, default: 'blue' },
})

const tones = {
  blue: 'bg-brand-sky text-brand-blue',
  orange: 'bg-brand-cream text-brand-orange',
  mint: 'bg-emerald-50 text-brand-mint',
  yellow: 'bg-amber-50 text-amber-600',
}
</script>

<template>
  <article class="card group overflow-hidden p-5">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-slate-500">{{ label }}</p>
        <p class="mt-2 text-3xl font-black tracking-tight text-brand-navy">{{ value }}</p>
        <p v-if="note" class="mt-2 text-xs font-semibold text-slate-400">{{ note }}</p>
      </div>
      <span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-transform group-hover:-rotate-3 group-hover:scale-105" :class="tones[tone] || tones.blue">
        <component :is="icon" :size="23" />
      </span>
    </div>
  </article>
</template>
