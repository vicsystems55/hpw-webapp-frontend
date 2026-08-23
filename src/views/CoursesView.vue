<script setup>
import { computed, ref } from 'vue'
import { ArrowRight, BookOpen, Clock3, Plus, Search, Signal } from '@lucide/vue'
import { useApiList } from '../composables/useApiList'
import { useAuthStore } from '../stores/auth'
import PageHeader from '../components/ui/PageHeader.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const auth = useAuthStore()
const search = ref('')
const { items, loading, error } = useApiList('/courses')
const filtered = computed(() => items.value.filter(item => [item.title, item.category, item.short_description].some(value => value?.toLowerCase().includes(search.value.toLowerCase()))))
const apiOrigin = computed(() => (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, ''))

function imageUrl(path) {
  return path ? `${apiOrigin.value}/${path.replace(/^\//, '')}` : ''
}
</script>

<template>
  <div>
    <PageHeader title="Learning hub" description="Build skills, refresh knowledge and celebrate professional progress.">
      <template #actions><button v-if="auth.hasPermission('courses.manage')" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white"><Plus :size="18" /> Create course</button></template>
    </PageHeader>
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <div class="card mb-6 p-4"><div class="relative max-w-md"><Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input v-model="search" class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-blue focus:bg-white" placeholder="Search courses and topics…" /></div></div>
    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!filtered.length" title="No courses available" message="New learning opportunities will appear here." :icon="BookOpen" />
    <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="(course, index) in filtered" :key="course.id" class="card group overflow-hidden hover:-translate-y-1 hover:shadow-xl">
        <div class="relative h-44 overflow-hidden" :class="index % 3 === 0 ? 'bg-gradient-to-br from-brand-blue to-cyan-500' : index % 3 === 1 ? 'bg-gradient-to-br from-brand-orange to-amber-400' : 'bg-gradient-to-br from-brand-mint to-emerald-400'">
          <img v-if="course.feature_image" :src="imageUrl(course.feature_image)" :alt="course.title" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <BookOpen v-else :size="58" class="absolute bottom-5 right-6 text-white/50" />
          <span class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold capitalize text-brand-navy backdrop-blur">{{ course.category || 'Care skills' }}</span>
        </div>
        <div class="p-5">
          <div class="flex items-center gap-4 text-xs font-bold text-slate-400"><span class="flex items-center gap-1.5"><Clock3 :size="15" /> {{ course.duration || 'Self-paced' }}</span><span class="flex items-center gap-1.5 capitalize"><Signal :size="15" /> {{ course.level }}</span></div>
          <h2 class="mt-4 text-xl font-black leading-7 text-brand-navy">{{ course.title }}</h2>
          <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{{ course.short_description || 'Open this course to explore the learning materials and assessment.' }}</p>
          <button class="mt-5 flex items-center gap-2 text-sm font-extrabold text-brand-blue">Open course <ArrowRight :size="17" class="transition-transform group-hover:translate-x-1" /></button>
        </div>
      </article>
    </div>
  </div>
</template>
