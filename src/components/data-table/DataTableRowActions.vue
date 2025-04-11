<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { VideoMetadata } from '@/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface DataTableRowActionsProps {
  row: Row<VideoMetadata>
}

const props = defineProps<DataTableRowActionsProps>()

</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
        <Icon icon="radix-icons:dots-horizontal" class="h-4 w-4" />
        <span class="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[160px]">
      <DropdownMenuItem>Go To Video</DropdownMenuItem>
      <DropdownMenuItem>Go To Channel</DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <span>Categories</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <span>1</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>2</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span>3</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
