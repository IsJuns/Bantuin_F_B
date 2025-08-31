<script setup lang="ts">
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar.vue"
</script>

<template>
  <NuxtLayout>
    <SidebarProvider>
      <!-- Sidebar -->
      <AppSidebar />

      <!-- Main content -->
      <div class="flex-1">
        <NuxtPage />
      </div>
    </SidebarProvider>
  </NuxtLayout>
</template>
