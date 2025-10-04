import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useQuotationsStore } from '@/stores/quotations'
import type { Quotation, Client } from '@/types'

describe('Debug Tests - Store and Data Integrity', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Store Initialization', () => {
    it('should initialize store without errors', async () => {
      const store = useQuotationsStore()
      
      console.log('🔍 Testing store initialization...')
      
      try {
        await store.initialize()
        console.log('✅ Store initialized successfully')
        
        console.log('📊 Store state:')
        console.log('- Quotations count:', store.quotations.value.length)
        console.log('- Clients count:', store.clients.value.length)
        
        expect(store.quotations).toBeDefined()
        expect(store.clients).toBeDefined()
      } catch (error) {
        console.error('❌ Store initialization failed:', error)
        throw error
      }
    })

    it('should have correct data structure', async () => {
      const store = useQuotationsStore()
      await store.initialize()

      console.log('🔍 Testing data structure...')

      // Test quotations structure
      if (store.quotations.value.length > 0) {
        const quotation = store.quotations.value[0] as Quotation
        console.log('📋 Sample quotation structure:', {
          id: quotation.id,
          number: quotation.number,
          clientId: quotation.clientId,
          status: quotation.status,
          hasDeliverables: Array.isArray(quotation.deliverables),
          hasTotals: typeof quotation.totals === 'object',
          totalValue: quotation.totals?.total
        })

        expect(quotation.id).toBeDefined()
        expect(quotation.number).toBeDefined()
        expect(quotation.clientId).toBeDefined()
        expect(quotation.status).toBeDefined()
        expect(quotation.deliverables).toBeDefined()
        expect(quotation.totals).toBeDefined()
        expect(quotation.totals.total).toBeDefined()
      }

      // Test clients structure
      if (store.clients.value.length > 0) {
        const client = store.clients.value[0] as Client
        console.log('👤 Sample client structure:', {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone
        })

        expect(client.id).toBeDefined()
        expect(client.name).toBeDefined()
        expect(client.email).toBeDefined()
      }
    })
  })

  describe('Store Methods', () => {
    it('should have all required methods', async () => {
      const store = useQuotationsStore()
      await store.initialize()

      console.log('🔍 Testing store methods...')

      const methods = [
        'initialize',
        'getClientById',
        'createQuotation',
        'updateQuotation',
        'deleteQuotation',
        'createClient',
        'updateClient',
        'deleteClient',
        'exportData'
      ]

      methods.forEach(method => {
        console.log(`- ${method}:`, typeof store[method as keyof typeof store])
        expect(typeof store[method as keyof typeof store]).toBe('function')
      })
    })

    it('should get client by id correctly', async () => {
      const store = useQuotationsStore()
      await store.initialize()

      if (store.clients.value.length > 0) {
        const firstClient = store.clients.value[0]
        const foundClient = store.getClientById(firstClient.id)
        
        console.log('🔍 Testing getClientById:')
        console.log('- Looking for client:', firstClient.id)
        console.log('- Found client:', foundClient?.name)
        
        expect(foundClient).toBeDefined()
        expect(foundClient?.id).toBe(firstClient.id)
        expect(foundClient?.name).toBe(firstClient.name)
      }
    })
  })

  describe('Computed Properties', () => {
    it('should calculate stats correctly', async () => {
      const store = useQuotationsStore()
      await store.initialize()

      console.log('🔍 Testing computed properties...')

      const stats = {
        totalQuotations: store.totalQuotations,
        totalClients: store.totalClients,
        approvedQuotations: store.approvedQuotations,
        pendingQuotations: store.pendingQuotations,
        totalRevenue: store.totalRevenue
      }

      console.log('📊 Computed stats:', stats)

      expect(typeof stats.totalQuotations).toBe('number')
      expect(typeof stats.totalClients).toBe('number')
      expect(typeof stats.approvedQuotations).toBe('number')
      expect(typeof stats.pendingQuotations).toBe('number')
      expect(typeof stats.totalRevenue).toBe('number')

      expect(stats.totalQuotations).toBe(store.quotations.value.length)
      expect(stats.totalClients).toBe(store.clients.value.length)
    })
  })

  describe('Data Validation', () => {
    it('should have valid quotation statuses', async () => {
      const store = useQuotationsStore()
      await store.initialize()

      const validStatuses = ['draft', 'pending', 'approved', 'rejected', 'expired']
      
      store.quotations.value.forEach((quotation, index) => {
        console.log(`📋 Quotation ${index + 1} status:`, quotation.status)
        expect(validStatuses).toContain(quotation.status)
      })
    })

    it('should have valid date formats', async () => {
      const store = useQuotationsStore()
      await store.initialize()

      store.quotations.value.forEach((quotation, index) => {
        console.log(`📅 Quotation ${index + 1} dates:`, {
          createdAt: quotation.createdAt,
          updatedAt: quotation.updatedAt,
          validUntil: quotation.validUntil
        })

        // Test that dates can be parsed
        expect(() => new Date(quotation.createdAt)).not.toThrow()
        expect(() => new Date(quotation.updatedAt)).not.toThrow()
        expect(() => new Date(quotation.validUntil)).not.toThrow()
      })
    })
  })
})
