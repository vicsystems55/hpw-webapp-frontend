<script setup>
import { ref } from 'vue'
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppTopbar from '../components/layout/AppTopbar.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="min-w-0">
      <AppTopbar @open-menu="sidebarOpen = true" />
      <main class="mx-auto w-full max-w-[96rem] px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>
