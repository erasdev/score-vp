import { ref, onMounted } from 'vue'
import type { Pdf } from '../types/pdf'

export function usePdfs() {
  const pdfs = ref<Pdf[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      const response = await fetch('/pdf-index.json')
      if (!response.ok) {
        throw new Error('Failed to load PDF index')
      }
      const data = await response.json()
      pdfs.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load PDFs'
    } finally {
      loading.value = false
    }
  })

  return {
    pdfs,
    loading,
    error
  }
} 