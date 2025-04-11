<script setup lang="ts">
import { computed } from 'vue'
import type { Table } from '@tanstack/vue-table'
import type { VideoMetadata } from '@/types'
import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { Icon } from '@iconify/vue'

import DataTableFacetedFilter from './DataTableFacetedFilter.vue'
import DataTableViewOptions from './DataTableViewOptions.vue'

import categories from '../../data/categoryOptions.json'
import topics from '../../data/topicOptions.json'

interface DataTableToolbarProps {
  table: Table<VideoMetadata>
}

const props = defineProps<DataTableToolbarProps>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)
</script>
<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 items-center space-x-2">
      <Input
        placeholder="Filter videos..."
        :model-value="(table.getColumn('title')?.getFilterValue() as string) ?? ''"
        class="h-8 w-[150px] lg:w-[250px]"
        @input="table.getColumn('title')?.setFilterValue($event.target.value)" />
      <Input
        placeholder="Filter channels..."
        :model-value="(table.getColumn('channel_url')?.getFilterValue() as string) ?? ''"
        class="h-8 w-[150px] lg:w-[250px]"
        @input="table.getColumn('channel_url')?.setFilterValue($event.target.value)" />
      <DataTableFacetedFilter
        v-if="table.getColumn('categories')"
        :column="table.getColumn('categories')"
        title="Categories"
        :options="categories" />
      <DataTableFacetedFilter
        v-if="table.getColumn('topics')"
        :column="table.getColumn('topics')"
        title="Topics"
        :options="topics" />
      <Button
        v-if="isFiltered"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="table.resetColumnFilters()"> Reset
        <Icon icon="radix-icons:sun"
          class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      </Button>
    </div>
    <DataTableViewOptions :table="table" />
  </div>
</template>
