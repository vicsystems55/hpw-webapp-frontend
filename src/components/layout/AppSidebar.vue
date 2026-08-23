<script setup>
import { computed } from 'vue'
import { X } from '@lucide/vue'
import { navigation } from '../../config/navigation'
import { useAuthStore } from '../../stores/auth'

defineProps({ open: Boolean })
defineEmits(['close'])

const auth = useAuthStore()
const visibleNavigation = computed(() => navigation.filter(item => {
  const roleAllowed = !item.roles || item.roles.includes(auth.user?.role)
  const permissionAllowed = item.permissions
    ? item.permissions.some(permission => auth.hasPermission(permission))
    : auth.hasPermission(item.permission)

  return roleAllowed && permissionAllowed
}))
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-40 bg-brand-navy/45 backdrop-blur-sm lg:hidden"
    aria-hidden="true"
    @click="$emit('close')"
  />

  <aside
    class="fixed inset-y-0 left-0 z-50 flex w-[17rem] flex-col overflow-hidden bg-brand-navy text-white shadow-2xl transition-transform duration-200 lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="absolute inset-x-0 top-0 h-52 bg-gradient-to-br from-brand-blue/35 via-transparent to-brand-orange/10" />
    <div class="relative flex h-24 items-center justify-between border-b border-white/10 px-5">
      <img src="/hope-pathway-logo.png" alt="Hope Pathway" class="h-14 w-auto rounded-lg bg-white px-2 py-1 object-contain" />
      <button class="rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close navigation" @click="$emit('close')">
        <X :size="20" />
      </button>
    </div>

    <nav class="relative flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Main navigation">
      <RouterLink
        v-for="item in visibleNavigation"
        :key="item.to"
        :to="item.to"
        class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/8 hover:text-white"
        active-class="!bg-brand-blue !text-white shadow-lg shadow-brand-blue/20"
        @click="$emit('close')"
      >
        <component :is="item.icon" :size="19" :stroke-width="2" class="shrink-0" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="relative m-3 rounded-2xl border border-white/10 bg-white/6 p-4">
      <p class="text-xs font-bold uppercase tracking-[0.18em] text-brand-yellow">Care first</p>
      <p class="mt-2 text-xs leading-5 text-slate-300">Supporting safe, confident and compassionate care every day.</p>
    </div>
  </aside>
</template>
