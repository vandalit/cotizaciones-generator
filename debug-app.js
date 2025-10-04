#!/usr/bin/env node

/**
 * Script de debugging para la aplicación de cotizaciones
 */

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔍 DEBUGGING APLICACIÓN DE COTIZACIONES\n');

// 1. Verificar localStorage
console.log('1️⃣ Verificando datos en localStorage...');
try {
  // Simular acceso a localStorage (en el navegador)
  console.log('   📝 Para verificar localStorage, abre DevTools y ejecuta:');
  console.log('   📝 console.log("Clients:", JSON.parse(localStorage.getItem("clients") || "[]"))');
  console.log('   📝 console.log("Quotations:", JSON.parse(localStorage.getItem("quotations") || "[]"))');
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

// 2. Verificar estructura de archivos
console.log('\n2️⃣ Verificando estructura de archivos...');
const criticalFiles = [
  'src/stores/quotations.ts',
  'src/components/NewQuotationModal.vue',
  'src/views/DashboardView.vue',
  'src/data/mock-data.json',
  'src/types/index.ts'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`   ✅ ${file} (${stats.size} bytes)`);
  } else {
    console.log(`   ❌ ${file} NO ENCONTRADO`);
  }
});

// 3. Verificar tipos e interfaces
console.log('\n3️⃣ Verificando tipos e interfaces...');
try {
  if (fs.existsSync('src/types/index.ts')) {
    const typesContent = fs.readFileSync('src/types/index.ts', 'utf8');
    const hasClient = typesContent.includes('interface Client');
    const hasQuotation = typesContent.includes('interface Quotation');
    
    console.log(`   ${hasClient ? '✅' : '❌'} Interface Client definida`);
    console.log(`   ${hasQuotation ? '✅' : '❌'} Interface Quotation definida`);
  } else {
    console.log('   ❌ Archivo de tipos no encontrado');
  }
} catch (error) {
  console.log('   ❌ Error leyendo tipos:', error.message);
}

// 4. Verificar store de Pinia
console.log('\n4️⃣ Verificando store de Pinia...');
try {
  const storeContent = fs.readFileSync('src/stores/quotations.ts', 'utf8');
  
  const checks = [
    { pattern: 'defineStore', name: 'defineStore importado' },
    { pattern: 'createQuotation', name: 'Método createQuotation' },
    { pattern: 'localStorage', name: 'Persistencia localStorage' },
    { pattern: 'interface Client', name: 'Interface Client en store' },
    { pattern: 'interface Quotation', name: 'Interface Quotation en store' }
  ];
  
  checks.forEach(check => {
    const found = storeContent.includes(check.pattern);
    console.log(`   ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('   ❌ Error leyendo store:', error.message);
}

// 5. Verificar datos mock
console.log('\n5️⃣ Verificando datos mock...');
try {
  const mockData = JSON.parse(fs.readFileSync('src/data/mock-data.json', 'utf8'));
  
  console.log(`   ✅ Clientes mock: ${mockData.clients?.length || 0}`);
  console.log(`   ✅ Cotizaciones mock: ${mockData.quotations?.length || 0}`);
  
  if (mockData.clients?.length > 0) {
    const firstClient = mockData.clients[0];
    console.log(`   📋 Primer cliente: ${firstClient.name} (${firstClient.id})`);
  }
} catch (error) {
  console.log('   ❌ Error leyendo mock data:', error.message);
}

// 6. Verificar componentes críticos
console.log('\n6️⃣ Verificando componentes críticos...');
try {
  const modalContent = fs.readFileSync('src/components/NewQuotationModal.vue', 'utf8');
  
  const modalChecks = [
    { pattern: 'useQuotationsStore', name: 'Store importado en modal' },
    { pattern: 'createQuotation', name: 'Método createQuotation llamado' },
    { pattern: 'selectedClientId', name: 'Variable selectedClientId' },
    { pattern: 'v-model="selectedClientId"', name: 'v-model en select' },
    { pattern: 'clients', name: 'Lista de clientes' }
  ];
  
  modalChecks.forEach(check => {
    const found = modalContent.includes(check.pattern);
    console.log(`   ${found ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('   ❌ Error leyendo modal:', error.message);
}

// 7. Verificar servidor
console.log('\n7️⃣ Verificando servidor...');
try {
  const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:5173', { encoding: 'utf8' });
  if (response.trim() === '200') {
    console.log('   ✅ Servidor funcionando en http://localhost:5173');
  } else {
    console.log('   ❌ Servidor no responde correctamente');
  }
} catch (error) {
  console.log('   ❌ Error verificando servidor:', error.message);
}

console.log('\n🎯 POSIBLES PROBLEMAS IDENTIFICADOS:');
console.log('1. Discrepancia entre interfaces del store y datos mock');
console.log('2. localStorage puede estar vacío');
console.log('3. Store puede no estar inicializando datos correctamente');
console.log('4. Modal puede no estar recibiendo lista de clientes');

console.log('\n🔧 PASOS PARA DEBUGGEAR:');
console.log('1. Abrir DevTools en http://localhost:5173');
console.log('2. Verificar errores en Console');
console.log('3. Revisar Network tab para requests fallidos');
console.log('4. Verificar localStorage en Application tab');
console.log('5. Probar crear cliente primero');

console.log('\n✨ Debugging completado!');
