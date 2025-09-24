<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
        aria-hidden="true"
        @click="$emit('close')"
      ></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
            <DocumentPlusIcon class="h-6 w-6 text-primary-600" aria-hidden="true" />
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Nueva Cotización
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Selecciona un cliente para crear una nueva cotización
              </p>
            </div>
          </div>
        </div>

        <form @submit.prevent="createQuotation" class="mt-6">
          <div class="mb-4">
            <label for="client" class="form-label">Cliente</label>
            <select
              id="client"
              v-model="selectedClientId"
              class="form-input"
              required
            >
              <option value="">Seleccionar cliente...</option>
              <option
                v-for="client in clients"
                :key="client.id"
                :value="client.id"
              >
                {{ client.name }} ({{ client.code }})
              </option>
            </select>
          </div>

          <div v-if="clients.length === 0" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex">
              <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">
                  No hay clientes disponibles
                </h3>
                <div class="mt-2 text-sm text-yellow-700">
                  <p>Necesitas crear al menos un cliente antes de poder generar una cotización.</p>
                </div>
                <div class="mt-4">
                  <div class="-mx-2 -my-1.5 flex">
                    <button
                      type="button"
                      @click="$router.push('/clients'); $emit('close')"
                      class="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                    >
                      Ir a Clientes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="submit"
              :disabled="!selectedClientId || isCreating"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isCreating" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </span>
              <span v-else>Crear Cotización</span>
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotationsStore } from '@/stores/quotations'
import { DocumentPlusIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

// Emits
const emit = defineEmits<{
  close: []
  created: [quotationId: string]
}>()

// Composables
const router = useRouter()
const store = useQuotationsStore()

// Reactive data
const selectedClientId = ref('')
const isCreating = ref(false)

// Store data
const { clients } = store

// Methods
async function createQuotation(): Promise<void> {
  if (!selectedClientId.value) return

  isCreating.value = true
  
  try {
    const quotation = store.createQuotation(selectedClientId.value)
    emit('created', quotation.id)
  } catch (error) {
    console.error('Error creating quotation:', error)
    // Aquí podrías mostrar un toast de error
  } finally {
    isCreating.value = false
  }
}
</script>
