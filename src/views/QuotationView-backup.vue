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
            <button @click="toggleEdit" class="btn-outline">
              <PencilIcon class="h-5 w-5 mr-2" />
              {{ isEditing ? 'Ver' : 'Editar' }}
            </button>
            <button @click="exportToPDF" class="btn-secondary">
              <DocumentArrowDownIcon class="h-5 w-5 mr-2" />
              Exportar PDF
            </button>
            <button @click="duplicateQuotation" class="btn-primary">
              <DocumentDuplicateIcon class="h-5 w-5 mr-2" />
              Duplicar
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido de la cotización -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="quotation-content">
      
      <!-- Sección 1: Header completo (ancho completo) -->
      <div class="bento-box-lg bento-full-width mb-6 print-full-width">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ companyInfo.name }}</h1>
            <div class="space-y-1 text-gray-600">
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

      <!-- Sección 2: Datos del cliente y Abstract del proyecto (bentos) -->
      <div class="bento-grid-2 mb-6">
        <!-- Datos del cliente -->
        <div class="bento-box">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Datos del Cliente</h3>
          <div v-if="!isEditing" class="space-y-2">
            <div><strong>Nombre:</strong> {{ quotation.client?.name }}</div>
            <div><strong>Email:</strong> {{ quotation.client?.email }}</div>
            <div><strong>Teléfono:</strong> {{ quotation.client?.phone }}</div>
            <div><strong>Dirección:</strong> {{ quotation.client?.address }}</div>
            <div v-if="quotation.client?.rut"><strong>RUT:</strong> {{ quotation.client?.rut }}</div>
            <div v-if="quotation.client?.contactPerson"><strong>Contacto:</strong> {{ quotation.client?.contactPerson }}</div>
          </div>
          <div v-else class="space-y-3">
            <p class="text-sm text-gray-600">Los datos del cliente se gestionan desde la sección de clientes.</p>
            <router-link to="/clients" class="btn-outline text-sm">
              Gestionar Clientes
            </router-link>
          </div>
        </div>

        <!-- Abstract del proyecto -->
        <div class="bento-box">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Abstract del Proyecto</h3>
          <div v-if="!isEditing">
            <p class="text-gray-700 whitespace-pre-wrap">{{ quotation.projectAbstract || 'No especificado' }}</p>
          </div>
          <div v-else>
            <textarea
              v-model="quotation.projectAbstract"
              rows="6"
              class="form-input"
              placeholder="Describe brevemente el proyecto..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Sección 3: Desglose de tareas (ancho completo) -->
      <div class="bento-box-lg bento-full-width mb-6 print-full-width">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-900">Desglose de Tareas</h3>
          <button v-if="isEditing" @click="addItem" class="btn-primary">
            <PlusIcon class="h-5 w-5 mr-2" />
            Agregar Item
          </button>
        </div>

        <div v-if="quotation.deliverables.length === 0" class="text-center py-8 text-gray-500">
          <p>No hay items agregados</p>
          <button v-if="isEditing" @click="addItem" class="btn-primary mt-4">
            Agregar Primer Item
          </button>
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
                <th v-if="isEditing" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in quotation.deliverables" :key="item.id">
                <td class="px-6 py-4">
                  <input
                    v-if="isEditing"
                    v-model="item.description"
                    type="text"
                    class="form-input"
                    placeholder="Descripción del item..."
                    @input="updateItemTotal(item)"
                  />
                  <span v-else class="text-gray-900">{{ item.description }}</span>
                </td>
                <td class="px-6 py-4">
                  <input
                    v-if="isEditing"
                    v-model.number="item.quantity"
                    type="number"
                    min="1"
                    step="1"
                    class="form-input w-20"
                    @input="updateItemTotal(item)"
                  />
                  <span v-else class="text-gray-900">{{ item.quantity }}</span>
                </td>
                <td class="px-6 py-4">
                  <input
                    v-if="isEditing"
                    v-model.number="item.unitPrice"
                    type="number"
                    min="0"
                    step="1000"
                    class="form-input w-32"
                    @input="updateItemTotal(item)"
                  />
                  <span v-else class="text-gray-900">${{ formatCurrency(item.unitPrice) }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="font-medium text-gray-900">${{ formatCurrency(item.total) }}</span>
                </td>
                <td v-if="isEditing" class="px-6 py-4">
                  <button
                    @click="removeItem(index)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50">
              <tr>
                <td colspan="3" class="px-6 py-4 text-right font-medium text-gray-900">
                  Subtotal:
                </td>
                <td class="px-6 py-4 font-bold text-gray-900">
                  ${{ formatCurrency(quotation.subtotal) }}
                </td>
                <td v-if="isEditing"></td>
              </tr>
              <tr>
                <td colspan="3" class="px-6 py-4 text-right font-medium text-gray-900">
                  IVA (19%):
                </td>
                <td class="px-6 py-4 font-bold text-gray-900">
                  ${{ formatCurrency(quotation.tax) }}
                </td>
                <td v-if="isEditing"></td>
              </tr>
              <tr>
                <td colspan="3" class="px-6 py-4 text-right font-bold text-gray-900 text-lg">
                  TOTAL:
                </td>
                <td class="px-6 py-4 font-bold text-gray-900 text-lg">
                  ${{ formatCurrency(quotation.total) }}
                </td>
                <td v-if="isEditing"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Sección 4: Bentos flexibles -->
      <div class="bento-flex mb-6">
        <!-- Entregables -->
        <div class="bento-box min-w-0 flex-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Entregables</h3>
          <div v-if="!isEditing">
            <ul v-if="quotation.deliverables.length > 0" class="list-disc list-inside space-y-1">
              <li v-for="deliverable in quotation.deliverables" :key="deliverable" class="text-gray-700">
                {{ deliverable }}
              </li>
            </ul>
            <p v-else class="text-gray-500">No especificado</p>
          </div>
          <div v-else>
            <EditableList
              v-model="quotation.deliverables"
              placeholder="Agregar entregable..."
            />
          </div>
        </div>

        <!-- Supuestos y alcances -->
        <div class="bento-box min-w-0 flex-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Supuestos y Alcances</h3>
          <div v-if="!isEditing">
            <ul v-if="quotation.assumptions.length > 0" class="list-disc list-inside space-y-1">
              <li v-for="assumption in quotation.assumptions" :key="assumption" class="text-gray-700">
                {{ assumption }}
              </li>
            </ul>
            <p v-else class="text-gray-500">No especificado</p>
          </div>
          <div v-else>
            <EditableList
              v-model="quotation.assumptions"
              placeholder="Agregar supuesto..."
            />
          </div>
        </div>
      </div>

      <div class="bento-flex mb-6">
        <!-- Plazos -->
        <div class="bento-box min-w-0 flex-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Plazos</h3>
          <div v-if="!isEditing">
            <p class="text-gray-700 whitespace-pre-wrap">{{ quotation.timeline || 'No especificado' }}</p>
          </div>
          <div v-else>
            <textarea
              v-model="quotation.timeline"
              rows="4"
              class="form-input"
              placeholder="Especifica los plazos del proyecto..."
            ></textarea>
          </div>
        </div>

        <!-- Condiciones comerciales -->
        <div class="bento-box min-w-0 flex-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Condiciones Comerciales</h3>
          <div v-if="!isEditing">
            <p class="text-gray-700 whitespace-pre-wrap">{{ quotation.commercialConditions || 'No especificado' }}</p>
          </div>
          <div v-else>
            <textarea
              v-model="quotation.commercialConditions"
              rows="4"
              class="form-input"
              placeholder="Condiciones de pago, garantías, etc..."
            ></textarea>
          </div>
        </div>
      </div>

      <div class="bento-flex mb-6">
        <!-- Opcionales -->
        <div class="bento-box min-w-0 flex-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Opcionales (No Incluidos)</h3>
          <div v-if="!isEditing">
            <ul v-if="quotation.optionalItems.length > 0" class="list-disc list-inside space-y-1">
              <li v-for="optional in quotation.optionalItems" :key="optional" class="text-gray-700">
                {{ optional }}
              </li>
            </ul>
            <p v-else class="text-gray-500">No especificado</p>
          </div>
          <div v-else>
            <EditableList
              v-model="quotation.optionalItems"
              placeholder="Agregar item opcional..."
            />
          </div>
        </div>

        <!-- Datos bancarios -->
        <div class="bento-box min-w-0 flex-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Datos Bancarios</h3>
          <div v-if="!isEditing">
            <p class="text-gray-700 whitespace-pre-wrap">{{ quotation.bankingDetails || 'No especificado' }}</p>
          </div>
          <div v-else>
            <textarea
              v-model="quotation.bankingDetails"
              rows="4"
              class="form-input"
              placeholder="Información bancaria para transferencias..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Notas (ancho completo) -->
      <div class="bento-box bento-full-width print-full-width">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Notas</h3>
        <div v-if="!isEditing">
          <p class="text-gray-700 whitespace-pre-wrap">{{ quotation.notes || 'Sin notas adicionales' }}</p>
        </div>
        <div v-else>
          <textarea
            v-model="quotation.notes"
            rows="3"
            class="form-input"
            placeholder="Notas adicionales..."
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Botones de acción flotantes -->
    <div v-if="isEditing" class="fixed bottom-6 right-6 space-x-3 no-print">
      <button @click="cancelEdit" class="btn-secondary">
        Cancelar
      </button>
      <button @click="saveQuotation" class="btn-primary">
        Guardar Cambios
      </button>
    </div>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuotationsStore } from '@/stores/quotations'
import type { Quotation, Deliverable } from '@/types'
import {
  ArrowLeftIcon,
  PencilIcon,
  DocumentArrowDownIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import EditableList from '@/components/EditableList.vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Composables
const route = useRoute()
const router = useRouter()
const store = useQuotationsStore()

// Reactive data
const isEditing = ref(false)
const originalQuotation = ref<Quotation | null>(null)

// Computed
const quotation = computed(() => {
  const id = route.params.id as string
  return store.quotations.find(q => q.id === id) || null
})

const { companyInfo } = store

// Methods
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

function toggleEdit(): void {
  if (isEditing.value) {
    cancelEdit()
  } else {
    startEdit()
  }
}

function startEdit(): void {
  if (quotation.value) {
    originalQuotation.value = JSON.parse(JSON.stringify(quotation.value))
    isEditing.value = true
  }
}

function cancelEdit(): void {
  if (originalQuotation.value && quotation.value) {
    // Restaurar valores originales
    Object.assign(quotation.value, originalQuotation.value)
    isEditing.value = false
    originalQuotation.value = null
  }
}

function saveQuotation(): void {
  if (quotation.value) {
    store.updateQuotation(quotation.value.id, quotation.value)
    isEditing.value = false
    originalQuotation.value = null
  }
}

function addItem(): void {
  if (quotation.value) {
    const newItem: Deliverable = {
      id: crypto.randomUUID(),
      name: 'Nuevo Item',
      description: '',
      quantity: 1,
      unit: 'unidad',
      unitPrice: 0,
      total: 0
    }
    quotation.value.deliverables.push(newItem)
  }
}

function removeItem(index: number): void {
  if (quotation.value) {
    quotation.value.deliverables.splice(index, 1)
    store.calculateTotals(quotation.value)
  }
}

function updateItemTotal(item: Deliverable): void {
  item.total = item.quantity * item.unitPrice
  if (quotation.value) {
    store.calculateTotals(quotation.value)
  }
}

function duplicateQuotation(): void {
  if (quotation.value) {
    const duplicate = store.duplicateQuotation(quotation.value.id)
    router.push(`/quotations/${duplicate.id}/edit`)
  }
}

async function exportToPDF(): Promise<void> {
  if (!quotation.value) return

  const element = document.getElementById('quotation-content')
  if (!element) return

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`${quotation.value.code}.pdf`)
  } catch (error) {
    console.error('Error generating PDF:', error)
  }
}

// Watchers
watch(() => quotation.value?.items, () => {
  if (quotation.value && isEditing.value) {
    store.calculateTotals(quotation.value)
  }
}, { deep: true })

// Helper functions
function getClientName(clientId: string): string {
  const client = store.getClientById(clientId)
  return client?.name || 'Cliente no encontrado'
}

// Lifecycle
onMounted(async () => {
  await store.initialize()
  
  // Si estamos en modo edición desde la URL
  if (route.path.endsWith('/edit')) {
    startEdit()
  }
})
</script>
