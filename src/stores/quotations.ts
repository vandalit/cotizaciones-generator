import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Client {
  id: string
  name: string
  code: string
  email: string
  phone: string
  address: string
  rut?: string
  contactPerson?: string
  createdAt: Date
  updatedAt: Date
}

export interface QuotationItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Quotation {
  id: string
  code: string
  clientId: string
  client?: Client
  date: Date
  validUntil: Date
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired'
  
  // Secciones de la cotización
  projectAbstract: string
  items: QuotationItem[]
  deliverables: string[]
  assumptions: string[]
  timeline: string
  commercialConditions: string
  optionalItems: string[]
  bankingDetails: string
  notes: string
  
  // Totales
  subtotal: number
  tax: number
  total: number
  
  // Metadatos
  createdAt: Date
  updatedAt: Date
}

export const useQuotationsStore = defineStore('quotations', () => {
  // State
  const quotations = ref<Quotation[]>([])
  const clients = ref<Client[]>([])
  const currentQuotation = ref<Quotation | null>(null)
  
  // Configuración
  const companyInfo = ref({
    name: 'Tu Nombre',
    email: 'tu@email.com',
    phone: '+56 9 1234 5678',
    address: 'Tu Dirección',
    rut: '12.345.678-9',
    bankingDetails: 'Banco: Tu Banco\nCuenta: 123456789\nRUT: 12.345.678-9'
  })
  
  // Computed
  const quotationsByStatus = computed(() => {
    return {
      draft: quotations.value.filter(q => q.status === 'draft'),
      sent: quotations.value.filter(q => q.status === 'sent'),
      approved: quotations.value.filter(q => q.status === 'approved'),
      rejected: quotations.value.filter(q => q.status === 'rejected'),
      expired: quotations.value.filter(q => q.status === 'expired')
    }
  })
  
  const recentQuotations = computed(() => {
    return [...quotations.value]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
  })
  
  const totalRevenue = computed(() => {
    return quotations.value
      .filter(q => q.status === 'approved')
      .reduce((sum, q) => sum + q.total, 0)
  })
  
  // Actions
  function generateQuotationCode(clientCode?: string): string {
    const year = new Date().getFullYear()
    const clientPrefix = clientCode || 'GEN'
    
    // Contar cotizaciones del año actual para este cliente
    const currentYearQuotations = quotations.value.filter(q => {
      const quotationYear = new Date(q.date).getFullYear()
      return quotationYear === year && q.code.startsWith(clientPrefix)
    })
    
    const nextNumber = (currentYearQuotations.length + 1).toString().padStart(3, '0')
    return `${clientPrefix}-${year}-${nextNumber}`
  }
  
  function addClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
    const client: Client = {
      ...clientData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
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
        ...updates,
        updatedAt: new Date()
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
  
  function createQuotation(clientId: string): Quotation {
    const client = clients.value.find(c => c.id === clientId)
    if (!client) throw new Error('Cliente no encontrado')
    
    const quotation: Quotation = {
      id: crypto.randomUUID(),
      code: generateQuotationCode(client.code),
      clientId,
      client,
      date: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      status: 'draft',
      projectAbstract: '',
      items: [],
      deliverables: [],
      assumptions: [],
      timeline: '',
      commercialConditions: '',
      optionalItems: [],
      bankingDetails: companyInfo.value.bankingDetails,
      notes: '',
      subtotal: 0,
      tax: 0,
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    quotations.value.push(quotation)
    currentQuotation.value = quotation
    saveToLocalStorage()
    return quotation
  }
  
  function updateQuotation(id: string, updates: Partial<Quotation>): void {
    const index = quotations.value.findIndex(q => q.id === id)
    if (index !== -1) {
      quotations.value[index] = {
        ...quotations.value[index],
        ...updates,
        updatedAt: new Date()
      }
      
      // Recalcular totales si se actualizaron los items
      if (updates.items) {
        calculateTotals(quotations.value[index])
      }
      
      saveToLocalStorage()
    }
  }
  
  function calculateTotals(quotation: Quotation): void {
    const subtotal = quotation.items.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.19 // IVA 19%
    const total = subtotal + tax
    
    quotation.subtotal = subtotal
    quotation.tax = tax
    quotation.total = total
  }
  
  function deleteQuotation(id: string): void {
    const index = quotations.value.findIndex(q => q.id === id)
    if (index !== -1) {
      quotations.value.splice(index, 1)
      saveToLocalStorage()
    }
  }
  
  function duplicateQuotation(id: string): Quotation {
    const original = quotations.value.find(q => q.id === id)
    if (!original) throw new Error('Cotización no encontrada')
    
    const duplicate: Quotation = {
      ...original,
      id: crypto.randomUUID(),
      code: generateQuotationCode(original.client?.code),
      date: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    quotations.value.push(duplicate)
    saveToLocalStorage()
    return duplicate
  }
  
  // Persistencia
  function saveToLocalStorage(): void {
    try {
      localStorage.setItem('quotations-data', JSON.stringify({
        quotations: quotations.value,
        clients: clients.value,
        companyInfo: companyInfo.value,
        lastBackup: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }
  
  function loadFromLocalStorage(): void {
    try {
      const data = localStorage.getItem('quotations-data')
      if (data) {
        const parsed = JSON.parse(data)
        quotations.value = parsed.quotations || []
        clients.value = parsed.clients || []
        companyInfo.value = { ...companyInfo.value, ...parsed.companyInfo }
        
        // Convertir strings de fecha a objetos Date
        quotations.value.forEach(q => {
          q.date = new Date(q.date)
          q.validUntil = new Date(q.validUntil)
          q.createdAt = new Date(q.createdAt)
          q.updatedAt = new Date(q.updatedAt)
        })
        
        clients.value.forEach(c => {
          c.createdAt = new Date(c.createdAt)
          c.updatedAt = new Date(c.updatedAt)
        })
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }
  
  function clearAllData(): void {
    quotations.value = []
    clients.value = []
    currentQuotation.value = null
    localStorage.removeItem('quotations-data')
  }
  
  function exportToCSV(): string {
    const headers = ['Código', 'Cliente', 'Fecha', 'Estado', 'Total', 'Válida hasta']
    const rows = quotations.value.map(q => [
      q.code,
      q.client?.name || '',
      q.date.toLocaleDateString(),
      q.status,
      q.total.toFixed(2),
      q.validUntil.toLocaleDateString()
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }
  
  function getLastBackupDate(): Date | null {
    try {
      const data = localStorage.getItem('quotations-data')
      if (data) {
        const parsed = JSON.parse(data)
        return parsed.lastBackup ? new Date(parsed.lastBackup) : null
      }
    } catch (error) {
      console.error('Error getting last backup date:', error)
    }
    return null
  }
  
  // Inicializar datos de ejemplo si no hay datos
  function initializeSampleData(): void {
    if (clients.value.length === 0) {
      // Clientes de ejemplo
      addClient({
        name: 'Vertientes del Sur',
        code: 'VDS',
        email: 'contacto@vertientesdelsur.cl',
        phone: '+56 9 8765 4321',
        address: 'Av. Principal 123, Temuco',
        rut: '76.123.456-7',
        contactPerson: 'María González'
      })
      
      addClient({
        name: 'Universidad Bernardo O\'Higgins',
        code: 'UBO',
        email: 'proyectos@ubo.cl',
        phone: '+56 2 2477 2500',
        address: 'Av. Viel 1497, Santiago',
        rut: '71.543.200-5',
        contactPerson: 'Carlos Méndez'
      })
    }
  }
  
  return {
    // State
    quotations,
    clients,
    currentQuotation,
    companyInfo,
    
    // Computed
    quotationsByStatus,
    recentQuotations,
    totalRevenue,
    
    // Actions
    generateQuotationCode,
    addClient,
    updateClient,
    deleteClient,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    duplicateQuotation,
    calculateTotals,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearAllData,
    exportToCSV,
    getLastBackupDate,
    initializeSampleData
  }
})
