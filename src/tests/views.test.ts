import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import QuotationsListView from '@/views/QuotationsListView.vue'
import ClientsView from '@/views/ClientsView.vue'
import { useQuotationsStore } from '@/stores/quotations'

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: DashboardView },
    { path: '/quotations', component: QuotationsListView },
    { path: '/clients', component: ClientsView }
  ]
})

describe('Views Rendering Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('DashboardView', () => {
    it('should render without errors', async () => {
      const wrapper = mount(DashboardView, {
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('h1').text()).toContain('Generador de Cotizaciones')
    })

    it('should display stats cards', async () => {
      const wrapper = mount(DashboardView, {
        global: {
          plugins: [router]
        }
      })

      // Verificar que las tarjetas de estadísticas existen
      const statsCards = wrapper.findAll('.bento-box')
      expect(statsCards.length).toBeGreaterThan(0)
    })

    it('should have new quotation button', async () => {
      const wrapper = mount(DashboardView, {
        global: {
          plugins: [router]
        }
      })

      const newQuotationBtn = wrapper.find('button')
      expect(newQuotationBtn.exists()).toBe(true)
      expect(newQuotationBtn.text()).toContain('Nueva Cotización')
    })
  })

  describe('QuotationsListView', () => {
    it('should render without errors', async () => {
      const wrapper = mount(QuotationsListView, {
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('h1').text()).toContain('Todas las Cotizaciones')
    })

    it('should display stats by status', async () => {
      const wrapper = mount(QuotationsListView, {
        global: {
          plugins: [router]
        }
      })

      // Verificar que las estadísticas por estado existen
      const statsCards = wrapper.findAll('.bento-box')
      expect(statsCards.length).toBeGreaterThan(0)
    })

    it('should show empty state when no quotations', async () => {
      const store = useQuotationsStore()
      // Limpiar cotizaciones para test
      store.quotations.value = []

      const wrapper = mount(QuotationsListView, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      
      const emptyState = wrapper.find('.text-center')
      expect(emptyState.exists()).toBe(true)
      expect(emptyState.text()).toContain('No hay cotizaciones')
    })
  })

  describe('ClientsView', () => {
    it('should render without errors', async () => {
      const wrapper = mount(ClientsView, {
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('h1').text()).toContain('Gestión de Clientes')
    })

    it('should have new client button', async () => {
      const wrapper = mount(ClientsView, {
        global: {
          plugins: [router]
        }
      })

      const newClientBtn = wrapper.find('button')
      expect(newClientBtn.exists()).toBe(true)
      expect(newClientBtn.text()).toContain('Nuevo Cliente')
    })
  })

  describe('Store Integration', () => {
    it('should initialize store data correctly', async () => {
      const store = useQuotationsStore()
      await store.initialize()

      expect(store.quotations).toBeDefined()
      expect(store.clients).toBeDefined()
      expect(Array.isArray(store.quotations.value)).toBe(true)
      expect(Array.isArray(store.clients.value)).toBe(true)
    })

    it('should have helper functions working', async () => {
      const store = useQuotationsStore()
      await store.initialize()

      // Test getClientById
      if (store.clients.value.length > 0) {
        const firstClient = store.clients.value[0]
        const foundClient = store.getClientById(firstClient.id)
        expect(foundClient).toBeDefined()
        expect(foundClient?.id).toBe(firstClient.id)
      }
    })
  })
})
