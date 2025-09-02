<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform opacity-0 translate-y-2"
    enter-to-class="transform opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform opacity-100 translate-y-0"
    leave-to-class="transform opacity-0 translate-y-2"
  >
    <div 
      v-if="notification" 
      :class="notificationClass"
      class="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 text-white"
    >
      <div class="flex items-center">
        <Icon :name="notificationIcon" class="w-5 h-5 mr-2" />
        {{ notification.message }}
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useNotificationStore } from '~/stores/notification'

const notificationStore = useNotificationStore()
const { notification } = storeToRefs(notificationStore)

const notificationClass = computed(() => {
  return notification.value?.type === 'success' ? 'bg-green-500' : 'bg-red-500'
})

const notificationIcon = computed(() => {
  return notification.value?.type === 'success' ? 'lucide:check-circle' : 'lucide:x-circle'
})
</script>
