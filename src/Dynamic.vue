<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent, computed } from 'vue'
import type { VideoMetadata } from '@/types'
import { columns } from './components/data-table/columns'
import { Button } from '@/components/ui/button'
import { ModeToggle } from "@/components"

import videoDataUrl from './data/videos.json?url'

const videos = ref<VideoMetadata[]>([])
const isLoadingData = ref(true)
const loadingError = ref<string | null>(null)

const DataTable = defineAsyncComponent(() =>
  import('./components/data-table/DataTable.vue')
    .catch(err => {
      console.error("Failed DataTable component:", err);
    })
)

onMounted(async () => {
  try {
    const response = await fetch(videoDataUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} fetching ${videoDataUrl}`)
    }
    videos.value = await response.json()
    loadingError.value = null
  } catch (error) {
    console.error("Failed to fetch video data:", error)
    loadingError.value = "Failed to load video data. Please try again later."
    videos.value = []
  } finally {
    isLoadingData.value = false
  }
})

const isReady = computed(() => !isLoadingData.value && !loadingError.value && videos.value.length > 0)
const showEmptyState = computed(() => !isLoadingData.value && !loadingError.value && videos.value.length === 0)

</script>
<template>
  <nav
    class='sm:max-w-sm max-w-[350px] rounded-lg fixed top-4 left-1/2 -translate-x-1/2 z-30 flex md:max-w-md lg:max-w-lg items-center justify-between border bg-background/50 backdrop-blur-lg mx-auto px-3 py-2 shadow w-full'>
    <ModeToggle class="ml-auto" />
  </nav>
  <main class="py-26 overflow-x-hidden @container">
    <div class="p-4 flex flex-col gap-4 mx-auto w-[95cqw] min-h-screen items-center justify-center">
      <div v-if="isLoadingData" class="flex items-center justify-center h-64">
        <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <span class="ml-3 text-muted-foreground">Loading videos...</span>
      </div>
      <div v-else-if="loadingError" class="text-destructive text-center h-64 flex items-center justify-center">
        <p>{{ loadingError }}</p>
      </div>
      <div v-else-if="showEmptyState" class="text-muted-foreground text-center h-64 flex items-center justify-center">
        <p>No videos found.</p>
      </div>
      <section v-else-if="isReady" class='flex overflow-x-auto items-center w-full justify-center p-2'>
        <div class='w-full'>
          <DataTable :data="videos" :columns="columns" />
        </div>
      </section>
    </div>
  </main>
</template>
