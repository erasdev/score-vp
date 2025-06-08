<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vitepress';
import type { Pdf } from '../types/pdf';
import fetchPdfs from '../helpers/fetchPdfs';
const route = useRoute();
const pdf = ref<Pdf | null>(null);

onMounted(async () => {
  const all = await fetchPdfs();
  pdf.value = all.find((p: Pdf) => p.slug === route.path.split('/').pop());
});
</script>

<template>
  <div v-if="pdf" class="w-full min-h-screen bg-background">
    <div class="max-w-[1440px] mx-auto px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold mb-4 text-text-dark">{{ pdf.title }}</h1>
      <p class="text-lg mb-6 text-text-light">{{ pdf.description }}</p>
    </div>
    <div class="w-full h-[calc(100vh-200px)]">
      <iframe 
        :src="pdf.file" 
        class="w-full h-full border-0"
        title="PDF Viewer"
      />
    </div>
  </div>
</template>