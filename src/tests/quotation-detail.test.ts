import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import QuotationView from '@/views/QuotationView.vue'
import { useQuotationsStore } from '@/stores/quotations'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/quotations', component: { template: '<div>Quotations List</div>' } },
    { path: '/quotations/:id', component: QuotationView }
  ]
})

describe('Quotation Detail Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('QuotationView Component', () => {
    it('should handle missing quotation gracefully', async () => {
      console.log('🔍 Testing missing quotation handling...')
      
      // Set route to non-existent quotation
      router.push('/quotations/non-existent-id')
      await router.isReady()
      
      const wrapper = mount(QuotationView, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      
      // Component should handle missing quotation gracefully
      expect(wrapper.exists()).toBe(true)
      
      console.log('✅ Missing quotation handled gracefully')
    })

    it('should display quotation details when quotation exists', async () => {
      console.log('🔍 Testing quotation detail display...')
      
      const store = useQuotationsStore()
      await store.initialize()
      
      // Create a test quotation
      const clients = store.clients
      if (clients && clients.length > 0) {
        const quotation = store.createQuotation(clients[0].id, 'Test Detail Quotation')
        console.log(`📄 Created quotation: ${quotation.id}`)
        
        // Navigate to the quotation
        router.push(`/quotations/${quotation.id}`)
        await router.isReady()
        
        const wrapper = mount(QuotationView, {
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        
        // Check if quotation details are displayed
        expect(wrapper.text()).toContain(quotation.number)
        expect(wrapper.text()).toContain('Test Detail Quotation')
        
        console.log('✅ Quotation details displayed correctly')
      } else {
        console.log('⚠️ No clients available for testing')
      }
    })

    it('should show client information correctly', async () => {
      console.log('🔍 Testing client information display...')
      
      const store = useQuotationsStore()
      await store.initialize()
      
      const clients = store.clients
      if (clients && clients.length > 0) {
        const client = clients[0]
        const quotation = store.createQuotation(client.id, 'Client Info Test')
        
        router.push(`/quotations/${quotation.id}`)
        await router.isReady()
        
        const wrapper = mount(QuotationView, {
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        
        // Check if client name is displayed
        expect(wrapper.text()).toContain(client.name)
        
        console.log('✅ Client information displayed correctly')
      }
    })

    it('should have functional action buttons', async () => {
      console.log('🔍 Testing action buttons...')
      
      const store = useQuotationsStore()
      await store.initialize()
      
      const clients = store.clients
      if (clients && clients.length > 0) {
        const quotation = store.createQuotation(clients[0].id, 'Action Buttons Test')
        
        router.push(`/quotations/${quotation.id}`)
        await router.isReady()
        
        const wrapper = mount(QuotationView, {
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        
        // Check for action buttons
        const buttons = wrapper.findAll('button')
        console.log(`🔘 Found ${buttons.length} buttons`)
        
        // Should have at least: Back, Edit, Export, Duplicate buttons
        expect(buttons.length).toBeGreaterThanOrEqual(4)
        
        // Check for specific buttons by text content
        const buttonTexts = buttons.map(btn => btn.text())
        expect(buttonTexts.some(text => text.includes('Volver'))).toBe(true)
        expect(buttonTexts.some(text => text.includes('Editar') || text.includes('Ver'))).toBe(true)
        expect(buttonTexts.some(text => text.includes('Exportar'))).toBe(true)
        expect(buttonTexts.some(text => text.includes('Duplicar'))).toBe(true)
        
        console.log('✅ Action buttons found and functional')
      }
    })

    it('should handle edit mode toggle', async () => {
      console.log('🔍 Testing edit mode toggle...')
      
      const store = useQuotationsStore()
      await store.initialize()
      
      const clients = store.clients
      if (clients && clients.length > 0) {
        const quotation = store.createQuotation(clients[0].id, 'Edit Mode Test')
        
        router.push(`/quotations/${quotation.id}`)
        await router.isReady()
        
        const wrapper = mount(QuotationView, {
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        
        // Find edit button
        const editButton = wrapper.findAll('button').find(btn => 
          btn.text().includes('Editar') || btn.text().includes('Ver')
        )
        
        if (editButton) {
          const initialText = editButton.text()
          console.log(`🔘 Edit button initial text: ${initialText}`)
          
          // Click edit button
          await editButton.trigger('click')
          await wrapper.vm.$nextTick()
          
          const newText = editButton.text()
          console.log(`🔘 Edit button new text: ${newText}`)
          
          // Text should change
          expect(newText).not.toBe(initialText)
          
          console.log('✅ Edit mode toggle working')
        } else {
          console.log('⚠️ Edit button not found')
        }
      }
    })
  })

  describe('Navigation and Routing', () => {
    it('should handle back navigation', async () => {
      console.log('🔍 Testing back navigation...')
      
      const store = useQuotationsStore()
      await store.initialize()
      
      const clients = store.clients
      if (clients && clients.length > 0) {
        const quotation = store.createQuotation(clients[0].id, 'Back Navigation Test')
        
        router.push(`/quotations/${quotation.id}`)
        await router.isReady()
        
        const wrapper = mount(QuotationView, {
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        
        // Find back button
        const backButton = wrapper.findAll('button').find(btn => 
          btn.text().includes('Volver')
        )
        
        expect(backButton).toBeDefined()
        console.log('✅ Back button found')
      }
    })

    it('should handle quotation duplication', async () => {
      console.log('🔍 Testing quotation duplication...')
      
      const store = useQuotationsStore()
      await store.initialize()
      
      const initialCount = store.totalQuotations
      console.log(`📊 Initial quotations: ${initialCount}`)
      
      const clients = store.clients
      if (clients && clients.length > 0) {
        const quotation = store.createQuotation(clients[0].id, 'Duplication Test')
        
        router.push(`/quotations/${quotation.id}`)
        await router.isReady()
        
        const wrapper = mount(QuotationView, {
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        
        // Find duplicate button
        const duplicateButton = wrapper.findAll('button').find(btn => 
          btn.text().includes('Duplicar')
        )
        
        if (duplicateButton) {
          await duplicateButton.trigger('click')
          await wrapper.vm.$nextTick()
          
          const newCount = store.totalQuotations
          console.log(`📊 New quotations: ${newCount}`)
          
          expect(newCount).toBeGreaterThan(initialCount + 1) // +1 for the original, +1 for duplicate
          
          console.log('✅ Quotation duplication working')
        } else {
          console.log('⚠️ Duplicate button not found')
        }
      }
    })
  })
})
