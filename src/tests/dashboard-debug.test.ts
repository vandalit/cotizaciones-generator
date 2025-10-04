import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import { useQuotationsStore } from '@/stores/quotations'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: DashboardView }
  ]
})

describe('Dashboard Debug Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should load mock data and display quotations', async () => {
    console.log('🔍 Testing dashboard data loading...')
    
    const store = useQuotationsStore()
    
    // Force initialize
    await store.initialize()
    
    console.log('📊 Store state after initialization:')
    console.log('- Total quotations:', store.totalQuotations)
    console.log('- Total clients:', store.totalClients)
    console.log('- Approved quotations:', store.approvedQuotations)
    console.log('- Pending quotations:', store.pendingQuotations)
    
    // Check localStorage
    const clientsData = localStorage.getItem('clients')
    const quotationsData = localStorage.getItem('quotations')
    
    console.log('💾 localStorage state:')
    console.log('- Clients data exists:', !!clientsData)
    console.log('- Quotations data exists:', !!quotationsData)
    
    if (clientsData) {
      const clients = JSON.parse(clientsData)
      console.log('- Clients count:', clients.length)
    }
    
    if (quotationsData) {
      const quotations = JSON.parse(quotationsData)
      console.log('- Quotations count:', quotations.length)
      console.log('- First quotation:', quotations[0]?.number)
    }
    
    expect(store.totalQuotations).toBeGreaterThan(0)
    expect(store.totalClients).toBeGreaterThan(0)
    
    console.log('✅ Data loading test passed')
  })

  it('should render dashboard with data', async () => {
    console.log('🔍 Testing dashboard rendering...')
    
    const wrapper = mount(DashboardView, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    // Check if dashboard renders
    expect(wrapper.find('[data-cy="dashboard-title"]').exists()).toBe(true)
    
    // Check for new quotation button
    const newQuotationButtons = wrapper.findAll('button').filter(btn => 
      btn.text().includes('Nueva Cotización')
    )
    
    console.log(`🔘 Found ${newQuotationButtons.length} "Nueva Cotización" buttons`)
    expect(newQuotationButtons.length).toBeGreaterThan(0)
    
    // Try clicking the first button
    if (newQuotationButtons.length > 0) {
      await newQuotationButtons[0].trigger('click')
      await wrapper.vm.$nextTick()
      
      // Check if modal appears
      const modal = wrapper.find('[data-cy="new-quotation-modal"]')
      console.log('📋 Modal visible after click:', modal.exists())
    }
    
    console.log('✅ Dashboard rendering test completed')
  })

  it('should test localStorage persistence', async () => {
    console.log('🔍 Testing localStorage persistence...')
    
    // Clear localStorage
    localStorage.clear()
    
    const store = useQuotationsStore()
    await store.initialize()
    
    // Check if data was loaded
    const clientsAfterInit = localStorage.getItem('clients')
    const quotationsAfterInit = localStorage.getItem('quotations')
    
    console.log('💾 After initialization:')
    console.log('- Clients in localStorage:', !!clientsAfterInit)
    console.log('- Quotations in localStorage:', !!quotationsAfterInit)
    
    if (quotationsAfterInit) {
      const quotations = JSON.parse(quotationsAfterInit)
      console.log('- Quotations loaded:', quotations.length)
      console.log('- Sample quotation numbers:', quotations.map((q: any) => q.number))
    }
    
    expect(clientsAfterInit).toBeTruthy()
    expect(quotationsAfterInit).toBeTruthy()
    
    console.log('✅ Persistence test passed')
  })
})
