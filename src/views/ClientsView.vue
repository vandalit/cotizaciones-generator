<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
            <p class="text-gray-600 mt-1">Administra tu base de clientes y sus datos</p>
          </div>
          <div class="flex space-x-4">
            <button
              @click="showNewClientModal = true"
              class="btn-primary flex items-center space-x-2"
            >
              <UserPlusIcon class="h-5 w-5" />
              <span>Nuevo Cliente</span>
            </button>
            <button
              @click="exportClients"
              class="btn-secondary flex items-center space-x-2"
            >
              <ArrowDownTrayIcon class="h-5 w-5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Stats y acciones rápidas -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bento-grid-auto mb-8">
        <div class="bento-box">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <UsersIcon class="h-8 w-8 text-primary-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Clientes</p>
              <p class="text-2xl font-bold text-gray-900">{{ clients.length }}</p>
            </div>
          </div>
        </div>

        <div class="bento-box">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CalendarIcon class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Último Respaldo</p>
              <p class="text-sm font-medium text-gray-900">
                {{ lastBackupDate ? formatDate(lastBackupDate) : 'Nunca' }}
              </p>
            </div>
          </div>
        </div>

        <div class="bento-box">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <DocumentTextIcon class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Cotizaciones Activas</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeQuotationsCount }}</p>
            </div>
          </div>
        </div>

        <div class="bento-box">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ExclamationTriangleIcon class="h-8 w-8 text-red-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Acciones</p>
              <button
                @click="clearAllData"
                class="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Limpiar Datos
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="bento-box mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div class="flex-1 max-w-lg">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Buscar clientes..."
                class="form-input pl-10"
              />
            </div>
          </div>
          <div class="flex space-x-3">
            <select v-model="sortBy" class="form-input">
              <option value="name">Ordenar por Nombre</option>
              <option value="createdAt">Ordenar por Fecha</option>
              <option value="code">Ordenar por Código</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista de clientes -->
      <div class="bento-box-lg">
        <div v-if="filteredClients.length === 0" class="text-center py-12">
          <UsersIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{ searchTerm ? 'No se encontraron clientes' : 'No hay clientes' }}
          </h3>
          <p class="text-gray-600 mb-6">
            {{ searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer cliente' }}
          </p>
          <button
            v-if="!searchTerm"
            @click="showNewClientModal = true"
            class="btn-primary"
          >
            Agregar Primer Cliente
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cotizaciones
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ client.name }}</div>
                    <div class="text-sm text-gray-500">{{ client.email }}</div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {{ client.code }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ client.phone }}</div>
                  <div class="text-sm text-gray-500">{{ client.contactPerson || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ getClientQuotationsCount(client.id) }}</div>
                  <div class="text-sm text-gray-500">cotizaciones</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ formatDate(client.createdAt) }}
                </td>
                <td class="px-6 py-4 text-sm font-medium space-x-2">
                  <button
                    @click="editClient(client)"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="createQuotationForClient(client.id)"
                    class="text-green-600 hover:text-green-900"
                  >
                    <DocumentPlusIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="confirmDeleteClient(client)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal nuevo cliente -->
    <ClientModal
      v-if="showNewClientModal"
      @close="showNewClientModal = false"
      @saved="handleClientSaved"
    />

    <!-- Modal editar cliente -->
    <ClientModal
      v-if="showEditClientModal && editingClient"
      :client="editingClient"
      @close="showEditClientModal = false"
      @saved="handleClientSaved"
    />

    <!-- Modal confirmación eliminar -->
    <ConfirmModal
      v-if="showDeleteModal && clientToDelete"
      title="Eliminar Cliente"
      :message="`¿Estás seguro de que quieres eliminar a ${clientToDelete.name}? Esta acción no se puede deshacer.`"
      confirm-text="Eliminar"
      confirm-class="bg-red-600 hover:bg-red-700"
      @confirm="deleteClient"
      @cancel="showDeleteModal = false"
    />

    <!-- Modal confirmación limpiar datos -->
    <ConfirmModal
      v-if="showClearDataModal"
      title="Limpiar Todos los Datos"
      message="¿Estás seguro de que quieres eliminar TODOS los datos? Esto incluye clientes, cotizaciones y configuración. Esta acción no se puede deshacer."
      confirm-text="Eliminar Todo"
      confirm-class="bg-red-600 hover:bg-red-700"
      @confirm="confirmClearData"
      @cancel="showClearDataModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotationsStore, type Client } from '@/stores/quotations'
import {
  UserPlusIcon,
  ArrowDownTrayIcon,
  UsersIcon,
  CalendarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  DocumentPlusIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import ClientModal from '@/components/ClientModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

// Composables
const router = useRouter()
const store = useQuotationsStore()

// Reactive data
const searchTerm = ref('')
const sortBy = ref('name')
const showNewClientModal = ref(false)
const showEditClientModal = ref(false)
const showDeleteModal = ref(false)
const showClearDataModal = ref(false)
const editingClient = ref<Client | null>(null)
const clientToDelete = ref<Client | null>(null)

// Store data
const { clients, quotations } = store

// Computed
const filteredClients = computed(() => {
  let filtered = clients.filter(client => {
    const searchLower = searchTerm.value.toLowerCase()
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.code.toLowerCase().includes(searchLower) ||
      (client.contactPerson && client.contactPerson.toLowerCase().includes(searchLower))
    )
  })

  // Ordenar
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'code':
        return a.code.localeCompare(b.code)
      default:
        return 0
    }
  })

  return filtered
})

const activeQuotationsCount = computed(() => {
  return quotations.filter(q => ['draft', 'sent'].includes(q.status)).length
})

const lastBackupDate = computed(() => {
  return store.getLastBackupDate()
})

// Methods
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-CL').format(date)
}

function getClientQuotationsCount(clientId: string): number {
  return quotations.filter(q => q.clientId === clientId).length
}

function editClient(client: Client): void {
  editingClient.value = client
  showEditClientModal.value = true
}

function confirmDeleteClient(client: Client): void {
  clientToDelete.value = client
  showDeleteModal.value = true
}

function deleteClient(): void {
  if (clientToDelete.value) {
    store.deleteClient(clientToDelete.value.id)
    showDeleteModal.value = false
    clientToDelete.value = null
  }
}

function createQuotationForClient(clientId: string): void {
  const quotation = store.createQuotation(clientId)
  router.push(`/quotations/${quotation.id}/edit`)
}

function handleClientSaved(): void {
  showNewClientModal.value = false
  showEditClientModal.value = false
  editingClient.value = null
}

function exportClients(): void {
  const headers = ['Nombre', 'Código', 'Email', 'Teléfono', 'Dirección', 'RUT', 'Contacto', 'Creado']
  const rows = clients.map(client => [
    client.name,
    client.code,
    client.email,
    client.phone,
    client.address,
    client.rut || '',
    client.contactPerson || '',
    client.createdAt.toLocaleDateString()
  ])

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `clientes-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

function clearAllData(): void {
  showClearDataModal.value = true
}

function confirmClearData(): void {
  store.clearAllData()
  showClearDataModal.value = false
}

// Lifecycle
onMounted(() => {
  store.loadFromLocalStorage()
})
</script>
