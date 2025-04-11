<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'
import { onMounted } from 'vue'

const mode = useColorMode({
  // disableTransition: false
})

const toggleMode = () => mode.value = mode.value === 'dark' ? 'light' : 'dark'
onMounted(() => {
  window.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'm') toggleMode()
  })
})

</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">
        <Icon icon="radix-icons:moon"
          class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Icon icon="radix-icons:sun"
          class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="mode = 'light'" class="text-xs"> Light </DropdownMenuItem>
      <DropdownMenuItem @click="mode = 'dark'" class="text-xs"> Dark </DropdownMenuItem>
      <DropdownMenuItem @click="mode = 'auto'" class="text-xs"> System </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
