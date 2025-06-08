---
layout: page
---


<div v-if="loading" class="flex justify-center items-center py-8">
  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
</div>

<div v-else-if="error" class="text-red-500 text-center py-8">
  {{ error }}
</div>

<div v-else class="vp-raw mt-10 max-w-[1440px] mx-auto px-6 lg:px-8">
    <DynamicFiltersTemplate />
    <DynamicPdfListTemplate />
</div>

<script setup>
import { onMounted, ref } from 'vue'
import { useFilteringStore } from '@theme/stores/filtering'
import DynamicFiltersTemplate from '@theme/components/DynamicFiltersTemplate.vue'
import DynamicPdfListTemplate from '@theme/components/DynamicPdfListTemplate.vue'
import PdfTable from '@theme/components/PdfTable.vue'
import { storeToRefs } from 'pinia'

const store = useFilteringStore()
const { filteredPdfs } = storeToRefs(store)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('/pdf-index.json')
    if (!response.ok) {
      throw new Error('Failed to load PDF index')
    }
    const data = await response.json()
    store.setPdfs(data)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load PDFs'
  } finally {
    loading.value = false
  }
})
</script> 