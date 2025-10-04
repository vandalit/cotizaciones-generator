import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useQuotationsStore } from '@/stores/quotations'

describe('Store Direct Test', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('should access store properties directly', async () => {
    const store = useQuotationsStore()
    
    console.log('🔍 Direct store access test')
    console.log('- Store object keys:', Object.keys(store))
    console.log('- quotations property:', store.quotations)
    console.log('- clients property:', store.clients)
    
    // Try to access the internal state directly
    console.log('- store.$state:', store.$state)
    
    // Initialize and check again
    await store.initialize()
    
    console.log('🔍 After initialization:')
    console.log('- quotations:', store.quotations)
    console.log('- clients:', store.clients)
    console.log('- store.$state:', store.$state)
    
    // Check if the arrays exist in the state
    if (store.$state) {
      console.log('- $state.quotations:', store.$state.quotations)
      console.log('- $state.clients:', store.$state.clients)
    }
    
    expect(store).toBeDefined()
  })

  it('should check localStorage content', async () => {
    console.log('🔍 localStorage test')
    
    // Set some test data
    localStorage.setItem('test', 'value')
    console.log('- localStorage test item:', localStorage.getItem('test'))
    
    const store = useQuotationsStore()
    await store.initialize()
    
    console.log('- localStorage clients:', localStorage.getItem('clients'))
    console.log('- localStorage quotations:', localStorage.getItem('quotations'))
    
    expect(localStorage.getItem('test')).toBe('value')
  })

  it('should test mock data loading', async () => {
    console.log('🔍 Mock data loading test')
    
    const { useMockData } = await import('@/composables/useMockData')
    const mockData = useMockData()
    
    console.log('- Mock data composable:', !!mockData)
    console.log('- Mock data methods:', Object.keys(mockData))
    
    const result = await mockData.initializeMockData()
    console.log('- Mock data result:', result)
    
    console.log('- localStorage after mock:', {
      clients: localStorage.getItem('clients'),
      quotations: localStorage.getItem('quotations')
    })
    
    expect(mockData).toBeDefined()
  })
})
