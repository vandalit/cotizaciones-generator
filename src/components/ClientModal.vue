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
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
        <div>
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
            <UserIcon class="h-6 w-6 text-primary-600" aria-hidden="true" />
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {{ isEditing ? 'Editar Cliente' : 'Nuevo Cliente' }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                {{ isEditing ? 'Actualiza la información del cliente' : 'Completa los datos del nuevo cliente' }}
              </p>
            </div>
          </div>
        </div>

        <form @submit.prevent="saveClient" class="mt-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nombre -->
            <div class="md:col-span-2">
              <label for="name" class="form-label">Nombre de la empresa *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-input"
                placeholder="Ej: Vertientes del Sur"
                required
              />
            </div>

            <!-- Código -->
            <div>
              <label for="code" class="form-label">Código *</label>
              <input
                id="code"
                v-model="form.code"
                type="text"
                class="form-input"
                placeholder="Ej: VDS"
                maxlength="10"
                required
                @input="validateCode"
              />
              <p v-if="codeError" class="mt-1 text-sm text-red-600">{{ codeError }}</p>
              <p class="mt-1 text-sm text-gray-500">Usado para generar códigos de cotización</p>
            </div>

            <!-- RUT -->
            <div>
              <label for="rut" class="form-label">RUT</label>
              <input
                id="rut"
                v-model="form.rut"
                type="text"
                class="form-input"
                placeholder="Ej: 76.123.456-7"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="form-label">Email *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="contacto@empresa.cl"
                required
              />
            </div>

            <!-- Teléfono -->
            <div>
              <label for="phone" class="form-label">Teléfono *</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="form-input"
                placeholder="+56 9 1234 5678"
                required
              />
            </div>

            <!-- Dirección -->
            <div class="md:col-span-2">
              <label for="address" class="form-label">Dirección *</label>
              <input
                id="address"
                v-model="form.address"
                type="text"
                class="form-input"
                placeholder="Av. Principal 123, Ciudad"
                required
              />
            </div>

            <!-- Persona de contacto -->
            <div class="md:col-span-2">
              <label for="contactPerson" class="form-label">Persona de contacto</label>
              <input
                id="contactPerson"
                v-model="form.contactPerson"
                type="text"
                class="form-input"
                placeholder="Nombre del contacto principal"
              />
            </div>
          </div>

          <div class="mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="submit"
              :disabled="!isFormValid || isSaving"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSaving" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
              <span v-else>{{ isEditing ? 'Actualizar' : 'Crear' }} Cliente</span>
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
import { ref, computed, onMounted } from 'vue'
import { useQuotationsStore, type Client } from '@/stores/quotations'
import { UserIcon } from '@heroicons/vue/24/outline'

// Props
interface Props {
  client?: Client
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  saved: []
}>()

// Composables
const store = useQuotationsStore()

// Reactive data
const isSaving = ref(false)
const codeError = ref('')

const form = ref({
  name: '',
  code: '',
  email: '',
  phone: '',
  address: '',
  rut: '',
  contactPerson: ''
})

// Computed
const isEditing = computed(() => !!props.client)

const isFormValid = computed(() => {
  return form.value.name.trim() !== '' &&
         form.value.code.trim() !== '' &&
         form.value.email.trim() !== '' &&
         form.value.phone.trim() !== '' &&
         form.value.address.trim() !== '' &&
         !codeError.value
})

// Methods
function validateCode(): void {
  const code = form.value.code.trim().toUpperCase()
  form.value.code = code

  if (code.length === 0) {
    codeError.value = ''
    return
  }

  // Verificar que solo contenga letras y números
  if (!/^[A-Z0-9]+$/.test(code)) {
    codeError.value = 'El código solo puede contener letras y números'
    return
  }

  // Verificar que no exista otro cliente con el mismo código
  const existingClient = store.clients.find(c => 
    c.code === code && (!props.client || c.id !== props.client.id)
  )
  
  if (existingClient) {
    codeError.value = 'Ya existe un cliente con este código'
    return
  }

  codeError.value = ''
}

async function saveClient(): Promise<void> {
  if (!isFormValid.value) return

  isSaving.value = true
  
  try {
    if (isEditing.value && props.client) {
      // Actualizar cliente existente
      store.updateClient(props.client.id, {
        name: form.value.name.trim(),
        code: form.value.code.trim().toUpperCase(),
        email: form.value.email.trim(),
        phone: form.value.phone.trim(),
        address: form.value.address.trim(),
        rut: form.value.rut.trim() || undefined,
        contactPerson: form.value.contactPerson.trim() || undefined
      })
    } else {
      // Crear nuevo cliente
      store.addClient({
        name: form.value.name.trim(),
        code: form.value.code.trim().toUpperCase(),
        email: form.value.email.trim(),
        phone: form.value.phone.trim(),
        address: form.value.address.trim(),
        rut: form.value.rut.trim() || undefined,
        contactPerson: form.value.contactPerson.trim() || undefined
      })
    }
    
    emit('saved')
  } catch (error) {
    console.error('Error saving client:', error)
  } finally {
    isSaving.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (props.client) {
    // Cargar datos del cliente para edición
    form.value = {
      name: props.client.name,
      code: props.client.code,
      email: props.client.email,
      phone: props.client.phone,
      address: props.client.address,
      rut: props.client.rut || '',
      contactPerson: props.client.contactPerson || ''
    }
  }
})
</script>
