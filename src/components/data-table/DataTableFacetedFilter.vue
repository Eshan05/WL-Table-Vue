<script setup lang="ts" generic="TData, TValue">
import { type Component, computed, ref } from 'vue'
import Fuse from 'fuse.js'
import type { Column } from '@tanstack/vue-table'
import { Check, PlusCircle } from 'lucide-vue-next'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

interface Option {
  label: string
  value: string
  icon?: Component
}

interface DataTableFacetedFilterProps {
  column?: Column<TData, TValue>
  title?: string
  options: Option[]
}

const props = defineProps<DataTableFacetedFilterProps>()
const searchTerm = ref('')
const OPTIONS_LIMIT_THRESHOLD = 50
const INITIAL_DISPLAY_LIMIT = 25

const selectedValues = computed(() => {
  const filterValue = props.column?.getFilterValue()
  if (Array.isArray(filterValue)) {
    return new Set(filterValue as string[])
  }
  if (filterValue) {
    return new Set([filterValue] as string[])
  }
  return new Set<string>()
})

const computedOptions = computed(() => {
  const lowerSearchTerm = searchTerm.value.toLowerCase().trim()
  const filtered = lowerSearchTerm
    ? props.options.filter(option =>
      option.label.toLowerCase().includes(lowerSearchTerm)
    )
    : props.options; // Show all if no search term

  if (props.options.length > OPTIONS_LIMIT_THRESHOLD) {
    if (lowerSearchTerm.length < 1) {
      return filtered.slice(0, INITIAL_DISPLAY_LIMIT);
    }
  }

  return filtered;
})

// const facets = computed(() => props.column?.getFacetedUniqueValues())
function getOptionCount(optionValue: string): number {
  if (!props.column) return 0
  const rows = props.column.getFacetedRowModel().rows
  return rows.reduce((acc, row) => {
    const rowValue = row.getValue(props.column!.id)

    if (Array.isArray(rowValue)) {
      return rowValue.map(String).includes(optionValue) ? acc + 1 : acc
    }
    else {
      return String(rowValue) === optionValue ? acc + 1 : acc
    }
  }, 0)
}

function handleSelect(optionValue: string) {
  const currentSelected = new Set(selectedValues.value)
  if (currentSelected.has(optionValue)) {
    currentSelected.delete(optionValue)
  }
  else {
    currentSelected.add(optionValue)
  }

  const filterValues = Array.from(currentSelected)
  props.column?.setFilterValue(filterValues.length ? filterValues : undefined)
}
</script>
<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        size="sm"
        class="h-8 border-dashed flex items-center space-x-2">
        <PlusCircle class="h-4 w-4" />
        <span>{{ title }}</span>
        <template v-if="selectedValues.size > 0">
          <Separator orientation="vertical" class="mx-2 h-4" />
          <Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
            {{ selectedValues.size }}
          </Badge>
          <div class="hidden space-x-1 lg:flex">
            <template v-if="selectedValues.size > 2">
              <Badge variant="secondary" class="rounded-sm px-1 font-normal">
                {{ selectedValues.size }} selected
              </Badge>
            </template>
            <template v-else>
              <Badge
                v-for="option in options.filter(opt => selectedValues.has(opt.value))"
                :key="option.value"
                variant="secondary"
                class="rounded-sm px-1 font-normal">
                {{ option.label }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <!-- End -->
    <PopoverContent class="w-3xs p-0" align="start">
      <Command>
        <!-- :filter-function="(list: string[], term: string) => list.filter((i: string) => i.toLowerCase().includes(term.toLowerCase()))"> -->
        <CommandInput :placeholder="title" class="h-9" v-model="searchTerm" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in computedOptions"
              class="py-1.5 px-3"
              :key="option.value"
              :value="option.label"
              @select="() => handleSelect(option.value)">
              <div
                :class="cn(
                  'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                  selectedValues.has(option.value)
                    ? 'bg-primary text-primary-foreground'
                    : 'opacity-50 [&_svg]:invisible',
                )">
                <Check class="h-4 w-4" />
              </div>
              <component
                v-if="option.icon"
                :is="option.icon"
                class="mr-2 h-4 w-4 text-muted-foreground" />
              <span class="truncate">{{ option.label }}</span>
              <span
                v-if="getOptionCount(option.value) > 0"
                class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                {{ getOptionCount(option.value) }}
              </span>
              <!-- Original
              <span
                v-if="facets?.get(option.value)"
                 class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs"
              >
                {{ facets.get(option.value) }}
              </span>
              -->
            </CommandItem>
          </CommandGroup>
          <template v-if="selectedValues.size > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                :value="'clear-filters'"
                class="justify-center text-center"
                @select="() => { column?.setFilterValue(undefined); searchTerm = '' }"> Clear filters </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
