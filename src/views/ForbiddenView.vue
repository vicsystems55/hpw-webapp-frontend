<script setup>
import { ArrowLeft, ShieldX } from '@lucide/vue'
</script>

<template>
  <div class="grid min-h-[65vh] place-items-center">
    <div class="max-w-md text-center"><span class="mx-auto grid h-20 w-20 place-items-center rounded-[1.5rem] bg-brand-cream text-brand-orange"><ShieldX :size="36" /></span><p class="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-orange">Permission required</p><h1 class="mt-2 text-3xl font-black text-brand-navy">This area isn’t available to your role.</h1><p class="mt-3 text-sm leading-6 text-slate-500">Your Hope Pathway account is active, but an administrator must grant access to this feature.</p><RouterLink to="/" class="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-extrabold text-white"><ArrowLeft :size="18" /> Back to overview</RouterLink></div>
  </div>
</template>
