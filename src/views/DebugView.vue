<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">🔧 Debug Panel</h1>
      
      <!-- Estado del Store -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">📊 Estado del Store</h2>
        <div class="bento-grid-3">
          <div class="bento-box">
            <h3 class="font-semibold text-lg mb-2">Clientes</h3>
            <p class="text-3xl font-bold text-primary-600">{{ store.totalClients }}</p>
            <p class="text-sm text-gray-500">Total registrados</p>
          </div>
          <div class="bento-box">
            <h3 class="font-semibold text-lg mb-2">Cotizaciones</h3>
            <p class="text-3xl font-bold text-green-600">{{ store.totalQuotations }}</p>
            <p class="text-sm text-gray-500">Total creadas</p>
          </div>
          <div class="bento-box">
            <h3 class="font-semibold text-lg mb-2">Inicializado</h3>
            <p class="text-3xl font-bold" :class="store.isInitialized ? 'text-green-600' : 'text-red-600'">
              {{ store.isInitialized ? '✅' : '❌' }}
            </p>
            <p class="text-sm text-gray-500">Estado del store</p>
          </div>
        </div>
      </section>

      <!-- Acciones de Debug -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">🛠️ Acciones de Debug</h2>
        <div class="bento-flex">
          <button 
            @click="reinitializeStore" 
            :disabled="isLoading"
            class="btn-primary"
          >
            🔄 Reinicializar Store
          </button>
          <button 
            @click="resetMockData" 
            :disabled="isLoading"
            class="btn-secondary"
          >
            📦 Resetear Datos Mock
          </button>
          <button 
            @click="clearLocalStorage" 
            class="btn-outline"
          >
            🗑️ Limpiar localStorage
          </button>
          <button 
            @click="exportData" 
            class="btn-secondary"
          >
            📤 Exportar Datos
          </button>
        </div>
      </section>

      <!-- Test de Formularios -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">📝 Test de Formularios</h2>
        <div class="bento-grid-2">
          <!-- Test Cliente -->
          <div class="bento-box">
            <h3 class="font-semibold text-lg mb-4">Crear Cliente de Prueba</h3>
            <form @submit.prevent="createTestClient" class="space-y-4">
              <div>
                <label class="form-label">Nombre</label>
                <input 
                  v-model="testClient.name" 
                  class="form-input" 
                  placeholder="Empresa Test"
                  required
                >
              </div>
              <div>
                <label class="form-label">Email</label>
                <input 
                  v-model="testClient.email" 
                  type="email"
                  class="form-input" 
                  placeholder="test@empresa.cl"
                  required
                >
              </div>
              <div>
                <label class="form-label">Teléfono</label>
                <input 
                  v-model="testClient.phone" 
                  class="form-input" 
                  placeholder="+56 9 1234 5678"
                  required
                >
              </div>
              <button type="submit" class="btn-primary w-full">
                Crear Cliente
              </button>
            </form>
          </div>

          <!-- Test Cotización -->
          <div class="bento-box">
            <h3 class="font-semibold text-lg mb-4">Crear Cotización de Prueba</h3>
            <form @submit.prevent="createTestQuotation" class="space-y-4">
              <div>
                <label class="form-label">Cliente</label>
                <select v-model="selectedClientId" class="form-input" required>
                  <option value="">Seleccionar cliente...</option>
                  <option 
                    v-for="client in store.clients" 
                    :key="client.id" 
                    :value="client.id"
                  >
                    {{ client.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="form-label">Título</label>
                <input 
                  v-model="testQuotationTitle" 
                  class="form-input" 
                  placeholder="Cotización de Prueba"
                  required
                >
              </div>
              <button 
                type="submit" 
                :disabled="!selectedClientId"
                class="btn-primary w-full"
              >
                Crear Cotización
              </button>
            </form>
          </div>
        </div>
      </section>

      <!-- Lista de Clientes -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">👥 Clientes ({{ store.clients.length }})</h2>
        <div class="bento-box">
          <div v-if="store.clients.length === 0" class="text-center py-8 text-gray-500">
            No hay clientes registrados
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="client in store.clients" 
              :key="client.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 class="font-semibold">{{ client.name }}</h4>
                <p class="text-sm text-gray-600">{{ client.email }} • {{ client.phone }}</p>
                <p class="text-xs text-gray-500">ID: {{ client.id }}</p>
              </div>
              <button 
                @click="deleteClient(client.id)"
                class="text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Lista de Cotizaciones -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">📄 Cotizaciones ({{ store.quotations.length }})</h2>
        <div class="bento-box">
          <div v-if="store.quotations.length === 0" class="text-center py-8 text-gray-500">
            No hay cotizaciones creadas
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="quotation in store.quotations" 
              :key="quotation.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 class="font-semibold">{{ quotation.title }}</h4>
                <p class="text-sm text-gray-600">{{ quotation.number }} • {{ getClientName(quotation.clientId) }}</p>
                <p class="text-xs text-gray-500">
                  Estado: {{ quotation.status }} • Total: ${{ quotation.totals.total.toLocaleString() }}
                </p>
              </div>
              <div class="flex space-x-2">
                <router-link 
                  :to="`/quotations/${quotation.id}`"
                  class="text-primary-600 hover:text-primary-800"
                >
                  👁️
                </router-link>
                <button 
                  @click="deleteQuotation(quotation.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Logs -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">📋 Logs de Debug</h2>
        <div class="bento-box">
          <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
            <div v-for="(log, index) in debugLogs" :key="index" class="mb-1">
              [{{ log.timestamp }}] {{ log.message }}
            </div>
            <div v-if="debugLogs.length === 0" class="text-gray-500">
              No hay logs disponibles
            </div>
          </div>
          <button @click="clearLogs" class="btn-secondary mt-4">
            Limpiar Logs
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuotationsStore } from '@/stores/quotations'
import { useMockData } from '@/composables/useMockData'

const store = useQuotationsStore()
const { resetMockData: resetMock } = useMockData()

// Estado
const isLoading = ref(false)
const debugLogs = ref<Array<{ timestamp: string, message: string }>>([])

// Formularios de test
const testClient = ref({
  name: 'Empresa Test',
  email: 'test@empresa.cl',
  phone: '+56 9 1234 5678',
  address: 'Dirección Test 123',
  rut: '12.345.678-9',
  contactPerson: 'Persona Test'
})

const selectedClientId = ref('')
const testQuotationTitle = ref('Cotización de Prueba')

// Funciones de utilidad
function addLog(message: string) {
  const timestamp = new Date().toLocaleTimeString()
  debugLogs.value.unshift({ timestamp, message })
  console.log(`[DEBUG] ${message}`)
}

function clearLogs() {
  debugLogs.value = []
}

// Acciones de debug
async function reinitializeStore() {
  isLoading.value = true
  addLog('Reinicializando store...')
  
  try {
    await store.initialize()
    addLog(`Store reinicializado: ${store.clients.length} clientes, ${store.quotations.length} cotizaciones`)
  } catch (error) {
    addLog(`Error reinicializando: ${error}`)
  } finally {
    isLoading.value = false
  }
}

async function resetMockData() {
  isLoading.value = true
  addLog('Reseteando datos mock...')
  
  try {
    await store.resetData()
    addLog('Datos mock reseteados exitosamente')
  } catch (error) {
    addLog(`Error reseteando datos: ${error}`)
  } finally {
    isLoading.value = false
  }
}

function clearLocalStorage() {
  localStorage.clear()
  addLog('localStorage limpiado')
  location.reload()
}

function exportData() {
  const data = store.exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cotizaciones-export-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  addLog('Datos exportados')
}

// Test de formularios
function createTestClient() {
  try {
    const client = store.addClient(testClient.value)
    addLog(`Cliente creado: ${client.name} (${client.id})`)
    
    // Limpiar formulario
    testClient.value = {
      name: 'Empresa Test',
      email: 'test@empresa.cl',
      phone: '+56 9 1234 5678',
      address: 'Dirección Test 123',
      rut: '12.345.678-9',
      contactPerson: 'Persona Test'
    }
  } catch (error) {
    addLog(`Error creando cliente: ${error}`)
  }
}

function createTestQuotation() {
  if (!selectedClientId.value) return
  
  try {
    const quotation = store.createQuotation(selectedClientId.value, testQuotationTitle.value)
    addLog(`Cotización creada: ${quotation.number} (${quotation.id})`)
    
    // Limpiar formulario
    selectedClientId.value = ''
    testQuotationTitle.value = 'Cotización de Prueba'
  } catch (error) {
    addLog(`Error creando cotización: ${error}`)
  }
}

function deleteClient(id: string) {
  if (confirm('¿Eliminar cliente?')) {
    store.deleteClient(id)
    addLog(`Cliente eliminado: ${id}`)
  }
}

function deleteQuotation(id: string) {
  if (confirm('¿Eliminar cotización?')) {
    store.deleteQuotation(id)
    addLog(`Cotización eliminada: ${id}`)
  }
}

function getClientName(clientId: string): string {
  const client = store.getClientById(clientId)
  return client?.name || 'Cliente no encontrado'
}

onMounted(() => {
  addLog('Debug panel iniciado')
})
</script>
