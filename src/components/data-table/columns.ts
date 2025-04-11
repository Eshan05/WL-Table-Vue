import { h, type Component } from 'vue'
import type { Column, ColumnDef } from '@tanstack/vue-table'
import type { VideoMetadata } from '@/types'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

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

export const columns: ColumnDef<VideoMetadata>[] = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'checked': table.getIsAllPageRowsSelected()
        ? true
        : table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : false,
      'onUpdate:checked': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
      'aria-label': 'Select all',
      'class': 'flex items-center justify-center mr-2',
    }),
    cell: ({ row }) => h(Checkbox, {
      'checked': row.getIsSelected(),
      'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
      'aria-label': 'Select row',
      'class': 'flex items-center justify-center mr-2',
    }),
    enableSorting: false,
    enableHiding: false,
  },

  // --- Thumbnail Column ---
  {
    accessorKey: 'thumbnail_url',
    header: () => h('div', { class: 'text-center' }, 'Thumbnail'), // Simple header
    cell: ({ row }) => h('a', {
      href: createYoutubeLink(row.original.video_id), // Link to video
      target: '_blank',
      rel: 'noopener noreferrer',
    }, h('img', {
      src: row.getValue('thumbnail_url'),
      alt: `Thumbnail for ${row.original.title}`,
      class: 'w-24 h-auto object-cover rounded block mx-auto', // Centered image
      loading: 'lazy', // Lazy load thumbnails
    })),
    enableSorting: false, // Usually don't sort by thumbnail
    enableHiding: true,  // Allow hiding
  },

  // --- Title Column ---
  {
    accessorKey: 'title',
    // Use DataTableColumnHeader for sorting capabilities
    header: ({ column }) => h(DataTableColumnHeader, { column: column as Column<unknown, unknown>, title: 'Title' }),
    cell: ({ row }) => {
      return h('a', {
        href: createYoutubeLink(row.original.video_id),
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'block max-w-xs font-medium hover:underline line-clamp-3',
        title: row.getValue('title'),
      },
        row.getValue('title')
      )
    },
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string).toLowerCase().includes(String(value).toLowerCase());
    },
    enableSorting: true,
    enableHiding: false,
  },

  // --- Length Column ---
  {
    accessorKey: 'length',
    header: ({ column }) => h(DataTableColumnHeader, { column: column as Column<unknown, unknown>, title: 'Length' }),
    cell: ({ row }) => h('div', { class: 'w-20 text-right tabular-nums pr-2 font-mono' }, row.getValue('length')),
    enableSorting: true,
    sortingFn: 'basic',
    enableMultiSort: true,
  },

  // --- Categories Column ---
  {
    accessorKey: 'categories',
    header: ({ column }) => h(DataTableColumnHeader, { column: column as Column<unknown, unknown>, title: 'Categories' }),
    cell: ({ row }) => {
      const categories = row.getValue('categories') as string[] || [];
      if (!categories.length) return h('span', { class: 'text-muted-foreground' }, 'N/A');
      return h('div', { class: 'flex flex-wrap gap-1.5' },
        categories.map(category => h(Badge, { variant: 'secondary' }, () => category))
      );
    },
    filterFn: (row, id, value) => {
      const rowValues = row.getValue(id) as string[] || [];
      const filterValues = value as string[];
      if (!filterValues || filterValues.length === 0) return true;
      return filterValues.some(filterVal => rowValues.includes(filterVal));
    },
    enableSorting: false,
  },
  {
    accessorKey: 'topics',
    header: ({ column }) => h(DataTableColumnHeader, { column: column as Column<unknown, unknown>, title: 'Topics' }),
    cell: ({ row }) => {
      const topics = row.getValue('topics') as string[] || [];
      if (!topics.length) return h('span', { class: 'text-muted-foreground' }, 'N/A');
      return h('div', { class: 'flex flex-wrap gap-1.5' },
        topics.map(topic => h(Badge, { variant: 'outline' }, () => topic))
      );
    },
    filterFn: (row, id, value) => {
      const rowValues = row.getValue(id) as string[] || [];
      const filterValues = value as string[];
      if (!filterValues || filterValues.length === 0) return true;
      return filterValues.some(filterVal => rowValues.includes(filterVal));
    },
    enableSorting: false,
  },
  // --- Channel Column ---
  {
    accessorKey: 'channel_url',
    header: ({ column }) => h(DataTableColumnHeader, { column: column as Column<unknown, unknown>, title: 'Channel' }),
    cell: ({ row }) => {
      const url = row.getValue('channel_url') as string;
      const potentialName = url ? url.substring(url.lastIndexOf('/') + 1) : 'Unknown Channel';
      const displayName = potentialName.startsWith('@') ? potentialName : potentialName;

      return h('a', {
        href: createChannelLink(url),
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'text-blue-600 hover:underline truncate block max-w-[150px]',
        title: displayName,
      }, displayName)
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
    enableSorting: false,
    enableHiding: false,
  },
]
