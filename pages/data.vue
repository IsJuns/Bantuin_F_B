<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-xl">
      <h2 class="text-2xl font-bold mb-2">Manajemen Data</h2>
      <p class="opacity-90">Kelola data warga dan generate data untuk training model</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Sidebar Actions -->
      <div class="lg:col-span-1 space-y-4">
        <!-- Actions Card -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-800">Actions</h3>
          <div class="space-y-3">
            <button
              @click="generateDummyData"
              :disabled="loading"
              class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              <Icon name="lucide:database" class="inline w-4 h-4 mr-2" />
              Generate 250 Data
            </button>
            <button
              @click="trainModel"
              :disabled="loading"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              <Icon name="lucide:trending-up" class="inline w-4 h-4 mr-2" />
              Train Model ML
            </button>
          </div>
        </div>

        <!-- Add Citizen Form -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-800">Tambah Data Warga</h3>
          <form @submit.prevent="addCitizen" class="space-y-3">
            <input
              v-model="citizenForm.nama"
              type="text"
              placeholder="Nama lengkap"
              class="w-full p-2 border border-gray-300 rounded-lg text-sm"
              required
            />
            <input
              v-model="citizenForm.alamat"
              type="text"
              placeholder="Alamat"
              class="w-full p-2 border border-gray-300 rounded-lg text-sm"
              required
            />
            <input
              v-model.number="citizenForm.pendapatan_keluarga"
              type="number"
              placeholder="Pendapatan (Rp)"
              class="w-full p-2 border border-gray-300 rounded-lg text-sm"
              required
            />
            <input
              v-model.number="citizenForm.jumlah_tanggungan"
              type="number"
              placeholder="Jumlah tanggungan"
              class="w-full p-2 border border-gray-300 rounded-lg text-sm"
              min="0"
              max="10"
              required
            />
            <select
              v-model="citizenForm.kondisi_tempat_tinggal"
              class="w-full p-2 border border-gray-300 rounded-lg text-sm"
              required
            >
              <option value="">Tempat tinggal</option>
              <option value="Menumpang">Menumpang</option>
              <option value="Mengontrak">Mengontrak</option>
              <option value="Rumah Sendiri">Rumah Sendiri</option>
            </select>
            <select
              v-model="citizenForm.status_pekerjaan"
              class="w-full p-2 border border-gray-300 rounded-lg text-sm"
              required
            >
              <option value="">Status pekerjaan</option>
              <option value="Tidak Bekerja">Tidak Bekerja</option>
              <option value="Buruh Harian">Buruh Harian</option>
              <option value="Wiraswasta">Wiraswasta</option>
              <option value="Swasta">Swasta</option>
              <option value="PNS">PNS</option>
            </select>
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium text-sm"
            >
              <Icon name="lucide:user" class="inline w-4 h-4 mr-1" />
              Tambah Warga
            </button>
          </form>
        </div>
      </div>

      <!-- Citizens Data List -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-800">
            Data Warga ({{ citizensData.length }})
          </h3>
          
          <div class="max-h-96 overflow-y-auto">
            <div v-if="citizensData.length > 0" class="space-y-2">
              <div 
                v-for="(citizen, index) in displayedCitizens" 
                :key="index"
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm"
              >
                <div>
                  <div class="font-medium">{{ citizen.nama }}</div>
                  <div class="text-gray-600 text-xs">{{ citizen.alamat }}</div>
                </div>
                <div class="text-right text-xs">
                  <div>Rp {{ formatCurrency(citizen.pendapatan_keluarga) }}</div>
                  <div class="text-gray-600">{{ citizen.jumlah_tanggungan }} tanggungan</div>
                </div>
              </div>
              
              <div v-if="citizensData.length > 50" class="text-center text-gray-500 text-sm py-2">
                ... dan {{ citizensData.length - 50 }} data lainnya
              </div>
            </div>
            
            <div v-else class="text-center text-gray-500 py-8">
              <Icon name="lucide:database" class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Belum ada data. Generate data dummy atau tambah manual.</p>
            </div>
          </div>
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
  title: 'Data Management'
})

// Stores
const apiStore = useApiStore()
const notificationStore = useNotificationStore()

// Reactive data
const loading = ref(false)
const citizensData = ref([])
const citizenForm = ref({
  nama: '',
  alamat: '',
  pendapatan_keluarga: '',
  jumlah_tanggungan: '',
  kondisi_tempat_tinggal: '',
  status_pekerjaan: ''
})

// Computed
const displayedCitizens = computed(() => citizensData.value.slice(0, 50))

// Methods
const generateDummyData = async () => {
  try {
    loading.value = true
    await apiStore.generateDummyData(250)
    notificationStore.showNotification('250 data dummy berhasil dibuat!', 'success')
    await fetchCitizensData()
  } catch (error) {
    notificationStore.showNotification(`Error: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

const trainModel = async () => {
  try {
    loading.value = true
    const result = await apiStore.trainModel()
    const accuracy = (result.results.accuracy * 100).toFixed(2)
    notificationStore.showNotification(`Model berhasil dilatih! Akurasi: ${accuracy}%`, 'success')
  } catch (error) {
    notificationStore.showNotification(`Error: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

const addCitizen = async () => {
  try {
    loading.value = true
    await apiStore.addCitizen(citizenForm.value)
    notificationStore.showNotification('Data warga berhasil ditambahkan!', 'success')
    
    // Reset form
    citizenForm.value = {
      nama: '', alamat: '', pendapatan_keluarga: '',
      jumlah_tanggungan: '', kondisi_tempat_tinggal: '', status_pekerjaan: ''
    }
    
    await fetchCitizensData()
  } catch (error) {
    notificationStore.showNotification(`Error: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

const fetchCitizensData = async () => {
  try {
    const result = await apiStore.getCitizens()
    citizensData.value = result.data || []
  } catch (error) {
    notificationStore.showNotification(`Error: ${error.message}`, 'error')
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID').format(amount)
}

// Load data on mount
onMounted(() => {
  fetchCitizensData()
})
</script>