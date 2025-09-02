<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
      <h2 class="text-2xl font-bold mb-2">Prediksi Kelayakan Bantuan Sosial</h2>
      <p class="opacity-90">Sistem menggunakan metode SMART untuk menentukan kelayakan berdasarkan 4 kriteria utama</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Input Form -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Input Data Warga</h3>
        
        <form @submit.prevent="handlePredict" class="space-y-4">
          <!-- Pendapatan -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <Icon name="lucide:dollar-sign" class="inline w-4 h-4 mr-1" />
              Pendapatan Keluarga (Rp/bulan)
            </label>
            <input
              v-model.number="predictionForm.pendapatan_keluarga"
              type="number"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: 1500000"
              required
            />
          </div>

          <!-- Jumlah Tanggungan -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <Icon name="lucide:users" class="inline w-4 h-4 mr-1" />
              Jumlah Tanggungan
            </label>
            <input
              v-model.number="predictionForm.jumlah_tanggungan"
              type="number"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: 4"
              min="0"
              max="10"
              required
            />
          </div>

          <!-- Kondisi Tempat Tinggal -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <Icon name="lucide:home" class="inline w-4 h-4 mr-1" />
              Kondisi Tempat Tinggal
            </label>
            <select
              v-model="predictionForm.kondisi_tempat_tinggal"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Pilih kondisi tempat tinggal</option>
              <option value="Menumpang">Menumpang</option>
              <option value="Mengontrak">Mengontrak</option>
              <option value="Rumah Sendiri">Rumah Sendiri</option>
            </select>
          </div>

          <!-- Status Pekerjaan -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <Icon name="lucide:briefcase" class="inline w-4 h-4 mr-1" />
              Status Pekerjaan
            </label>
            <select
              v-model="predictionForm.status_pekerjaan"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Pilih status pekerjaan</option>
              <option value="Tidak Bekerja">Tidak Bekerja</option>
              <option value="Buruh Harian">Buruh Harian</option>
              <option value="Wiraswasta">Wiraswasta</option>
              <option value="Swasta">Swasta</option>
              <option value="PNS">PNS</option>
            </select>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-medium transition-all duration-200"
          >
            <Icon v-if="loading" name="lucide:refresh-cw" class="inline w-4 h-4 mr-2 animate-spin" />
            <Icon v-else name="lucide:calculator" class="inline w-4 h-4 mr-2" />
            {{ loading ? 'Memproses...' : 'Prediksi Kelayakan' }}
          </button>
        </form>
      </div>

      <!-- Prediction Result -->
      <div v-if="predictionResult" class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Hasil Prediksi</h3>
        
        <div class="space-y-4">
          <!-- Main Result -->
          <div :class="getResultCardClass(predictionResult.kategori)">
            <div class="flex items-center">
              <Icon :name="getResultIcon(predictionResult.kategori)" class="w-6 h-6 mr-2" />
              <div>
                <h4 class="text-lg font-semibold">{{ predictionResult.kategori }}</h4>
                <p class="text-sm text-gray-600">Skor SMART: {{ predictionResult.smart_score }}/100</p>
              </div>
            </div>
          </div>

          <!-- Detail Scores -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium mb-3 text-gray-800">Detail Penilaian:</h4>
            <div class="space-y-2">
              <div 
                v-for="(value, key) in predictionResult.detail_skor" 
                :key="key"
                class="flex justify-between items-center"
              >
                <span class="capitalize text-sm">{{ getScoreLabel(key) }}:</span>
                <div class="flex items-center">
                  <div class="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      class="bg-blue-500 h-2 rounded-full" 
                      :style="`width: ${value * 100}%`"
                    ></div>
                  </div>
                  <span class="text-sm font-medium">{{ (value * 100).toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Confidence -->
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-center">
              <Icon name="lucide:activity" class="w-5 h-5 text-blue-500 mr-2" />
              <span class="text-sm">
                <strong>Confidence:</strong> {{ (predictionResult.probability * 100).toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApiStore } from '@/stores/api'
import { useNotificationStore } from '@/stores/notification'
import { useAuthStore } from '@/stores/auth'

// Stores
const apiStore = useApiStore()
const notificationStore = useNotificationStore()
const authStore = useAuthStore()

// Reactive data
const loading = ref(false)
const predictionForm = ref({
  pendapatan_keluarga: '',
  jumlah_tanggungan: '',
  kondisi_tempat_tinggal: '',
  status_pekerjaan: ''
})
const predictionResult = ref(null)

// Page meta
definePageMeta({
  title: 'Prediksi Kelayakan'
})

// Methods
const handlePredict = async () => {
  try {
    loading.value = true
    // panggil API dengan token dari authStore
    const result = await apiStore.predict(predictionForm.value, authStore.token)
    predictionResult.value = result
    notificationStore.showNotification('Prediksi berhasil dilakukan!', 'success')
  } catch (error) {
    notificationStore.showNotification(`Error: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

const getResultCardClass = (category) => {
  const baseClass = 'p-4 rounded-lg border-l-4 '
  switch (category) {
    case 'Layak':
      return baseClass + 'bg-green-50 border-green-500'
    case 'Perlu Tinjauan':
      return baseClass + 'bg-yellow-50 border-yellow-500'
    default:
      return baseClass + 'bg-red-50 border-red-500'
  }
}

const getResultIcon = (category) => {
  switch (category) {
    case 'Layak':
      return 'lucide:check-circle'
    case 'Perlu Tinjauan':
      return 'lucide:alert-circle'
    default:
      return 'lucide:x-circle'
  }
}

const getScoreLabel = (key) => {
  const labels = {
    'pendapatan': 'Pendapatan',
    'tanggungan': 'Tanggungan',
    'tempat_tinggal': 'Tempat Tinggal',
    'pekerjaan': 'Pekerjaan'
  }
  return labels[key] || key
}
</script>
