import { h } from 'vue'
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

function separateTitle(title: string) {
  const pattern = new RegExp(
    "^(.+?)\\s+by\\s+(.+?)\\s+(\\d{1,3}(?:,\\d{3})*|\\d+)\\s+views\\s+(?:.*?\\s+ago\\s+)?(.+)$"
  );
  const match = title.match(pattern);

  if (match) {
    return {
      title: match[1].trim(),
      channel: match[2].trim(),
      views: match[3].replace(",", ""), // Store views as plain number string
      duration: match[4].trim(),
    };
  } else {
    return {
      title: title,
      channel: null,
      views: null,
      duration: null,
    };
  }
}

function separateTitle1(title: string) {
  // First, remove the "ago" part and anything after it
  const titleWithoutAgo = title.replace(/(\d+ (second|minute|hour|day|week|month|year)s? ago.*)/i, '').trim();

  // Check if the title contains "by" to separate title and creator
  if (titleWithoutAgo.includes(' by ')) {
    const parts = titleWithoutAgo.split(' by ');
    const videoTitle = parts[0].trim();
    const creatorInfo = parts[1].trim();

    // Further split creator info to get creator name, views, and duration
    const creatorParts = creatorInfo.split(/(\d+,\d+|\d+) views/i); // Splits by views count
    console.log(creatorParts)
    const creatorName = creatorParts[0].trim();
    const viewsAndDuration = creatorParts[1] ? creatorParts[1].trim() : '';

    let views = '';
    let duration = '';
    console.log(viewsAndDuration)

    if (viewsAndDuration) {
      const viewsMatch = creatorInfo.match(/(\d+,\d+|\d+) views/i);
      if (viewsMatch) {
        views = viewsMatch[0];
        const durationMatch = viewsAndDuration.replace(views, '').trim();
        duration = durationMatch;
      }
    }

    return {
      videoTitle,
      creatorName,
      views,
      duration,
    };
  } else {
    // If "by" is not found, return the original title as videoTitle
    return {
      videoTitle: titleWithoutAgo,
      creatorName: null,
      views: null,
      duration: null,
    };
  }
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
    header: () => h('div', { class: 'text-center' }, 'Thumbnail'),
    cell: ({ row }) => h('a', {
      href: createYoutubeLink(row.original.video_id), // Link to video
      target: '_blank',
      rel: 'noopener noreferrer',
    }, h('img', {
      src: row.getValue('thumbnail_url'),
      alt: `Thumbnail for ${row.original.title}`,
      class: 'w-24 h-auto object-cover rounded block mx-auto',
      loading: 'lazy',
    })),
    enableSorting: false,
    enableHiding: true,
  },

  // --- Title Column ---
  {
    accessorKey: 'title',
    header: ({ column }) => h(DataTableColumnHeader, { column: column as Column<unknown, unknown>, title: 'Title' }),
    cell: ({ row }) => {
      const s = separateTitle(row.getValue('title'));
      return h('a', {
        href: createYoutubeLink(row.original.video_id),
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'overflow-hidden hover:underline w-max break-words h-12',
        title: row.getValue('title'),
      }, [
        h('p', {
          class: 'line-clamp-1 max-w-xs font-medium',
        }, s.title),
        h('p', {
          class: 'line-clamp-1 max-w-xs text-xs mt-0.5',
        }, [
          h(Badge, { variant: 'outline', size: 'sm' }, s.channel || ''),
          h('span', '  '),
          h('span', s.views || ''),
          h('span', ' | '),
          h('span', s.duration || '')
        ]),
      ])
    },
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string).toLowerCase().includes(String(value).toLowerCase());
    },
    enableSorting: true,
    enableHiding: true,
  },

  // --- Length Column ---
  {
    accessorKey: 'length',
    header: ({ column }) => h(DataTableColumnHeader, { column: column as Column<unknown, unknown>, title: 'Length' }),
    cell: ({ row }) => h('div', { class: 'w-20 text-right tabular-nums pr-2 font-mono' }, row.getValue('length')),
    enableSorting: true,
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
