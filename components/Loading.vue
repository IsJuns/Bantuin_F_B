<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg flex items-center">
        <Icon name="lucide:refresh-cw" class="w-6 h-6 animate-spin text-blue-600 mr-3" />
        <span class="text-gray-700 font-medium">Memproses...</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
// This component can be used for global loading states
const loading = ref(false)

// You can make this reactive to global loading state if needed
// const { loading } = storeToRefs(useLoadingStore())
</script>
