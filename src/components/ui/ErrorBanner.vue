<script setup>
import { CircleAlert, X } from '@lucide/vue'
defineProps({ message: String })
defineEmits(['dismiss'])
</script>

<template>
  <div v-if="message" class="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
    <CircleAlert :size="20" class="mt-0.5 shrink-0" />
    <p class="flex-1 text-sm font-semibold">{{ message }}</p>
    <button aria-label="Dismiss" @click="$emit('dismiss')"><X :size="18" /></button>
  </div>
</template>
