<script setup>
import { computed, ref } from 'vue'
import { Bell, ChevronDown, KeyRound, LogOut, Menu, Search } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

defineEmits(['open-menu'])

const auth = useAuthStore()
const router = useRouter()
const menuOpen = ref(false)
const initials = computed(() => auth.user?.name?.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase() || 'HP')

async function signOut() {
  menuOpen.value = false
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
    <div class="flex h-18 items-center gap-3 px-4 sm:px-6 lg:px-8">
      <button class="rounded-xl border border-slate-200 p-2 text-brand-navy hover:bg-brand-sky lg:hidden" aria-label="Open navigation" @click="$emit('open-menu')">
        <Menu :size="21" />
      </button>

      <div class="relative hidden max-w-md flex-1 md:block">
        <Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-blue focus:bg-white" placeholder="Search records, policies or courses…" />
      </div>

      <div class="ml-auto flex items-center gap-2 sm:gap-3">
        <RouterLink to="/notifications" class="relative rounded-xl p-2.5 text-slate-500 hover:bg-brand-sky hover:text-brand-blue" aria-label="Notifications">
          <Bell :size="20" />
          <span class="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-orange ring-2 ring-white" />
        </RouterLink>

        <div class="relative">
          <button class="flex items-center gap-2 rounded-xl p-1.5 pr-2 hover:bg-slate-100" @click="menuOpen = !menuOpen">
            <span class="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-mint text-sm font-extrabold text-white">{{ initials }}</span>
            <span class="hidden text-left sm:block">
              <span class="block max-w-36 truncate text-sm font-bold text-brand-navy">{{ auth.user?.name }}</span>
              <span class="block text-[11px] font-bold uppercase tracking-wider text-brand-orange">{{ auth.user?.role }}</span>
            </span>
            <ChevronDown :size="15" class="hidden text-slate-400 sm:block" />
          </button>

          <div v-if="menuOpen" class="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
            <RouterLink to="/change-password" class="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-brand-sky hover:text-brand-blue" @click="menuOpen = false">
              <KeyRound :size="17" /> Change password
            </RouterLink>
            <button class="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600" @click="signOut">
              <LogOut :size="17" /> Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
