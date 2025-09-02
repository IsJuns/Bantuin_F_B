// stores/auth.js
import { defineStore } from 'pinia'
import CryptoJS from 'crypto-js'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()
  const SECRET = config.public.encryptionKey || 'devkey_please_change'

  const user = ref(null)
  const token = ref(null)

  function saveEncryptedToken(t) {
    try {
      const cipher = CryptoJS.AES.encrypt(t, SECRET).toString()
      localStorage.setItem('app_token', cipher)
    } catch (e) {
      localStorage.setItem('app_token', t)
    }
  }

  function loadTokenFromStorage() {
    const stored = localStorage.getItem('app_token')
    if (!stored) return null
    try {
      const bytes = CryptoJS.AES.decrypt(stored, SECRET)
      const original = bytes.toString(CryptoJS.enc.Utf8)
      return original || stored
    } catch (e) {
      return stored
    }
  }

  async function login(credentials) {
    const API_BASE = config.public.apiBase || ''
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    if (!res.ok) {
      const err = await res.json().catch(()=>({detail:res.statusText}))
      throw new Error(err.detail || 'Login failed')
    }
    const data = await res.json()
    token.value = data.token
    user.value = data.user || null
    saveEncryptedToken(token.value)
    return data
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('app_token')
  }

  function initFromStorage() {
    const t = loadTokenFromStorage()
    if (t) token.value = t
  }

  return { user, token, login, logout, initFromStorage }
})
