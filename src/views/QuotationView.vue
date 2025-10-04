<template>
  <div class="min-h-screen bg-gray-50" v-if="quotation">
    <!-- Header con acciones -->
    <header class="bg-white shadow-sm border-b border-gray-200 no-print">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <button @click="$router.back()" class="btn-secondary">
              <ArrowLeftIcon class="h-5 w-5 mr-2" />
              Volver
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ quotation.number }}</h1>
              <p class="text-gray-600">{{ getClientName(quotation.clientId) }}</p>
            </div>
          </div>
          <div class="flex space-x-3">
            <button @click="duplicateQuotation" class="btn-primary">
              <DocumentDuplicateIcon class="h-5 w-5 mr-2" />
              Duplicar
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Información de la empresa y cotización -->
      <div class="bento-box mb-6">
        <div class="flex justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-4">{{ companyInfo.name }}</h2>
            <div class="text-gray-600 space-y-1">
              <p>{{ companyInfo.email }}</p>
              <p>{{ companyInfo.phone }}</p>
              <p>{{ companyInfo.address }}</p>
              <p>RUT: {{ companyInfo.rut }}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="space-y-2">
              <div>
                <span class="text-sm font-medium text-gray-600">Código:</span>
                <span class="ml-2 text-lg font-bold text-gray-900">{{ quotation.number }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-600">Fecha:</span>
                <span class="ml-2 text-gray-900">{{ formatDate(quotation.createdAt) }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-600">Válida hasta:</span>
                <span class="ml-2 text-gray-900">{{ formatDate(quotation.validUntil) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información del cliente -->
      <div class="bento-box mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="text-sm font-medium text-gray-600">Empresa:</span>
            <p class="text-gray-900">{{ quotation.personalInfo.companyName }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Contacto:</span>
            <p class="text-gray-900">{{ quotation.personalInfo.contactName }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Email:</span>
            <p class="text-gray-900">{{ quotation.personalInfo.email }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Teléfono:</span>
            <p class="text-gray-900">{{ quotation.personalInfo.phone }}</p>
          </div>
        </div>
      </div>

      <!-- Proyecto -->
      <div class="bento-box mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ quotation.projectAbstract.title }}</h3>
        <p class="text-gray-700 mb-4">{{ quotation.projectAbstract.description }}</p>
        <div v-if="quotation.projectAbstract.objectives.length > 0">
          <h4 class="font-medium text-gray-900 mb-2">Objetivos:</h4>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="objective in quotation.projectAbstract.objectives" :key="objective" class="text-gray-700">
              {{ objective }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Desglose de tareas -->
      <div class="bento-box mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Desglose de Tareas</h3>
        
        <div v-if="quotation.deliverables.length === 0" class="text-center py-8 text-gray-500">
          <p>No hay items agregados</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Unitario
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in quotation.deliverables" :key="item.id">
                <td class="px-6 py-4">
                  <div>
                    <div class="font-medium text-gray-900">{{ item.name }}</div>
                    <div class="text-sm text-gray-500">{{ item.description }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-900">
                  {{ item.quantity }} {{ item.unit }}
                </td>
                <td class="px-6 py-4 text-gray-900">
                  ${{ formatCurrency(item.unitPrice) }}
                </td>
                <td class="px-6 py-4 font-medium text-gray-900">
                  ${{ formatCurrency(item.total) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Totales -->
      <div class="bento-box mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">Subtotal:</span>
            <span class="text-gray-900">${{ formatCurrency(quotation.totals.subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">IVA (19%):</span>
            <span class="text-gray-900">${{ formatCurrency(quotation.totals.tax) }}</span>
          </div>
          <div class="flex justify-between border-t pt-2 font-bold text-lg">
            <span class="text-gray-900">Total:</span>
            <span class="text-gray-900">${{ formatCurrency(quotation.totals.total) }}</span>
          </div>
        </div>
      </div>

      <!-- Estado -->
      <div class="bento-box">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Estado de la Cotización</h3>
            <p class="text-gray-600">Estado actual del proceso</p>
          </div>
          <div>
            <span :class="getStatusBadgeClass(quotation.status)" class="px-3 py-1 rounded-full text-sm font-medium">
              {{ getStatusLabel(quotation.status) }}
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Loading state -->
  <div v-else class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Cargando cotización...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuotationsStore } from '@/stores/quotations'
import type { Quotation } from '@/types'
import {
  ArrowLeftIcon,
  DocumentDuplicateIcon
} from '@heroicons/vue/24/outline'

// Composables
const route = useRoute()
const router = useRouter()
const store = useQuotationsStore()

// Reactive data
const quotation = ref<Quotation | null>(null)

// Store data
const { companyInfo } = store

// Computed
const quotationId = computed(() => route.params.id as string)

// Lifecycle
onMounted(async () => {
  await store.initialize()
  loadQuotation()
})

// Methods
function loadQuotation(): void {
  if (quotationId.value) {
    quotation.value = store.getQuotationById(quotationId.value) || null
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) {
    return 'Fecha inválida'
  }
  return new Intl.DateTimeFormat('es-CL').format(dateObj)
}

function getClientName(clientId: string): string {
  const client = store.getClientById(clientId)
  return client?.name || 'Cliente no encontrado'
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Borrador',
    pending: 'Pendiente',
    approved: 'Aprobada',
    rejected: 'Rechazada',
    expired: 'Vencida'
  }
  return labels[status] || status
}

function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function duplicateQuotation(): void {
  if (quotation.value) {
    // Crear una nueva cotización basada en la actual
    const clients = store.clients
    if (clients && clients.length > 0) {
      const newQuotation = store.createQuotation(
        quotation.value.clientId, 
        `Copia de ${quotation.value.title}`
      )
      router.push(`/quotations/${newQuotation.id}`)
    }
  }
}
</script>
