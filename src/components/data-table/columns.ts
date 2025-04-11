import { h, type Component } from 'vue' // Import h and Component
import type { Column, ColumnDef } from '@tanstack/vue-table'
import type { VideoMetadata } from '@/types' // Adjust the path

// --- Import necessary UI components ---
import { Badge } from '@/components/ui/badge' // Assuming ShadCN-Vue setup
import { Checkbox } from '@/components/ui/checkbox'
// Assuming you have these components adapted from the React versions earlier
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'
// Import or define DataTableRowActions if you need it
// import DataTableRowActions from './DataTableRowActions.vue'

// --- Helper function to create YouTube links ---
const createYoutubeLink = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;
const createChannelLink = (channelUrl: string) => {
  // Basic check if it's a handle or legacy URL
  if (channelUrl && !channelUrl.startsWith('/channel/')) {
    return `https://www.youtube.com${channelUrl}`; // Assumes handle like /@Handle
  } else if (channelUrl) {
    return `https://www.youtube.com${channelUrl}`; // Assumes /channel/ID
  }
  return '#'; // Fallback
}

export const columns: ColumnDef<VideoMetadata>[] = [
  // --- Selection Column (Generally useful, keep as is) ---
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
      'class': 'translate-y-[2px]', // Minor style adjustment often needed
    }),
    cell: ({ row }) => h(Checkbox, {
      'checked': row.getIsSelected(),
      'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
      'aria-label': 'Select row',
      'class': 'translate-y-[2px]',
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
        class: 'block max-w-md font-medium hover:underline', // Added link & styling
        title: row.getValue('title'), // Full title on hover
      },
        // Display a shortened version or handle long titles
        row.getValue('title') // For now display full title, can truncate later
      )
    },
    // Enable filtering on the title column
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string).toLowerCase().includes(String(value).toLowerCase());
    },
  },

  // --- Length Column ---
  {
    accessorKey: 'length',
    header: ({ column }) => h(DataTableColumnHeader, { column: column as Column<unknown, unknown>, title: 'Length' }),
    cell: ({ row }) => h('div', { class: 'w-20 text-right tabular-nums pr-2' }, row.getValue('length')), // Right align, tabular nums for time
    enableSorting: true, // You might want to sort by length (needs custom sort function for time)
    // Basic sorting will be alphabetical, for proper time sorting:
    sortingFn: 'basic', // Replace with custom time sort if needed
  },

  // --- Categories Column ---
  {
    accessorKey: 'categories',
    header: ({ column }) => h(DataTableColumnHeader, { column: column as Column<unknown, unknown>, title: 'Categories' }),
    cell: ({ row }) => {
      const categories = row.getValue('categories') as string[] || []; // Handle potential undefined
      if (!categories.length) return h('span', { class: 'text-muted-foreground' }, 'N/A');

      // Render categories as badges
      return h('div', { class: 'flex flex-wrap gap-1' },
        categories.map(category => h(Badge, { variant: 'secondary' }, () => category))
      );
    },
    // Enable filtering using the faceted filter component logic
    filterFn: (row, id, value) => {
      const rowValues = row.getValue(id) as string[] || [];
      const filterValues = value as string[]; // Value from faceted filter is an array
      if (!filterValues || filterValues.length === 0) return true; // No filter applied
      // Check if any of the row's categories are included in the selected filter values
      return filterValues.some(filterVal => rowValues.includes(filterVal));
    },
    enableSorting: false, // Sorting arrays is complex, usually disable
  },

  // --- Topics Column (Similar to Categories) ---
  {
    accessorKey: 'topics',
    header: ({ column }) => h(DataTableColumnHeader, { column: column as Column<unknown, unknown>, title: 'Topics' }),
    cell: ({ row }) => {
      const topics = row.getValue('topics') as string[] || []; // Handle potential undefined
      if (!topics.length) return h('span', { class: 'text-muted-foreground' }, 'N/A');

      // Render topics as badges (maybe different variant)
      return h('div', { class: 'flex flex-wrap gap-1' },
        topics.map(topic => h(Badge, { variant: 'outline' }, () => topic))
      );
    },
    // Enable filtering using the faceted filter component logic
    filterFn: (row, id, value) => {
      const rowValues = row.getValue(id) as string[] || [];
      const filterValues = value as string[]; // Value from faceted filter is an array
      if (!filterValues || filterValues.length === 0) return true; // No filter applied
      // Check if any of the row's topics are included in the selected filter values
      return filterValues.some(filterVal => rowValues.includes(filterVal));
    },
    enableSorting: false, // Sorting arrays is complex, usually disable
  },

  // --- Channel Column ---
  {
    accessorKey: 'channel_url',
    header: ({ column }) => h(DataTableColumnHeader, { column: column as Column<unknown, unknown>, title: 'Channel' }),
    cell: ({ row }) => {
      const url = row.getValue('channel_url') as string;
      // Attempt to extract a readable name from the URL (@handle or last part)
      const potentialName = url ? url.substring(url.lastIndexOf('/') + 1) : 'Unknown Channel';
      const displayName = potentialName.startsWith('@') ? potentialName : potentialName; // Use handle if present

      return h('a', {
        href: createChannelLink(url),
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'text-blue-600 hover:underline truncate block max-w-[150px]', // Link style + truncate
        title: displayName, // Show name on hover
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
