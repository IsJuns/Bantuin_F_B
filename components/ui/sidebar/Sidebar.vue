<script setup lang="ts">
import { computed } from 'vue'
import type { SidebarProps } from '.'
import { cn as _cn } from '@/lib/utils'               // pakai alias aman
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { SIDEBAR_WIDTH_MOBILE, useSidebar } from './utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SidebarProps>(), {
  side: 'left',
  variant: 'sidebar',
  collapsible: 'offcanvas',
})

const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

// ---- KELAS via computed (hindari panggil fungsi di template) ----
const klassNone = computed(() =>
  _cn(
    'flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground',
    props.class
  )
)

const gapClass = computed(() =>
  _cn(
    'duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear',
    'group-data-[collapsible=offcanvas]:w-0',
    'group-data-[side=right]:rotate-180',
    (props.variant === 'floating' || props.variant === 'inset')
      ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
      : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]'
  )
)

const containerClass = computed(() =>
  _cn(
    'duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex',
    props.side === 'left'
      ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
      : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
    (props.variant === 'floating' || props.variant === 'inset')
      ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
      : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l',
    props.class
  )
)
</script>

<template>
  <!-- gunakan props.xxx eksplisit -->
  <div v-if="props.collapsible === 'none'" :class="klassNone" v-bind="$attrs">
    <slot />
  </div>

  <Sheet
    v-else-if="isMobile"
    :open="openMobile"
    v-bind="$attrs"
    @update:open="setOpenMobile"
  >
    <SheetContent
      data-sidebar="sidebar"
      data-mobile="true"
      :side="props.side"
      class="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
      :style="{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE }"
    >
      <div class="flex h-full w-full flex-col">
        <slot />
      </div>
    </SheetContent>
  </Sheet>

  <div
    v-else
    class="group peer hidden md:block"
    :data-state="state"
    :data-collapsible="state === 'collapsed' ? props.collapsible : ''"
    :data-variant="props.variant"
    :data-side="props.side"
  >
    <!-- gap handler -->
    <div :class="gapClass" />
    <div :class="containerClass" v-bind="$attrs">
      <div
        data-sidebar="sidebar"
        class="flex h-full w-full flex-col text-sidebar-foreground bg-sidebar
               group-data-[variant=floating]:rounded-lg
               group-data-[variant=floating]:border
               group-data-[variant=floating]:border-sidebar-border
               group-data-[variant=floating]:shadow"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
