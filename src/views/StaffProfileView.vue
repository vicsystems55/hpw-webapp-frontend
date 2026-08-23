<script setup>
import { onMounted, reactive, ref } from 'vue'
import { BadgeCheck, Mail, MapPin, Phone, Save, UserRound } from '@lucide/vue'
import api from '../services/api'
import PageHeader from '../components/ui/PageHeader.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import ErrorBanner from '../components/ui/ErrorBanner.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'

const profile = ref(null)
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const success = ref('')
const form = reactive({ phone_number: '', address: '' })

async function loadProfile() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/staff/profile')
    profile.value = data.data
    form.phone_number = profile.value.phone_number || ''
    form.address = profile.value.address || ''
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Your staff profile could not be loaded.'
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    const { data } = await api.put('/staff/profile', form)
    profile.value = data.data
    success.value = data.message
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Your profile could not be updated.'
  } finally {
    saving.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <div>
    <PageHeader title="My staff profile" description="Review your employment details and keep your contact information current." />
    <ErrorBanner :message="error" @dismiss="error = ''" />
    <div v-if="success" class="mb-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{{ success }}</div>
    <LoadingState v-if="loading" />
    <div v-else-if="profile" class="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
      <section class="card p-6">
        <div class="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
          <span class="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-mint text-white"><UserRound :size="30" /></span>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2"><h2 class="text-xl font-black text-brand-navy">{{ profile.fullname }}</h2><StatusBadge :status="profile.status" /></div>
            <p class="mt-1 font-bold text-brand-blue">{{ profile.staff_id }}</p>
            <p class="mt-2 flex items-center gap-2 text-sm text-slate-500"><Mail :size="16" /> {{ profile.email }}</p>
          </div>
        </div>
        <form class="mt-6 space-y-5" @submit.prevent="saveProfile">
          <label class="block"><span class="mb-2 flex items-center gap-2 text-sm font-extrabold text-brand-navy"><Phone :size="16" /> Phone number</span><input v-model="form.phone_number" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:bg-white" /></label>
          <label class="block"><span class="mb-2 flex items-center gap-2 text-sm font-extrabold text-brand-navy"><MapPin :size="16" /> Address</span><textarea v-model="form.address" rows="4" class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:bg-white" /></label>
          <button :disabled="saving" class="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60"><Save :size="18" /> {{ saving ? 'Saving…' : 'Save changes' }}</button>
        </form>
      </section>
      <section class="card p-6">
        <div class="flex items-center gap-3"><span class="grid h-11 w-11 place-items-center rounded-xl bg-brand-cream text-brand-orange"><BadgeCheck :size="22" /></span><div><h2 class="font-black text-brand-navy">Qualifications</h2><p class="text-sm text-slate-500">Recorded training and credentials</p></div></div>
        <div v-if="profile.qualifications?.length" class="mt-5 space-y-3">
          <div v-for="qualification in profile.qualifications" :key="qualification.id" class="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p class="font-extrabold text-brand-navy">{{ qualification.qualification || qualification.name || 'Qualification' }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ qualification.institution || qualification.awarding_body || 'Details held by Hope Pathway' }}</p>
          </div>
        </div>
        <p v-else class="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No qualifications have been added to your record yet.</p>
      </section>
    </div>
  </div>
</template>
