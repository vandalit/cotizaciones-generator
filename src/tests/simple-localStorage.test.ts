import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useQuotationsStore } from '@/stores/quotations'

describe('Simple localStorage Test', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should load mock data into localStorage', async () => {
    console.log('🔍 Testing localStorage loading...')
    
    const store = useQuotationsStore()
    
    console.log('📊 Before initialization:')
    console.log('- localStorage clients:', localStorage.getItem('clients'))
    console.log('- localStorage quotations:', localStorage.getItem('quotations'))
    
    await store.initialize()
    
    console.log('📊 After initialization:')
    const clientsData = localStorage.getItem('clients')
    const quotationsData = localStorage.getItem('quotations')
    
    console.log('- localStorage clients exists:', !!clientsData)
    console.log('- localStorage quotations exists:', !!quotationsData)
    
    if (quotationsData) {
      const quotations = JSON.parse(quotationsData)
      console.log('- Quotations count:', quotations.length)
      console.log('- First quotation number:', quotations[0]?.number)
      console.log('- Quotation statuses:', quotations.map((q: any) => q.status))
    }
    
    if (clientsData) {
      const clients = JSON.parse(clientsData)
      console.log('- Clients count:', clients.length)
      console.log('- Client names:', clients.map((c: any) => c.name))
    }
    
    console.log('📊 Store computed values:')
    console.log('- totalQuotations:', store.totalQuotations)
    console.log('- totalClients:', store.totalClients)
    console.log('- approvedQuotations:', store.approvedQuotations)
    console.log('- pendingQuotations:', store.pendingQuotations)
    
    expect(store.totalQuotations).toBe(3)
    expect(store.totalClients).toBe(3)
    expect(store.approvedQuotations).toBe(1)
    expect(store.pendingQuotations).toBe(1)
    
    console.log('✅ localStorage test passed')
  })

  it('should create new quotation', async () => {
    console.log('🔍 Testing quotation creation...')
    
    const store = useQuotationsStore()
    await store.initialize()
    
    const initialCount = store.totalQuotations
    console.log('📊 Initial quotations count:', initialCount)
    
    // Get first client
    const clients = store.clients
    if (clients && clients.length > 0) {
      const clientId = clients[0].id
      console.log('👤 Using client:', clients[0].name)
      
      // Create new quotation
      const newQuotation = store.createQuotation(clientId, 'Test Quotation from Debug')
      
      console.log('📋 Created quotation:')
      console.log('- ID:', newQuotation.id)
      console.log('- Number:', newQuotation.number)
      console.log('- Title:', newQuotation.title)
      console.log('- Status:', newQuotation.status)
      
      const newCount = store.totalQuotations
      console.log('📊 New quotations count:', newCount)
      
      expect(newCount).toBe(initialCount + 1)
      expect(newQuotation.title).toBe('Test Quotation from Debug')
      expect(newQuotation.status).toBe('draft')
      
      console.log('✅ Quotation creation test passed')
    } else {
      console.log('❌ No clients available for testing')
    }
  })
})
