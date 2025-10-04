import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import NewQuotationModal from '@/components/NewQuotationModal.vue'
import { useQuotationsStore } from '@/stores/quotations'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } }
  ]
})

describe('Modal Debug Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should render modal and show clients', async () => {
    console.log('🔍 Testing modal with clients...')
    
    const store = useQuotationsStore()
    await store.initialize()
    
    console.log('📊 Store state:')
    console.log('- Total clients:', store.totalClients)
    console.log('- Clients array length:', store.clients?.length || 0)
    
    const wrapper = mount(NewQuotationModal, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    // Check modal structure
    expect(wrapper.find('[data-cy="new-quotation-modal"]').exists()).toBe(true)
    console.log('✅ Modal container found')
    
    expect(wrapper.find('[data-cy="modal-title"]').exists()).toBe(true)
    console.log('✅ Modal title found')
    
    expect(wrapper.find('[data-cy="quotation-form"]').exists()).toBe(true)
    console.log('✅ Form found')
    
    const clientSelect = wrapper.find('[data-cy="client-select"]')
    expect(clientSelect.exists()).toBe(true)
    console.log('✅ Client select found')
    
    // Check options
    const options = clientSelect.findAll('option')
    console.log(`📋 Found ${options.length} options in select`)
    
    // Should have placeholder + 3 clients = 4 options
    expect(options.length).toBe(4)
    
    // Check option texts
    options.forEach((option, index) => {
      console.log(`- Option ${index}: ${option.text()}`)
    })
    
    console.log('✅ Modal rendering test passed')
  })

  it('should handle form submission', async () => {
    console.log('🔍 Testing form submission...')
    
    const store = useQuotationsStore()
    await store.initialize()
    
    const initialCount = store.totalQuotations
    console.log('📊 Initial quotations:', initialCount)
    
    const wrapper = mount(NewQuotationModal, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    // Select first client
    const clientSelect = wrapper.find('[data-cy="client-select"]')
    const options = clientSelect.findAll('option')
    
    if (options.length > 1) {
      const firstClientValue = options[1].attributes('value')
      console.log('👤 Selecting client with ID:', firstClientValue)
      
      await clientSelect.setValue(firstClientValue)
      
      // Submit form
      const form = wrapper.find('[data-cy="quotation-form"]')
      await form.trigger('submit')
      
      // Check if quotation was created
      const newCount = store.totalQuotations
      console.log('📊 New quotations count:', newCount)
      
      expect(newCount).toBe(initialCount + 1)
      
      // Check if created event was emitted
      expect(wrapper.emitted('created')).toBeTruthy()
      console.log('✅ Created event emitted')
      
      console.log('✅ Form submission test passed')
    } else {
      console.log('❌ No clients available for testing')
    }
  })

  it('should test close functionality', async () => {
    console.log('🔍 Testing modal close...')
    
    const wrapper = mount(NewQuotationModal, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    // Test close button
    const closeButton = wrapper.find('[data-cy="close-modal"]')
    expect(closeButton.exists()).toBe(true)
    console.log('✅ Close button found')
    
    await closeButton.trigger('click')
    
    // Check if close event was emitted
    expect(wrapper.emitted('close')).toBeTruthy()
    console.log('✅ Close event emitted')
    
    console.log('✅ Close functionality test passed')
  })
})
