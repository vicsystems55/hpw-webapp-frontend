<script setup>
import { computed } from 'vue'

const props = defineProps({ status: { type: String, default: 'active' } })
const normalized = computed(() => props.status?.toLowerCase() || 'unknown')
const badgeClass = computed(() => {
  if (['active', 'passed', 'completed', 'issued'].includes(normalized.value)) return 'bg-emerald-50 text-emerald-700 ring-emerald-600/15'
  if (['failed', 'inactive', 'expired'].includes(normalized.value)) return 'bg-red-50 text-red-700 ring-red-600/15'
  return 'bg-amber-50 text-amber-700 ring-amber-600/15'
})
</script>

<template>
  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ring-1 ring-inset" :class="badgeClass">{{ normalized }}</span>
</template>
