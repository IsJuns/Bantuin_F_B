<template>
  <div class="max-w-md mx-auto mt-20">
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Login</h2>
      <form @submit.prevent="doLogin" class="space-y-3">
        <input v-model="form.email" type="email" placeholder="Email" class="w-full p-2 border rounded" required />
        <input v-model="form.password" type="password" placeholder="Password" class="w-full p-2 border rounded" required />
        <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded">
          {{ loading ? 'Memproses...' : 'Login' }}
        </button>
      </form>
      <p class="text-sm text-gray-500 mt-3">Test user: register via API or UI registration</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notification'

const auth = useAuthStore()
const notif = useNotificationStore()
const router = useRouter()
const form = reactive({ email: '', password: '' })
const loading = ref(false)

const doLogin = async () => {
  try {
    loading.value = true
    await auth.login(form)
    notif.showNotification('Login sukses', 'success')
    router.push('/') // redirect ke dashboard
  } catch (e) {
    notif.showNotification(e.message || 'Login gagal', 'error')
  } finally {
    loading.value = false
  }
}
</script>
