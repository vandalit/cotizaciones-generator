import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import { useQuotationsStore } from '@/stores/quotations'

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: DashboardView }
  ]
})

describe('Integration Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should render DashboardView with store data', async () => {
    console.log('🔍 Testing DashboardView integration...')
    
    const wrapper = mount(DashboardView, {
      global: {
        plugins: [router]
      }
    })

    // Wait for component to mount and initialize
    await wrapper.vm.$nextTick()
    
    console.log('✅ Component mounted')
    
    // Check if the component exists
    expect(wrapper.exists()).toBe(true)
    
    // Check if the header is rendered
    const header = wrapper.find('h1')
    expect(header.exists()).toBe(true)
    expect(header.text()).toContain('Generador de Cotizaciones')
    
    console.log('✅ Header rendered correctly')
    
    // Check if stats cards are rendered
    const statsCards = wrapper.findAll('.bento-box')
    console.log(`📊 Found ${statsCards.length} stats cards`)
    expect(statsCards.length).toBeGreaterThan(0)
    
    console.log('✅ DashboardView integration test passed')
  })

  it('should initialize store and display data', async () => {
    console.log('🔍 Testing store initialization in component context...')
    
    const store = useQuotationsStore()
    
    // Initialize store
    await store.initialize()
    
    console.log('📊 Store state after initialization:')
    console.log('- Total quotations computed:', store.totalQuotations)
    console.log('- Total clients computed:', store.totalClients)
    console.log('- Approved quotations computed:', store.approvedQuotations)
    console.log('- Pending quotations computed:', store.pendingQuotations)
    console.log('- Total revenue computed:', store.totalRevenue)
    
    // Test computed properties
    expect(typeof store.totalQuotations).toBe('number')
    expect(typeof store.totalClients).toBe('number')
    expect(typeof store.approvedQuotations).toBe('number')
    expect(typeof store.pendingQuotations).toBe('number')
    expect(typeof store.totalRevenue).toBe('number')
    
    console.log('✅ Store computed properties working correctly')
  })

  it('should test helper functions', async () => {
    console.log('🔍 Testing store helper functions...')
    
    const store = useQuotationsStore()
    await store.initialize()
    
    // Test getClientById if there are clients
    console.log('📋 Testing getClientById...')
    
    // Get all clients through computed property
    const totalClients = store.totalClients
    console.log(`- Total clients: ${totalClients}`)
    
    if (totalClients > 0) {
      // We know there should be clients, let's try to access them through localStorage
      const clientsData = localStorage.getItem('clients')
      console.log('- Clients in localStorage:', !!clientsData)
      
      if (clientsData) {
        const clients = JSON.parse(clientsData)
        console.log('- First client ID:', clients[0]?.id)
        
        if (clients[0]?.id) {
          const foundClient = store.getClientById(clients[0].id)
          console.log('- Found client:', !!foundClient)
          expect(foundClient).toBeDefined()
        }
      }
    }
    
    console.log('✅ Helper functions test completed')
  })
})
