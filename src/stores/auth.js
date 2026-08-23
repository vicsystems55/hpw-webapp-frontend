import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api'

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('hpw_token'))
  const user = ref(readJson('hpw_user', null))
  const permissions = ref(readJson('hpw_permissions', []))
  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const isAdmin = computed(() => user.value?.role === 'admin')

  function persist() {
    if (token.value) localStorage.setItem('hpw_token', token.value)
    if (user.value) localStorage.setItem('hpw_user', JSON.stringify(user.value))
    localStorage.setItem('hpw_permissions', JSON.stringify(permissions.value))
  }

  function hasPermission(permission) {
    if (!permission) return true
    return permissions.value.includes('*') || permissions.value.includes(permission)
  }

  async function login(credentials, portal) {
    const { data } = await api.post(`/${portal}/login`, credentials)
    token.value = data.access_token
    user.value = data.user_data
    permissions.value = data.permissions || []
    persist()
    return data
  }

  async function refreshUser() {
    const { data } = await api.get('/me')
    user.value = data.user_data
    permissions.value = data.permissions || []
    persist()
  }

  async function logout() {
    try {
      if (token.value) await api.post('/logout')
    } finally {
      token.value = null
      user.value = null
      permissions.value = []
      localStorage.removeItem('hpw_token')
      localStorage.removeItem('hpw_user')
      localStorage.removeItem('hpw_permissions')
    }
  }

  return {
    token,
    user,
    permissions,
    isAuthenticated,
    isAdmin,
    hasPermission,
    login,
    logout,
    refreshUser,
  }
})
