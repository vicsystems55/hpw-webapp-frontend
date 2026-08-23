<script setup>
defineProps({
  eyebrow: { type: String, default: 'Hope Pathway' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p class="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-orange">{{ eyebrow }}</p>
      <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">{{ title }}</h1>
      <p v-if="description" class="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
