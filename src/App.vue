<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ModeToggle } from "@/components"
</script>
<template>
  <nav
    className='sm:max-w-sm max-w-[350px] rounded-lg fixed top-4 left-1/2 -translate-x-1/2 z-30 flex md:max-w-md lg:max-w-lg items-center justify-between border bg-background/50 backdrop-blur-lg mx-auto px-3 py-2 shadow w-full'>
    <ModeToggle class="ml-auto" />
  </nav>
  <main>
  </main>
</template>
<style scoped>

</style>
