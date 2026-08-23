import { onMounted, ref } from 'vue'
import api from '../services/api'

export function useApiList(endpoint, transform = data => data) {
  const items = ref([])
  const loading = ref(true)
  const error = ref('')

  async function load(params) {
    loading.value = true
    error.value = ''

    try {
      const { data } = await api.get(endpoint, { params })
      items.value = transform(data) || []
    } catch (requestError) {
      error.value = requestError.response?.data?.message || 'This information could not be loaded.'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => load())

  return { items, loading, error, load }
}
