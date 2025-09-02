<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue"
import { NuxtLink } from "#components"
import { Home, Users, Settings, BarChart3 } from "lucide-vue-next"

// Props dari parent
const props = defineProps<{ collapsed: boolean }>()
const emit = defineEmits(["update:collapsed"])

const isCollapsed = ref(props.collapsed)
watch(() => props.collapsed, (val) => isCollapsed.value = val)

// toggle sidebar
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  emit("update:collapsed", isCollapsed.value)
}

// daftar menu sidebar
const items = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Input Data Warga", icon: Users, url: "/inputDataWarga" },
  { title: "Output Data Warga", icon: Users, url: "/outputDataWarga" },
  { title: "Analytics", icon: BarChart3, url: "/analytics" },
  { title: "Pengaturan", icon: Settings, url: "/pengaturan" },
]
</script>

<template>
  <!-- Desktop Sidebar -->
  <div
    class="hidden md:flex h-screen bg-white border-r shadow-md flex-col transition-all duration-300 fixed left-0 top-0 z-30"
    :class="[isCollapsed ? 'w-12' : 'w-64']"
  >
    <!-- Tombol collapse -->
    <button
      class="p-2 m-2 rounded hover:bg-gray-100 self-end"
      @click="toggleSidebar"
    >
      <img
        v-if="isCollapsed"
        src="/assets/gambar/fast-forward.png"
        alt="expand"
        class="w-5 h-5"
      />
      <img
        v-else
        src="/assets/gambar/fast-backward.png"
        alt="collapse"
        class="w-5 h-5"
      />
    </button>

    <!-- Menu -->
    <nav class="flex-1">
      <ul>
        <li v-for="item in items" :key="item.title">
          <NuxtLink
            :to="item.url"
            class="flex items-center gap-2 p-3 hover:bg-gray-100"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span v-if="!isCollapsed">{{ item.title }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>

  <!-- Mobile Sidebar -->
  <div class="md:hidden">
    <!-- Tombol buka -->
    <button
      class="p-2 m-2 rounded bg-gray-200"
      @click="isCollapsed = true"
    >
      ☰
    </button>

    <!-- Overlay -->
    <div
      v-if="isCollapsed"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="isCollapsed = false"
    />

    <!-- Drawer -->
    <div
      v-if="isCollapsed"
      class="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 p-4"
    >
      <button
        class="mb-4 p-2 rounded bg-gray-200"
        @click="isCollapsed = false"
      >
        ✖
      </button>

      <ul>
        <li v-for="item in items" :key="item.title">
          <NuxtLink
            :to="item.url"
            class="flex items-center gap-2 p-3 hover:bg-gray-100"
            @click="isCollapsed = false"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.title }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
