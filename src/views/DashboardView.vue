<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Generador de Cotizaciones</h1>
            <p class="text-gray-600 mt-1">Gestiona tus cotizaciones de forma profesional</p>
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
              @click="$router.push('/clients')"
              class="btn-secondary flex items-center space-x-2"
            >
              <UsersIcon class="h-5 w-5" />
              <span>Clientes</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bento-grid-auto mb-8">
        <div class="bento-box">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <DocumentTextIcon class="h-8 w-8 text-primary-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Cotizaciones</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalQuotations }}</p>
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
              <p class="text-2xl font-bold text-gray-900">{{ approvedQuotations }}</p>
            </div>
          </div>
        </div>

        <div class="bento-box">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CurrencyDollarIcon class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p class="text-2xl font-bold text-gray-900">${{ formatCurrency(totalRevenue) }}</p>
            </div>
          </div>
        </div>

        <div class="bento-box">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <UsersIcon class="h-8 w-8 text-primary-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Clientes</p>
              <p class="text-2xl font-bold text-gray-900">{{ clients.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bento-grid-3 mb-8">
        <div class="bento-box cursor-pointer hover:border-primary-300" @click="showNewQuotationModal = true">
          <div class="text-center">
            <PlusCircleIcon class="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Nueva Cotización</h3>
            <p class="text-gray-600">Crear una nueva cotización para un cliente</p>
          </div>
        </div>

        <div class="bento-box cursor-pointer hover:border-primary-300" @click="$router.push('/clients')">
          <div class="text-center">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Gestionar Clientes</h3>
            <p class="text-gray-600">Ver y administrar tu base de clientes</p>
          </div>
        </div>

        <div class="bento-box">
          <div class="text-center">
            <ArrowDownTrayIcon class="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Exportar Datos</h3>
            <p class="text-gray-600">Próximamente, podrás descargar tus cotizaciones en formato CSV</p>
          </div>
        </div>
      </div>

      <!-- Recent Quotations -->
      <div class="bento-box-lg">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Cotizaciones Recientes</h2>
          <router-link to="/quotations" class="btn-outline">Ver todas</router-link>
        </div>

        <div v-if="quotations.length === 0" class="text-center py-12">
          <DocumentTextIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay cotizaciones</h3>
          <p class="text-gray-600 mb-6">Comienza creando tu primera cotización</p>
          <button @click="showNewQuotationModal = true" class="btn-primary">
            Crear Primera Cotización
          </button>
        </div>

        <div v-else class="bento-grid-auto">
          <div
            v-for="quotation in quotations.slice(0, 8)"
            :key="quotation.id"
            class="quotation-card"
            @click="$router.push(`/quotations/${quotation.id}`)"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="font-semibold text-gray-900">{{ quotation.number }}</h3>
                <p class="text-sm text-gray-600">{{ getClientName(quotation.clientId) }}</p>
              </div>
              <span
                :class="getStatusBadgeClass(quotation.status)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ getStatusLabel(quotation.status) }}
              </span>
            </div>
            
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Fecha:</span>
                <span class="text-gray-900">{{ formatDate(new Date(quotation.createdAt)) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Total:</span>
                <span class="font-medium text-gray-900">${{ formatCurrency(quotation.totals.total) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Válida hasta:</span>
                <span class="text-gray-900">{{ formatDate(new Date(quotation.validUntil)) }}</span>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotationsStore } from '@/stores/quotations'
import {
  PlusIcon,
  UsersIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  PlusCircleIcon,
  UserPlusIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'
import NewQuotationModal from '@/components/NewQuotationModal.vue'

const router = useRouter()
const store = useQuotationsStore()

// Reactive data
const showNewQuotationModal = ref(false)

// Store data
const { quotations, clients, totalRevenue, approvedQuotations, pendingQuotations, totalQuotations, totalClients } = store

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

function handleQuotationCreated(quotationId: string): void {
  showNewQuotationModal.value = false
  router.push(`/quotations/${quotationId}`)
}

// Lifecycle
onMounted(async () => {
  await store.initialize()
})
</script>
