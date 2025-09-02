<script setup lang="ts">
import { ref } from "vue"
import AppSidebar from "@/components/AppSidebar.vue"

// state sidebar disimpan di layout
const isCollapsed = ref(false)
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <ClientOnly>
      <AppSidebar v-model:collapsed="isCollapsed" />
    </ClientOnly>

    <!-- Main content -->
    <main
      class="flex-1 bg-gray-100 p-6 transition-all duration-300"
      :class="isCollapsed ? 'ml-12' : 'ml-64'"
    >
      <slot />
    </main>
  </div>
</template>
