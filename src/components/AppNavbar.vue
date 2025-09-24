<template>
  <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo y navegación principal -->
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center space-x-3">
              <div class="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <DocumentTextIcon class="h-5 w-5 text-white" />
              </div>
              <div class="hidden sm:block">
                <h1 class="text-xl font-bold text-gray-900">Cotizaciones</h1>
                <p class="text-xs text-gray-500">Generador Profesional</p>
              </div>
            </router-link>
          </div>

          <!-- Navegación principal -->
          <div class="hidden md:ml-8 md:flex md:space-x-8">
            <router-link
              to="/"
              :class="getNavLinkClass('/')"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
            >
              <HomeIcon class="h-4 w-4 mr-2" />
              Dashboard
            </router-link>
            
            <router-link
              to="/quotations"
              :class="getNavLinkClass('/quotations')"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
            >
              <DocumentTextIcon class="h-4 w-4 mr-2" />
              Cotizaciones
            </router-link>
            
            <router-link
              to="/clients"
              :class="getNavLinkClass('/clients')"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
            >
              <UsersIcon class="h-4 w-4 mr-2" />
              Clientes
            </router-link>
            
            <router-link
              to="/test"
              :class="getNavLinkClass('/test')"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
            >
              <span class="text-orange-500">🧪</span>
              <span class="ml-1">Test CSS</span>
            </router-link>
          </div>
        </div>

        <!-- Acciones del lado derecho -->
        <div class="flex items-center space-x-4">
          <!-- Stats rápidas -->
          <div class="hidden lg:flex items-center space-x-6 text-sm text-gray-600">
            <div class="flex items-center space-x-1">
              <DocumentTextIcon class="h-4 w-4" />
              <span>{{ quotations.length }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <UsersIcon class="h-4 w-4" />
              <span>{{ clients.length }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <CurrencyDollarIcon class="h-4 w-4" />
              <span>${{ formatCurrency(totalRevenue) }}</span>
            </div>
          </div>

          <!-- Botón nueva cotización -->
          <button
            @click="showNewQuotationModal = true"
            class="btn-primary flex items-center space-x-2"
          >
            <PlusIcon class="h-4 w-4" />
            <span class="hidden sm:inline">Nueva</span>
          </button>

          <!-- Menú móvil -->
          <div class="md:hidden">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <Bars3Icon v-if="!mobileMenuOpen" class="h-6 w-6" />
              <XMarkIcon v-else class="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Menú móvil -->
    <div v-if="mobileMenuOpen" class="md:hidden">
      <div class="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
        <router-link
          to="/"
          @click="mobileMenuOpen = false"
          :class="getMobileNavLinkClass('/')"
          class="block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200"
        >
          <div class="flex items-center">
            <HomeIcon class="h-5 w-5 mr-3" />
            Dashboard
          </div>
        </router-link>
        
        <router-link
          to="/quotations"
          @click="mobileMenuOpen = false"
          :class="getMobileNavLinkClass('/quotations')"
          class="block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200"
        >
          <div class="flex items-center">
            <DocumentTextIcon class="h-5 w-5 mr-3" />
            Cotizaciones
          </div>
        </router-link>
        
        <router-link
          to="/clients"
          @click="mobileMenuOpen = false"
          :class="getMobileNavLinkClass('/clients')"
          class="block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200"
        >
          <div class="flex items-center">
            <UsersIcon class="h-5 w-5 mr-3" />
            Clientes
          </div>
        </router-link>

        <!-- Stats en móvil -->
        <div class="px-3 py-2 border-t border-gray-200">
          <div class="flex justify-between text-sm text-gray-600">
            <div class="flex items-center space-x-1">
              <DocumentTextIcon class="h-4 w-4" />
              <span>{{ quotations.length }} cotizaciones</span>
            </div>
            <div class="flex items-center space-x-1">
              <UsersIcon class="h-4 w-4" />
              <span>{{ clients.length }} clientes</span>
            </div>
          </div>
          <div class="mt-2 text-sm text-gray-600">
            <div class="flex items-center space-x-1">
              <CurrencyDollarIcon class="h-4 w-4" />
              <span>Ingresos: ${{ formatCurrency(totalRevenue) }}</span>
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
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuotationsStore } from '@/stores/quotations'
import {
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  CurrencyDollarIcon,
  PlusIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import NewQuotationModal from '@/components/NewQuotationModal.vue'

// Composables
const route = useRoute()
const router = useRouter()
const store = useQuotationsStore()

// Reactive data
const mobileMenuOpen = ref(false)
const showNewQuotationModal = ref(false)

// Store data
const { quotations, clients, totalRevenue } = store

// Methods
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function getNavLinkClass(path: string): string {
  const isActive = route.path === path || (path !== '/' && route.path.startsWith(path))
  
  if (isActive) {
    return 'border-primary-500 text-primary-600 border-b-2'
  }
  
  return 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 border-b-2'
}

function getMobileNavLinkClass(path: string): string {
  const isActive = route.path === path || (path !== '/' && route.path.startsWith(path))
  
  if (isActive) {
    return 'bg-primary-50 border-primary-500 text-primary-700 border-l-4'
  }
  
  return 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 border-l-4'
}

function handleQuotationCreated(quotationId: string): void {
  showNewQuotationModal.value = false
  mobileMenuOpen.value = false
  router.push(`/quotations/${quotationId}/edit`)
}
</script>
