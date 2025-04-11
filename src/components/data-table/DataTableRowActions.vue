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
  DropdownMenuSubItem,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface DataTableRowActionsProps {
  row: Row<VideoMetadata>
}

const props = defineProps<DataTableRowActionsProps>()
const row = computed(() => props.row)
// console.log(row.value.original)

// --- Helper function to create YouTube links ---
const createYoutubeLink = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;
const createChannelLink = (channelUrl: string) => {
  if (channelUrl && !channelUrl.startsWith('/channel/')) {
    return `https://www.youtube.com${channelUrl}`; // Assumes handle like /@Handle
  } else if (channelUrl) {
    return `https://www.youtube.com${channelUrl}`; // Assumes /channel/ID
  }
  return '#';
}

const video = row.value.original

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
      <DropdownMenuItem><a class="w-full" :href="createYoutubeLink(video.video_id)">Go To Video</a></DropdownMenuItem>
      <DropdownMenuItem><a class="w-full" :href="createChannelLink(video.channel_url)">Go To Channel</a>
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <span>Categories</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent v-if="Array.isArray(video.categories)">
            <DropdownMenuItem v-for="category in video.categories" :key="category">
              {{ category }}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <span>Topics</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent v-if="Array.isArray(video.topics)">
            <DropdownMenuItem v-for="topic in video.topics" :key="topic">
              {{ topic }}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
