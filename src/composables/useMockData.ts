import { ref } from 'vue'
import mockData from '@/data/mock-data.json'
import type { Client, Quotation } from '@/types'

export function useMockData() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadMockData = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return {
        clients: mockData.clients as Client[],
        quotations: mockData.quotations as Quotation[]
      }
    } catch (err) {
      error.value = 'Error al cargar datos mock'
      console.error('Error loading mock data:', err)
      return { clients: [], quotations: [] }
    } finally {
      isLoading.value = false
    }
  }

  const initializeMockData = async () => {
    const { clients, quotations } = await loadMockData()
    
    // Cargar en localStorage si está vacío
    const existingClients = localStorage.getItem('clients')
    const existingQuotations = localStorage.getItem('quotations')
    
    if (!existingClients || JSON.parse(existingClients).length === 0) {
      localStorage.setItem('clients', JSON.stringify(clients))
      console.log('✅ Clientes mock cargados:', clients.length)
    }
    
    if (!existingQuotations || JSON.parse(existingQuotations).length === 0) {
      localStorage.setItem('quotations', JSON.stringify(quotations))
      console.log('✅ Cotizaciones mock cargadas:', quotations.length)
    }
    
    return { clients, quotations }
  }

  const clearMockData = () => {
    localStorage.removeItem('clients')
    localStorage.removeItem('quotations')
    console.log('🗑️ Datos mock eliminados')
  }

  const resetMockData = async () => {
    clearMockData()
    return await initializeMockData()
  }

  return {
    isLoading,
    error,
    loadMockData,
    initializeMockData,
    clearMockData,
    resetMockData
  }
}
