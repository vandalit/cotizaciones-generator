import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Client, Quotation } from '@/types'
import { useMockData } from '@/composables/useMockData'

export const useQuotationsStore = defineStore('quotations', () => {
  // State
  const quotations = ref<Quotation[]>([])
  const clients = ref<Client[]>([])
  const currentQuotation = ref<Quotation | null>(null)
  const isInitialized = ref(false)
  
  // Configuración
  const companyInfo = ref({
    name: 'Tu Empresa',
    email: 'contacto@tuempresa.cl',
    phone: '+56 9 1234 5678',
    address: 'Tu Dirección, Santiago',
    rut: '12.345.678-9'
  })

  // Computed
  const totalQuotations = computed(() => quotations.value.length)
  const approvedQuotations = computed(() => 
    quotations.value.filter(q => q.status === 'approved').length
  )
  const pendingQuotations = computed(() => 
    quotations.value.filter(q => q.status === 'pending').length
  )
  const totalClients = computed(() => clients.value.length)
  const totalRevenue = computed(() => 
    quotations.value
      .filter(q => q.status === 'approved')
      .reduce((sum, q) => sum + q.totals.total, 0)
  )

  // Actions
  async function initialize() {
    if (isInitialized.value) return
    
    console.log('🔄 Inicializando store...')
    
    try {
      // Cargar desde localStorage primero
      loadFromLocalStorage()
      
      // Si no hay datos, cargar mock data
      if (clients.value.length === 0 && quotations.value.length === 0) {
        console.log('📦 Cargando datos mock...')
        const { initializeMockData } = useMockData()
        await initializeMockData()
        loadFromLocalStorage() // Recargar después de inicializar mock
      }
      
      isInitialized.value = true
      console.log('✅ Store inicializado:', {
        clients: clients.value.length,
        quotations: quotations.value.length
      })
    } catch (error) {
      console.error('❌ Error inicializando store:', error)
    }
  }

  function loadFromLocalStorage() {
    try {
      const storedClients = localStorage.getItem('clients')
      const storedQuotations = localStorage.getItem('quotations')
      
      if (storedClients) {
        clients.value = JSON.parse(storedClients)
      }
      
      if (storedQuotations) {
        quotations.value = JSON.parse(storedQuotations)
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }

  function saveToLocalStorage() {
    try {
      localStorage.setItem('clients', JSON.stringify(clients.value))
      localStorage.setItem('quotations', JSON.stringify(quotations.value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  function addClient(clientData: Omit<Client, 'id' | 'createdAt'>): Client {
    const client: Client = {
      ...clientData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }
    
    clients.value.push(client)
    saveToLocalStorage()
    return client
  }

  function updateClient(id: string, updates: Partial<Client>): void {
    const index = clients.value.findIndex(c => c.id === id)
    if (index !== -1) {
      clients.value[index] = {
        ...clients.value[index],
        ...updates
      }
      saveToLocalStorage()
    }
  }

  function deleteClient(id: string): void {
    const index = clients.value.findIndex(c => c.id === id)
    if (index !== -1) {
      clients.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  function generateQuotationNumber(): string {
    const year = new Date().getFullYear()
    const count = quotations.value.length + 1
    return `COT-${year}-${count.toString().padStart(3, '0')}`
  }

  function createQuotation(clientId: string, title?: string): Quotation {
    const client = clients.value.find(c => c.id === clientId)
    if (!client) throw new Error('Cliente no encontrado')
    
    const now = new Date().toISOString()
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + 30) // 30 días de validez
    
    const quotation: Quotation = {
      id: crypto.randomUUID(),
      clientId,
      number: generateQuotationNumber(),
      title: title || 'Nueva Cotización',
      status: 'draft',
      validUntil: validUntil.toISOString().split('T')[0], // YYYY-MM-DD
      createdAt: now,
      updatedAt: now,
      personalInfo: {
        companyName: client.name,
        contactName: client.contactPerson || '',
        email: client.email,
        phone: client.phone,
        address: client.address
      },
      projectAbstract: {
        title: title || 'Proyecto',
        description: '',
        objectives: []
      },
      deliverables: [],
      assumptions: [],
      timeline: {
        startDate: '',
        endDate: '',
        phases: []
      },
      commercialConditions: {
        currency: 'CLP',
        paymentTerms: '50% al inicio, 50% al finalizar',
        validityDays: 30,
        warranty: '3 meses',
        additionalTerms: []
      },
      optionalItems: [],
      bankingDetails: {
        bankName: 'Banco Estado',
        accountType: 'Cuenta Corriente',
        accountNumber: '12345678-9',
        rut: companyInfo.value.rut
      },
      notes: '',
      totals: {
        subtotal: 0,
        optionalSelected: 0,
        subtotalWithOptional: 0,
        tax: 0,
        total: 0
      }
    }
    
    quotations.value.push(quotation)
    saveToLocalStorage()
    return quotation
  }

  function updateQuotation(id: string, updates: Partial<Quotation>): void {
    const index = quotations.value.findIndex(q => q.id === id)
    if (index !== -1) {
      quotations.value[index] = {
        ...quotations.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveToLocalStorage()
    }
  }

  function deleteQuotation(id: string): void {
    const index = quotations.value.findIndex(q => q.id === id)
    if (index !== -1) {
      quotations.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  function getQuotationById(id: string): Quotation | undefined {
    return quotations.value.find(q => q.id === id)
  }

  function getClientById(id: string): Client | undefined {
    return clients.value.find(c => c.id === id)
  }

  // Funciones de utilidad para debugging
  async function resetData() {
    const { resetMockData } = useMockData()
    await resetMockData()
    loadFromLocalStorage()
    console.log('🔄 Datos reiniciados')
  }

  function exportData() {
    return {
      clients: clients.value,
      quotations: quotations.value,
      companyInfo: companyInfo.value
    }
  }

  return {
    // State
    quotations,
    clients,
    currentQuotation,
    companyInfo,
    isInitialized,
    
    // Computed
    totalQuotations,
    approvedQuotations,
    pendingQuotations,
    totalClients,
    totalRevenue,
    
    // Actions
    initialize,
    loadFromLocalStorage,
    saveToLocalStorage,
    addClient,
    updateClient,
    deleteClient,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    getQuotationById,
    getClientById,
    resetData,
    exportData
  }
})
