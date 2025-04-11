<script setup lang="ts" generic="TData, TValue">
import type { Column } from '@tanstack/vue-table'
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { computed } from 'vue'

interface DataTableColumnHeaderProps {
  column: Column<TData, TValue>
  title: string
  class?: string
}

const props = defineProps<DataTableColumnHeaderProps>()

const sortedState = computed(() => props.column.getIsSorted())
</script>
<template>
  <div v-if="!column.getCanSort()" :class="cn(props.class)">
    {{ title }}
  </div>
  <div v-else :class="cn('flex items-center space-x-2', props.class)">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          size="sm"
          class="-ml-3 h-8 data-[state=open]:bg-accent flex items-center">
          <span>{{ title }}</span>
          <ArrowDown
            v-if="sortedState === 'desc'"
            class="h-3.5 w-3.5 text-muted-foreground/70 ml-1" />
          <ArrowUp
            v-else-if="sortedState === 'asc'"
            class="h-3.5 w-3.5 text-muted-foreground/70 ml-1" />
          <ChevronsUpDown
            v-else
            class="h-4 w-4 text-muted-foreground/70 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem @click="column.toggleSorting(false)">
          <ArrowUp class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" /> Ascending
        </DropdownMenuItem>
        <DropdownMenuItem @click="column.toggleSorting(true)">
          <ArrowDown class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" /> Descending
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="column.toggleVisibility(false)">
          <EyeOff class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" /> Hide
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
