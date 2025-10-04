import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import QuotationsListView from '@/views/QuotationsListView.vue'
import ClientsView from '@/views/ClientsView.vue'
import { useQuotationsStore } from '@/stores/quotations'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: DashboardView },
    { path: '/quotations', component: QuotationsListView },
    { path: '/clients', component: ClientsView }
  ]
})

describe('Final Validation Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('Store Functionality', () => {
    it('should initialize store with mock data', async () => {
      console.log('🔍 Validating store initialization...')
      
      const store = useQuotationsStore()
      await store.initialize()
      
      // Test computed properties
      expect(store.totalQuotations).toBeGreaterThanOrEqual(0)
      expect(store.totalClients).toBeGreaterThanOrEqual(0)
      expect(store.approvedQuotations).toBeGreaterThanOrEqual(0)
      expect(store.pendingQuotations).toBeGreaterThanOrEqual(0)
      expect(store.totalRevenue).toBeGreaterThanOrEqual(0)
      
      console.log('✅ Store computed properties validated')
      
      // Test helper functions
      expect(typeof store.getClientById).toBe('function')
      expect(typeof store.createQuotation).toBe('function')
      expect(typeof store.updateQuotation).toBe('function')
      expect(typeof store.deleteQuotation).toBe('function')
      expect(typeof store.exportData).toBe('function')
      
      console.log('✅ Store methods validated')
    })
  })

  describe('View Components', () => {
    it('should render DashboardView correctly', async () => {
      console.log('🔍 Validating DashboardView...')
      
      const wrapper = mount(DashboardView, {
        global: { plugins: [router] }
      })

      await wrapper.vm.$nextTick()
      
      // Check header
      expect(wrapper.find('h1').text()).toContain('Generador de Cotizaciones')
      
      // Check stats cards exist
      const statsCards = wrapper.findAll('.bento-box')
      expect(statsCards.length).toBeGreaterThan(0)
      
      // Check new quotation button exists
      const newQuotationBtn = wrapper.find('button')
      expect(newQuotationBtn.exists()).toBe(true)
      
      console.log('✅ DashboardView validated')
    })

    it('should render QuotationsListView correctly', async () => {
      console.log('🔍 Validating QuotationsListView...')
      
      const wrapper = mount(QuotationsListView, {
        global: { plugins: [router] }
      })

      await wrapper.vm.$nextTick()
      
      // Check header
      expect(wrapper.find('h1').text()).toContain('Todas las Cotizaciones')
      
      // Check stats cards for quotation statuses
      const statsCards = wrapper.findAll('.bento-box')
      expect(statsCards.length).toBeGreaterThan(0)
      
      console.log('✅ QuotationsListView validated')
    })

    it('should render ClientsView correctly', async () => {
      console.log('🔍 Validating ClientsView...')
      
      const wrapper = mount(ClientsView, {
        global: { plugins: [router] }
      })

      await wrapper.vm.$nextTick()
      
      // Check header
      expect(wrapper.find('h1').text()).toContain('Gestión de Clientes')
      
      // Check new client button exists
      const newClientBtn = wrapper.find('button')
      expect(newClientBtn.exists()).toBe(true)
      
      console.log('✅ ClientsView validated')
    })
  })

  describe('Error Handling', () => {
    it('should handle missing data gracefully', async () => {
      console.log('🔍 Validating error handling...')
      
      const store = useQuotationsStore()
      
      // Test with non-existent client ID
      const nonExistentClient = store.getClientById('non-existent-id')
      expect(nonExistentClient).toBeUndefined()
      
      console.log('✅ Error handling validated')
    })
  })

  describe('Data Persistence', () => {
    it('should persist data to localStorage', async () => {
      console.log('🔍 Validating data persistence...')
      
      const store = useQuotationsStore()
      await store.initialize()
      
      // Check that data was saved to localStorage
      const clientsData = localStorage.getItem('clients')
      const quotationsData = localStorage.getItem('quotations')
      
      expect(clientsData).toBeTruthy()
      expect(quotationsData).toBeTruthy()
      
      // Verify data can be parsed
      expect(() => JSON.parse(clientsData!)).not.toThrow()
      expect(() => JSON.parse(quotationsData!)).not.toThrow()
      
      console.log('✅ Data persistence validated')
    })
  })
})
