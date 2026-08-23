<script setup>
import { computed, ref } from 'vue'
import { ArrowRight, CheckCircle2, Eye, EyeOff, HeartHandshake, LockKeyhole, Mail, ShieldCheck } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const portal = ref('staff')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const portalTitle = computed(() => portal.value === 'admin' ? 'Administrator portal' : 'Staff portal')

async function submit() {
  loading.value = true
  errorMessage.value = ''

  try {
    await auth.login({ email: email.value, password: password.value }, portal.value)
    router.replace(route.query.redirect || '/')
  } catch (error) {
    const errors = error.response?.data?.errors
    errorMessage.value = error.response?.data?.message || errors?.email?.[0] || 'We could not sign you in. Please check your details.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-white lg:grid lg:grid-cols-[1.08fr_0.92fr]">
    <section class="relative hidden min-h-screen overflow-hidden bg-brand-navy p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
      <div class="absolute -left-28 top-24 h-96 w-96 rounded-full bg-brand-blue/30 blur-3xl" />
      <div class="absolute -right-36 bottom-0 h-[30rem] w-[30rem] rounded-full bg-brand-orange/20 blur-3xl" />
      <div class="absolute right-16 top-20 h-28 w-28 rotate-12 rounded-[2rem] border border-white/10 bg-white/5" />

      <div class="relative">
        <img src="/hope-pathway-logo.png" alt="Hope Pathway" class="h-20 rounded-xl bg-white px-3 py-2" />
      </div>

      <div class="relative max-w-xl">
        <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-bold text-brand-yellow">
          <HeartHandshake :size="18" /> Compassion powered by clarity
        </span>
        <h1 class="mt-7 text-5xl font-black leading-[1.06] tracking-tight xl:text-6xl">Better tools for brighter, safer care.</h1>
        <p class="mt-6 max-w-lg text-lg leading-8 text-slate-300">One calm place for resident wellbeing, staff development, compliance and everyday care coordination.</p>

        <div class="mt-10 grid gap-4 sm:grid-cols-2">
          <div v-for="item in ['Secure care records', 'Training & supervision', 'Policy oversight', 'Clear team visibility']" :key="item" class="flex items-center gap-3 text-sm font-bold text-slate-200">
            <CheckCircle2 :size="19" class="text-brand-mint" /> {{ item }}
          </div>
        </div>
      </div>

      <p class="relative text-xs text-slate-400">Hope Pathway · Semi-Independent Living</p>
    </section>

    <section class="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(245,91,0,.10),transparent_24rem)] px-5 py-10 sm:px-10">
      <div class="w-full max-w-md">
        <img src="/hope-pathway-logo.png" alt="Hope Pathway" class="mb-10 h-18 w-auto object-contain lg:hidden" />

        <p class="text-xs font-extrabold uppercase tracking-[0.22em] text-brand-orange">Welcome back</p>
        <h2 class="mt-2 text-3xl font-black tracking-tight text-brand-navy sm:text-4xl">Sign in to your workspace</h2>
        <p class="mt-3 text-sm leading-6 text-slate-500">Choose the correct portal for your Hope Pathway account.</p>

        <div class="mt-8 grid grid-cols-2 rounded-2xl bg-slate-100 p-1.5" role="tablist" aria-label="Portal type">
          <button
            v-for="option in [{ value: 'staff', label: 'Staff', icon: HeartHandshake }, { value: 'admin', label: 'Administrator', icon: ShieldCheck }]"
            :key="option.value"
            type="button"
            class="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-extrabold"
            :class="portal === option.value ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-brand-navy'"
            @click="portal = option.value; errorMessage = ''"
          >
            <component :is="option.icon" :size="17" /> {{ option.label }}
          </button>
        </div>

        <form class="mt-8 space-y-5" @submit.prevent="submit">
          <div>
            <label for="email" class="mb-2 block text-sm font-bold text-brand-navy">Email address</label>
            <div class="relative">
              <Mail :size="19" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input id="email" v-model.trim="email" type="email" autocomplete="email" required class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10" placeholder="you@hopepathway.co.uk" />
            </div>
          </div>

          <div>
            <div class="mb-2 flex items-center justify-between">
              <label for="password" class="text-sm font-bold text-brand-navy">Password</label>
              <button type="button" class="text-xs font-bold text-brand-blue hover:text-brand-blue-dark">Forgot password?</button>
            </div>
            <div class="relative">
              <LockKeyhole :size="19" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-sm outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10" placeholder="Enter your password" />
              <button type="button" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
                <EyeOff v-if="showPassword" :size="19" />
                <Eye v-else :size="19" />
              </button>
            </div>
          </div>

          <div v-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{{ errorMessage }}</div>

          <button type="submit" :disabled="loading" class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand-blue/20 hover:-translate-y-0.5 hover:bg-brand-blue-dark disabled:cursor-wait disabled:opacity-60">
            <span>{{ loading ? 'Signing you in…' : `Continue to ${portalTitle}` }}</span>
            <ArrowRight v-if="!loading" :size="18" />
          </button>
        </form>

        <p class="mt-8 text-center text-xs leading-5 text-slate-400">Access is restricted to authorised Hope Pathway team members.</p>
      </div>
    </section>
  </main>
</template>
