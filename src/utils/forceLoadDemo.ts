import { useMockData } from '@/composables/useMockData'

export async function forceLoadDemoData() {
  console.log('🔄 Forzando carga de datos demo...')
  
  const { resetMockData } = useMockData()
  
  try {
    await resetMockData()
    console.log('✅ Datos demo cargados exitosamente')
    
    // Verificar datos
    const clients = localStorage.getItem('clients')
    const quotations = localStorage.getItem('quotations')
    
    if (clients && quotations) {
      const clientsData = JSON.parse(clients)
      const quotationsData = JSON.parse(quotations)
      
      console.log('📊 Datos cargados:')
      console.log('- Clientes:', clientsData.length)
      console.log('- Cotizaciones:', quotationsData.length)
      
      return {
        success: true,
        clients: clientsData.length,
        quotations: quotationsData.length
      }
    }
  } catch (error) {
    console.error('❌ Error cargando datos demo:', error)
    return {
      success: false,
      error: error
    }
  }
}

// Función para usar en consola del navegador
(window as any).forceLoadDemo = forceLoadDemoData
