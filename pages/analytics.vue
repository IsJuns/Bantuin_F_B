<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl">
      <h2 class="text-2xl font-bold mb-2">Analytics & Performance</h2>
      <p class="opacity-90">Statistik data dan performa model machine learning</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Statistics Card -->
      <div v-if="statistics" class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Statistik Data</h3>
        
        <div class="space-y-4">
          <!-- Overview Stats -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-blue-600">{{ statistics.total_data }}</div>
              <div class="text-sm text-gray-600">Total Data</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-green-600">
                {{ statistics.smart_score_statistics?.mean?.toFixed(1) }}
              </div>
              <div class="text-sm text-gray-600">Rata-rata Skor</div>
            </div>
          </div>

          <!-- Category Distribution -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium mb-3">Distribusi Kategori:</h4>
            <div class="space-y-2">
              <div 
                v-for="(count, category) in statistics.category_distribution" 
                :key="category"
                class="flex justify-between items-center"
              >
                <span class="flex items-center">
                  <Icon :name="getCategoryIcon(category)" class="w-4 h-4 mr-1" :class="getCategoryIconClass(category)" />
                  {{ category }}
                </span>
                <span class="font-medium">{{ count }}</span>
              </div>
            </div>
          </div>

          <!-- Income Statistics -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium mb-3">Statistik Pendapatan:</h4>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>Rata-rata: <span class="font-medium">Rp {{ formatCurrency(statistics.income_statistics?.mean) }}</span></div>
              <div>Median: <span class="font-medium">Rp {{ formatCurrency(statistics.income_statistics?.median) }}</span></div>
              <div>Minimum: <span class="font-medium">Rp {{ formatCurrency(statistics.income_statistics?.min) }}</span></div>
              <div>Maksimum: <span class="font-medium">Rp {{ formatCurrency(statistics.income_statistics?.max) }}</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Model Performance Card -->
      <div v-if="modelAccuracy" class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Model Performance</h3>
        
        <div class="space-y-4">
          <!-- Accuracy -->
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600">
              {{ (modelAccuracy.accuracy * 100).toFixed(2) }}%
            </div>
            <div class="text-sm text-gray-600">Model Accuracy</div>
          </div>

          <!-- Confusion Matrix -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium mb-3">Confusion Matrix:</h4>
            <div class="grid grid-cols-3 gap-1 text-xs">
              <template v-for="(row, i) in modelAccuracy.confusion_matrix" :key="i">
                <div 
                  v-for="(cell, j) in row" 
                  :key="`${i}-${j}`"
                  class="bg-white p-2 text-center border rounded"
                >
                  {{ cell }}
                </div>
              </template>
            </div>
            <div class="text-xs text-gray-500 mt-2">
              Baris: Actual, Kolom: Predicted
            </div>
          </div>

          <!-- Model Info -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center justify-between">
              <span class="text-sm">Total Data:</span>
              <span class="font-medium">{{ modelAccuracy.data_count }}</span>
            </div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-sm">Status Model:</span>
              <span class="text-green-600 font-medium capitalize">{{ modelAccuracy.model_status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!statistics" class="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center">
        <div class="text-center text-gray-500">
          <Icon name="lucide:bar-chart-3" class="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Belum ada data statistik</p>
          <p class="text-sm">Generate data terlebih dahulu</p>
        </div>
      </div>

      <div v-if="!modelAccuracy" class="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center">
        <div class="text-center text-gray-500">
          <Icon name="lucide:trending-up" class="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Model belum dilatih</p>
          <p class="text-sm">Latih model terlebih dahulu</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApiStore } from '~/stores/api'
import { useNotificationStore } from '~/stores/notification'

// Page meta
definePageMeta({
  title: 'Analytics'
})

// Stores
const apiStore = useApiStore()
const notificationStore = useNotificationStore()

// Reactive data
const statistics = ref(null)
const modelAccuracy = ref(null)

// Methods
const fetchStatistics = async () => {
  try {
    const result = await apiStore.getStatistics()
    statistics.value = result
  } catch (error) {
    notificationStore.showNotification(`Error: ${error.message}`, 'error')
  }
}

const fetchModelAccuracy = async () => {
  try {
    const result = await apiStore.getModelAccuracy()
    if (result.model_status === 'trained') {
      modelAccuracy.value = result
    }
  } catch (error) {
    console.log('Model not trained yet')
  }
}

const formatCurrency = (amount) => {
  if (!amount) return '0'
  return new Intl.NumberFormat('id-ID').format(amount)
}

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Layak':
      return 'lucide:check-circle'
    case 'Perlu Tinjauan':
      return 'lucide:alert-circle'
    default:
      return 'lucide:x-circle'
  }
}

const getCategoryIconClass = (category) => {
  switch (category) {
    case 'Layak':
      return 'text-green-500'
    case 'Perlu Tinjauan':
      return 'text-yellow-500'
    default:
      return 'text-red-500'
  }
}

// Load data on mount
onMounted(() => {
  fetchStatistics()
  fetchModelAccuracy()
})
</script>