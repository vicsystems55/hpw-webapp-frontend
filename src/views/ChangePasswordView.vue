<script setup>
import { computed, reactive, ref } from 'vue'
import { CheckCircle2, Eye, EyeOff, KeyRound, ShieldCheck } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import PageHeader from '../components/ui/PageHeader.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'

const auth = useAuthStore()
const router = useRouter()
const form = reactive({ current_password: '', password: '', password_confirmation: '' })
const showPasswords = ref(false)
const saving = ref(false)
const error = ref('')
const mismatch = computed(() => form.password_confirmation && form.password !== form.password_confirmation)

async function submit() {
  if (mismatch.value) return
  saving.value = true
  error.value = ''
  try {
    await auth.changePassword(form)
    router.replace('/')
  } catch (requestError) {
    const errors = requestError.response?.data?.errors
    error.value = errors?.current_password?.[0] || errors?.password?.[0] || requestError.response?.data?.message || 'Your password could not be changed.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <PageHeader title="Change password" :description="auth.user?.must_change_password ? 'Your temporary password must be replaced before you continue.' : 'Choose a strong, unique password for your Hope Pathway account.'" />
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <section class="card p-6 sm:p-8">
      <div v-if="auth.user?.must_change_password" class="mb-6 flex gap-3 rounded-2xl bg-brand-cream p-4 text-sm text-brand-navy"><ShieldCheck :size="21" class="shrink-0 text-brand-orange" /><p><strong>First login protection:</strong> update the temporary password to unlock the rest of the portal.</p></div>
      <form class="space-y-5" @submit.prevent="submit">
        <label class="block"><span class="mb-2 block text-sm font-extrabold text-brand-navy">Current password</span><input v-model="form.current_password" :type="showPasswords ? 'text' : 'password'" required autocomplete="current-password" class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10" /></label>
        <label class="block"><span class="mb-2 block text-sm font-extrabold text-brand-navy">New password</span><input v-model="form.password" :type="showPasswords ? 'text' : 'password'" required minlength="12" autocomplete="new-password" class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10" /><span class="mt-1.5 block text-xs text-slate-500">Use at least 12 characters and avoid a password used elsewhere.</span></label>
        <label class="block"><span class="mb-2 block text-sm font-extrabold text-brand-navy">Confirm new password</span><input v-model="form.password_confirmation" :type="showPasswords ? 'text' : 'password'" required minlength="12" autocomplete="new-password" class="w-full rounded-xl border px-4 py-3 outline-none focus:ring-4 focus:ring-brand-blue/10" :class="mismatch ? 'border-red-300' : 'border-slate-200 focus:border-brand-blue'" /><span v-if="mismatch" class="mt-1.5 block text-xs font-bold text-red-600">The passwords do not match.</span></label>
        <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-blue" @click="showPasswords = !showPasswords"><EyeOff v-if="showPasswords" :size="17" /><Eye v-else :size="17" /> {{ showPasswords ? 'Hide passwords' : 'Show passwords' }}</button>
        <button type="submit" :disabled="saving || mismatch" class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-extrabold text-white disabled:opacity-50"><CheckCircle2 :size="18" /> {{ saving ? 'Updating…' : 'Update password' }}</button>
      </form>
    </section>
  </div>
</template>
