<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Todas las Cotizaciones</h1>
            <p class="text-gray-600 mt-1">Gestiona y revisa todas tus cotizaciones</p>
          </div>
          <div class="flex space-x-4">
            <button
              @click="showNewQuotationModal = true"
              class="btn-primary flex items-center space-x-2"
            >
              <PlusIcon class="h-5 w-5" />
              <span>Nueva Cotización</span>
            </button>
            <button
              @click="exportData"
              class="btn-secondary flex items-center space-x-2"
            >
              <ArrowDownTrayIcon class="h-5 w-5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Filtros y estadísticas -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats por estado -->
      <div class="bento-grid-auto mb-8">
        <div class="bento-box">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <DocumentTextIcon class="h-8 w-8 text-gray-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Borradores</p>
              <p class="text-2xl font-bold text-gray-900">{{ draftQuotations.length }}</p>
            </div>
          </div>
        </div>

        <div class="bento-box">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <PaperAirplaneIcon class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pendientes</p>
              <p class="text-2xl font-bold text-gray-900">{{ pendingQuotations.length }}</p>
            </div>
          </div>
        </div>

        <div class="bento-box">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Aprobadas</p>
              <p class="text-2xl font-bold text-gray-900">{{ approvedQuotations.length }}</p>
            </div>
          </div>
        </div>

        <div class="bento-box">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <XCircleIcon class="h-8 w-8 text-red-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Rechazadas</p>
              <p class="text-2xl font-bold text-gray-900">{{ rejectedQuotations.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bento-box mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="form-label">Buscar</label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Código, cliente..."
                class="form-input pl-10"
              />
            </div>
          </div>
          
          <div>
            <label class="form-label">Estado</label>
            <select v-model="statusFilter" class="form-input">
              <option value="">Todos los estados</option>
              <option value="draft">Borrador</option>
              <option value="sent">Enviada</option>
              <option value="approved">Aprobada</option>
              <option value="rejected">Rechazada</option>
              <option value="expired">Vencida</option>
            </select>
          </div>

          <div>
            <label class="form-label">Cliente</label>
            <select v-model="clientFilter" class="form-input">
              <option value="">Todos los clientes</option>
              <option
                v-for="client in clients"
                :key="client.id"
                :value="client.id"
              >
                {{ client.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="form-label">Ordenar por</label>
            <select v-model="sortBy" class="form-input">
              <option value="date-desc">Fecha (más reciente)</option>
              <option value="date-asc">Fecha (más antigua)</option>
              <option value="code">Código</option>
              <option value="total-desc">Total (mayor)</option>
              <option value="total-asc">Total (menor)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista de cotizaciones -->
      <div class="bento-box-lg">
        <div v-if="filteredQuotations.length === 0" class="text-center py-12">
          <DocumentTextIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{ hasFilters ? 'No se encontraron cotizaciones' : 'No hay cotizaciones' }}
          </h3>
          <p class="text-gray-600 mb-6">
            {{ hasFilters ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza creando tu primera cotización' }}
          </p>
          <button
            v-if="!hasFilters"
            @click="showNewQuotationModal = true"
            class="btn-primary"
          >
            Crear Primera Cotización
          </button>
          <button
            v-else
            @click="clearFilters"
            class="btn-secondary"
          >
            Limpiar Filtros
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cotización
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Válida hasta
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="quotation in paginatedQuotations" :key="quotation.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ quotation.number }}</div>
                    <div class="text-sm text-gray-500">{{ quotation.deliverables.length }} entregables</div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ getClientName(quotation.clientId) }}</div>
                  <div class="text-sm text-gray-500">{{ getClientEmail(quotation.clientId) }}</div>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="getStatusBadgeClass(quotation.status)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ getStatusLabel(quotation.status) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">${{ formatCurrency(quotation.total) }}</div>
                  <div class="text-sm text-gray-500">+ IVA</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ formatDate(quotation.date) }}
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ formatDate(quotation.validUntil) }}</div>
                  <div
                    :class="isExpiringSoon(quotation.validUntil) ? 'text-red-500' : 'text-gray-500'"
                    class="text-sm"
                  >
                    {{ getExpirationLabel(quotation.validUntil) }}
                  </div>
                </td>
                <td class="px-6 py-4 text-sm font-medium space-x-2">
                  <button
                    @click="$router.push(`/quotations/${quotation.id}`)"
                    class="text-primary-600 hover:text-primary-900"
                    title="Ver cotización"
                  >
                    <EyeIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="$router.push(`/quotations/${quotation.id}/edit`)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Editar cotización"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="duplicateQuotation(quotation.id)"
                    class="text-green-600 hover:text-green-900"
                    title="Duplicar cotización"
                  >
                    <DocumentDuplicateIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="confirmDeleteQuotation(quotation)"
                    class="text-red-600 hover:text-red-900"
                    title="Eliminar cotización"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Paginación -->
          <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Mostrando
                  <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                  a
                  <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredQuotations.length) }}</span>
                  de
                  <span class="font-medium">{{ filteredQuotations.length }}</span>
                  resultados
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon class="h-5 w-5" />
                  </button>
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="currentPage = page"
                    :class="page === currentPage ? 'bg-primary-50 border-primary-500 text-primary-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon class="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal nueva cotización -->
    <NewQuotationModal
      v-if="showNewQuotationModal"
      @close="showNewQuotationModal = false"
      @created="handleQuotationCreated"
    />

    <!-- Modal confirmación eliminar -->
    <ConfirmModal
      v-if="showDeleteModal && quotationToDelete"
      title="Eliminar Cotización"
      :message="`¿Estás seguro de que quieres eliminar la cotización ${quotationToDelete?.number}? Esta acción no se puede deshacer.`"
      confirm-text="Eliminar"
      confirm-class="bg-red-600 hover:bg-red-700"
      @confirm="deleteQuotation"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotationsStore, type Quotation } from '@/stores/quotations'
import {
  PlusIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import NewQuotationModal from '@/components/NewQuotationModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

// Composables
const router = useRouter()
const store = useQuotationsStore()

// Reactive data
const searchTerm = ref('')
const statusFilter = ref('')
const clientFilter = ref('')
const sortBy = ref('date-desc')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showNewQuotationModal = ref(false)
const showDeleteModal = ref(false)
const quotationToDelete = ref<Quotation | null>(null)

// Store data
const { quotations, clients } = store

// Computed para estados de cotizaciones
const draftQuotations = computed(() => quotations.value.filter(q => q.status === 'draft'))
const pendingQuotations = computed(() => quotations.value.filter(q => q.status === 'pending'))
const approvedQuotations = computed(() => quotations.value.filter(q => q.status === 'approved'))
const rejectedQuotations = computed(() => quotations.value.filter(q => q.status === 'rejected'))

// Computed
const hasFilters = computed(() => {
  return searchTerm.value !== '' || statusFilter.value !== '' || clientFilter.value !== ''
})

const filteredQuotations = computed(() => {
  let filtered = [...quotations]

  // Filtro de búsqueda
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(q => 
      q.code.toLowerCase().includes(search) ||
      q.client?.name.toLowerCase().includes(search) ||
      q.client?.email.toLowerCase().includes(search)
    )
  }

  // Filtro de estado
  if (statusFilter.value) {
    filtered = filtered.filter(q => q.status === statusFilter.value)
  }

  // Filtro de cliente
  if (clientFilter.value) {
    filtered = filtered.filter(q => q.clientId === clientFilter.value)
  }

  // Ordenamiento
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'code':
        return a.code.localeCompare(b.code)
      case 'total-desc':
        return b.total - a.total
      case 'total-asc':
        return a.total - b.total
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredQuotations.value.length / itemsPerPage.value)
})

const paginatedQuotations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredQuotations.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1, '...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    }
  }
  
  return pages.filter(p => p !== '...' || pages.indexOf(p) === pages.lastIndexOf(p))
})

// Methods
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-CL').format(date)
}

function getStatusLabel(status: string): string {
  const labels = {
    draft: 'Borrador',
    sent: 'Enviada',
    approved: 'Aprobada',
    rejected: 'Rechazada',
    expired: 'Vencida'
  }
  return labels[status as keyof typeof labels] || status
}

function getStatusBadgeClass(status: string): string {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

function isExpiringSoon(validUntil: Date): boolean {
  const now = new Date()
  const diffDays = Math.ceil((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 7 && diffDays >= 0
}

function getExpirationLabel(validUntil: Date): string {
  const now = new Date()
  const diffDays = Math.ceil((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return `Vencida hace ${Math.abs(diffDays)} días`
  } else if (diffDays === 0) {
    return 'Vence hoy'
  } else if (diffDays === 1) {
    return 'Vence mañana'
  } else if (diffDays <= 7) {
    return `Vence en ${diffDays} días`
  } else {
    return `${diffDays} días restantes`
  }
}

function clearFilters(): void {
  searchTerm.value = ''
  statusFilter.value = ''
  clientFilter.value = ''
  currentPage.value = 1
}

function duplicateQuotation(quotationId: string): void {
  const duplicate = store.duplicateQuotation(quotationId)
  router.push(`/quotations/${duplicate.id}/edit`)
}

function confirmDeleteQuotation(quotation: Quotation): void {
  quotationToDelete.value = quotation
  showDeleteModal.value = true
}

function deleteQuotation(): void {
  if (quotationToDelete.value) {
    store.deleteQuotation(quotationToDelete.value.id)
    showDeleteModal.value = false
    quotationToDelete.value = null
  }
}

function exportData(): void {
  // Por ahora, exportamos los datos básicos
  const data = store.exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cotizaciones-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

function handleQuotationCreated(quotationId: string): void {
  showNewQuotationModal.value = false
  router.push(`/quotations/${quotationId}/edit`)
}

// Helper functions (using the ones defined above)
function getClientName(clientId: string): string {
  const client = store.getClientById(clientId)
  return client?.name || 'Cliente no encontrado'
}

function getClientEmail(clientId: string): string {
  const client = store.getClientById(clientId)
  return client?.email || 'Email no disponible'
}

// Lifecycle
onMounted(async () => {
  await store.initialize()
})
</script>
