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
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido -->
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

      <!-- Lista de cotizaciones -->
      <div class="bento-box">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Lista de Cotizaciones
          </h3>
          
          <div v-if="quotations.length === 0" class="text-center py-12">
            <DocumentTextIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No hay cotizaciones</h3>
            <p class="text-gray-600 mb-6">Comienza creando tu primera cotización</p>
            <button @click="showNewQuotationModal = true" class="btn-primary">
              Crear Primera Cotización
            </button>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="quotation in quotations" 
              :key="quotation.id"
              class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              @click="$router.push(`/quotations/${quotation.id}`)"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-lg font-semibold text-gray-900">{{ quotation.number }}</h4>
                  <p class="text-sm text-gray-600">{{ quotation.title }}</p>
                  <p class="text-sm text-gray-500">Cliente: {{ getClientName(quotation.clientId) }}</p>
                </div>
                <div class="text-right">
                  <span
                    :class="getStatusBadgeClass(quotation.status)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ getStatusLabel(quotation.status) }}
                  </span>
                  <p class="text-lg font-bold text-gray-900 mt-2">
                    ${{ formatCurrency(quotation.totals.total) }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(new Date(quotation.createdAt)) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Quotation Modal -->
    <NewQuotationModal
      v-if="showNewQuotationModal"
      @close="showNewQuotationModal = false"
      @created="handleQuotationCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotationsStore } from '@/stores/quotations'
import {
  PlusIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'
import NewQuotationModal from '@/components/NewQuotationModal.vue'

// Composables
const router = useRouter()
const store = useQuotationsStore()

// Reactive data
const showNewQuotationModal = ref(false)

// Store data
const { quotations, clients } = store

// Computed para estados de cotizaciones
const draftQuotations = computed(() => quotations.value.filter(q => q.status === 'draft'))
const pendingQuotations = computed(() => quotations.value.filter(q => q.status === 'pending'))
const approvedQuotations = computed(() => quotations.value.filter(q => q.status === 'approved'))
const rejectedQuotations = computed(() => quotations.value.filter(q => q.status === 'rejected'))

// Helper functions
function getClientName(clientId: string): string {
  const client = store.getClientById(clientId)
  return client?.name || 'Cliente no encontrado'
}

function getStatusLabel(status: string): string {
  const labels = {
    draft: 'Borrador',
    pending: 'Pendiente',
    approved: 'Aprobada',
    rejected: 'Rechazada',
    expired: 'Vencida'
  }
  return labels[status as keyof typeof labels] || status
}

function getStatusBadgeClass(status: string): string {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-CL').format(date)
}

function handleQuotationCreated(quotationId: string): void {
  showNewQuotationModal.value = false
  router.push(`/quotations/${quotationId}`)
}

// Lifecycle
onMounted(async () => {
  await store.initialize()
})
</script>
