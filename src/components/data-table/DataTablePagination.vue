<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import { computed, onMounted, onUnmounted } from 'vue'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DataTablePaginationProps {
  table: Table<TData>
}

const props = defineProps<DataTablePaginationProps>()

const pageSize = computed({
  get: () => props.table.getState().pagination.pageSize,
  set: value => props.table.setPageSize(Number(value)),
})

const pageIndex = computed(() => props.table.getState().pagination.pageIndex)
const pageCount = computed(() => props.table.getPageCount())
const canPreviousPage = computed(() => props.table.getCanPreviousPage())
const canNextPage = computed(() => props.table.getCanNextPage())
const selectedRowCount = computed(() => props.table.getFilteredSelectedRowModel().rows.length)
const totalRowCount = computed(() => props.table.getFilteredRowModel().rows.length)

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === '[') {
    if (canPreviousPage.value) {
      props.table.previousPage();
    }
  } else if (event.key === ']') {
    if (canNextPage.value) props.table.nextPage()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

</script>
<template>
  <div class="flex items-center justify-between px-2 w-full overflow-x-auto no-scrollbar">
    <!-- Selected -->
    <div class="flex-1 text-sm text-muted-foreground whitespace-nowrap">
      {{ selectedRowCount }} of {{ totalRowCount }} row(s)<span class="lg:inline hidden"> selected</span>.
    </div>
    <!-- Pagination controls container -->
    <div class="flex items-center flex-1 justify-end overflow-x-auto relative no-scrollbar">
      <div class="flex items-center space-x-6 lg:space-x-8 min-w-[500px] justify-end">
        <!-- Rows per page -->
        <div class="flex items-center space-x-2">
          <p class="text-sm font-medium whitespace-nowrap"> Rows <span class="hidden sm:inline">per page</span>
          </p>
          <Select :model-value="`${pageSize}`" @update:model-value="pageSize = $event === null ? 10 : Number($event)">
            <SelectTrigger class="h-8 w-[70px]">
              <SelectValue :placeholder="`${pageSize}`" />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem
                v-for="size in [10, 20, 30, 40, 50]"
                :key="size"
                :value="`${size}`">
                {{ size }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <!-- Page number display -->
        <div class="flex w-[100px] items-center justify-center text-sm font-medium whitespace-nowrap"> Page
          {{ pageIndex + 1 }} of {{ pageCount <= 0 ? 1 : pageCount }}
        </div>
        <!-- Page controls -->
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            class="hidden h-8 w-8 p-0 lg:flex"
            :disabled="!canPreviousPage"
            @click="table.setPageIndex(0)">
            <span class="sr-only">Go to first page</span>
            <ChevronsLeft class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            class="h-8 w-8 p-0"
            :disabled="!canPreviousPage"
            @click="table.previousPage()">
            <span class="sr-only">Go to previous page</span>
            <ChevronLeft class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            class="h-8 w-8 p-0"
            :disabled="!canNextPage"
            @click="table.nextPage()">
            <span class="sr-only">Go to next page</span>
            <ChevronRight class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            class="hidden h-8 w-8 p-0 lg:flex"
            :disabled="!canNextPage"
            @click="table.setPageIndex(pageCount - 1)">
            <span class="sr-only">Go to last page</span>
            <ChevronsRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
