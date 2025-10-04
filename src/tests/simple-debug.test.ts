import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useQuotationsStore } from '@/stores/quotations'

describe('Simple Debug Test', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should create store instance', () => {
    const store = useQuotationsStore()
    console.log('🔍 Store created:', !!store)
    console.log('🔍 Store properties:', Object.keys(store))
    
    expect(store).toBeDefined()
  })

  it('should have reactive properties', () => {
    const store = useQuotationsStore()
    
    console.log('🔍 quotations type:', typeof store.quotations)
    console.log('🔍 quotations value type:', typeof store.quotations?.value)
    console.log('🔍 clients type:', typeof store.clients)
    console.log('🔍 clients value type:', typeof store.clients?.value)
    
    expect(store.quotations).toBeDefined()
    expect(store.clients).toBeDefined()
  })

  it('should initialize without errors', async () => {
    const store = useQuotationsStore()
    
    console.log('🔍 Before initialize:')
    console.log('- quotations:', store.quotations?.value?.length || 'undefined')
    console.log('- clients:', store.clients?.value?.length || 'undefined')
    
    try {
      await store.initialize()
      console.log('✅ Initialize completed')
      
      console.log('🔍 After initialize:')
      console.log('- quotations:', store.quotations?.value?.length || 'undefined')
      console.log('- clients:', store.clients?.value?.length || 'undefined')
      
      expect(store.quotations.value).toBeDefined()
      expect(store.clients.value).toBeDefined()
      expect(Array.isArray(store.quotations.value)).toBe(true)
      expect(Array.isArray(store.clients.value)).toBe(true)
    } catch (error) {
      console.error('❌ Initialize failed:', error)
      throw error
    }
  })
})
