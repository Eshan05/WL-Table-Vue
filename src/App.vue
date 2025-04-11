<script setup lang="ts">
import { columns } from './components/data-table/columns'
import { DataTable } from './components/data-table'
import { Button } from '@/components/ui/button'
import { ModeToggle } from "@/components"
import videos from './data/videos.json'
</script>
<template>
  <nav
    className='sm:max-w-sm max-w-[350px] rounded-lg fixed top-4 left-1/2 -translate-x-1/2 z-30 flex md:max-w-md lg:max-w-lg items-center justify-between border bg-background/50 backdrop-blur-lg mx-auto px-3 py-2 shadow w-full'>
    <ModeToggle class="ml-auto" />
  </nav>
  <main class="py-26 overflow-x-hidden @container">
    <div class="p-4 flex flex-col gap-4 mx-auto w-[90cqw] min-h-screen items-center justify-center">
      <section class='flex overflow-x-auto items-center w-full justify-center p-2'>
        <div class='w-full'>
          <DataTable :data="videos" :columns="columns" />
        </div>
      </section>
    </div>
  </main>
</template>
<style scoped>

</style>
