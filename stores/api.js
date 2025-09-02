// stores/api.js
import { defineStore } from 'pinia'

export const useApiStore = defineStore('api', () => {
  const config = useRuntimeConfig()
  // gunakan runtime config (dari nuxt.config) — public.apiBase
  const API_BASE = config.public.apiBase || 'http://localhost:8000'

  const apiCall = async (endpoint, method = 'GET', data = null, token = null) => {
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const opts = {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) })
    }

    const res = await fetch(`${API_BASE}${endpoint}`, opts)
    const result = await res.json().catch(() => ({}))
    if (!res.ok) {
      // biarkan caller menangani error
      throw new Error(result.detail || result.message || 'API call failed')
    }
    return result
  }

  // API methods
  const predict = async (data, token = null) => apiCall('/predict/', 'POST', data, token)
  const getCitizens = async (token = null) => apiCall('/citizens/', 'GET', null, token)
  const addCitizen = async (data, token = null) => apiCall('/citizens/', 'POST', data, token)
  const generateDummyData = async (count = 250, token = null) =>
    apiCall(`/generate-data/?count=${count}`, 'POST', null, token)
  const trainModel = async (token = null) => apiCall('/train-model/', 'POST', null, token)
  const getStatistics = async (token = null) => apiCall('/statistics/', 'GET', null, token)
  const getModelAccuracy = async (token = null) => apiCall('/model-accuracy/', 'GET', null, token)

  return {
    predict,
    getCitizens,
    addCitizen,
    generateDummyData,
    trainModel,
    getStatistics,
    getModelAccuracy
  }
})
