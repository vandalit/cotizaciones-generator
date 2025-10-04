import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import NewQuotationModal from '@/components/NewQuotationModal.vue'
import { useQuotationsStore } from '@/stores/quotations'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/quotations/:id', component: { template: '<div>Quotation Detail</div>' } }
  ]
})

describe('Modal Functionality Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('NewQuotationModal', () => {
    it('should render modal correctly', async () => {
      console.log('🔍 Testing NewQuotationModal rendering...')
      
      const wrapper = mount(NewQuotationModal, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      
      // Check modal structure
      expect(wrapper.find('[data-cy="new-quotation-modal"]').exists()).toBe(true)
      expect(wrapper.find('[data-cy="modal-title"]').exists()).toBe(true)
      expect(wrapper.find('[data-cy="quotation-form"]').exists()).toBe(true)
      
      console.log('✅ Modal structure validated')
    })

    it('should show client selection dropdown', async () => {
      console.log('🔍 Testing client selection...')
      
      const store = useQuotationsStore()
      await store.initialize()
      
      const wrapper = mount(NewQuotationModal, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      
      // Check client dropdown
      const clientSelect = wrapper.find('[data-cy="client-select"]')
      expect(clientSelect.exists()).toBe(true)
      
      // Check if clients are loaded
      const options = clientSelect.findAll('option')
      console.log(`📋 Found ${options.length} client options`)
      expect(options.length).toBeGreaterThan(1) // At least placeholder + clients
      
      console.log('✅ Client selection validated')
    })

    it('should handle form submission', async () => {
      console.log('🔍 Testing form submission...')
      
      const store = useQuotationsStore()
      await store.initialize()
      
      const wrapper = mount(NewQuotationModal, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      
      // Get initial quotation count
      const initialCount = store.totalQuotations
      console.log(`📊 Initial quotations count: ${initialCount}`)
      
      // Select first client
      const clientSelect = wrapper.find('[data-cy="client-select"]')
      const clientOptions = clientSelect.findAll('option')
      
      if (clientOptions.length > 1) {
        const firstClientValue = clientOptions[1].attributes('value')
        await clientSelect.setValue(firstClientValue)
        
        // Submit form
        const form = wrapper.find('[data-cy="quotation-form"]')
        await form.trigger('submit')
        
        // Check if quotation was created
        const newCount = store.totalQuotations
        console.log(`📊 New quotations count: ${newCount}`)
        expect(newCount).toBeGreaterThan(initialCount)
        
        console.log('✅ Form submission validated')
      } else {
        console.log('⚠️ No clients available for testing')
      }
    })

    it('should emit events correctly', async () => {
      console.log('🔍 Testing modal events...')
      
      const wrapper = mount(NewQuotationModal, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      
      // Test close event
      const closeButton = wrapper.find('[data-cy="close-modal"]')
      expect(closeButton.exists()).toBe(true)
      
      await closeButton.trigger('click')
      
      // Check if close event was emitted
      expect(wrapper.emitted('close')).toBeTruthy()
      
      console.log('✅ Modal events validated')
    })
  })

  describe('Store Integration', () => {
    it('should create quotation through store', async () => {
      console.log('🔍 Testing store quotation creation...')
      
      const store = useQuotationsStore()
      await store.initialize()
      
      const initialCount = store.totalQuotations
      console.log(`📊 Initial count: ${initialCount}`)
      
      // Get first client ID
      const clients = store.clients
      if (clients && clients.length > 0) {
        const clientId = clients[0].id
        console.log(`👤 Using client ID: ${clientId}`)
        
        // Create quotation
        const quotation = store.createQuotation(clientId, 'Test Quotation')
        
        expect(quotation).toBeDefined()
        expect(quotation.clientId).toBe(clientId)
        expect(quotation.title).toBe('Test Quotation')
        expect(quotation.status).toBe('draft')
        
        const newCount = store.totalQuotations
        console.log(`📊 New count: ${newCount}`)
        expect(newCount).toBe(initialCount + 1)
        
        console.log('✅ Store quotation creation validated')
      } else {
        console.log('⚠️ No clients available in store')
      }
    })

    it('should persist quotation to localStorage', async () => {
      console.log('🔍 Testing localStorage persistence...')
      
      const store = useQuotationsStore()
      await store.initialize()
      
      const clients = store.clients
      if (clients && clients.length > 0) {
        const clientId = clients[0].id
        
        // Create quotation
        store.createQuotation(clientId, 'Persistence Test')
        
        // Check localStorage
        const quotationsData = localStorage.getItem('quotations')
        expect(quotationsData).toBeTruthy()
        
        const quotations = JSON.parse(quotationsData!)
        expect(Array.isArray(quotations)).toBe(true)
        
        const testQuotation = quotations.find((q: any) => q.title === 'Persistence Test')
        expect(testQuotation).toBeDefined()
        
        console.log('✅ localStorage persistence validated')
      }
    })
  })
})
