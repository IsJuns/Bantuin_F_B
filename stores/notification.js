// stores/notification.js
import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notification = ref(null)

  const showNotification = (message, type = 'success') => {
    notification.value = { message, type }
    setTimeout(() => {
      notification.value = null
    }, 5000)
  }

  return {
    notification: readonly(notification),
    showNotification
  }
})
