#!/usr/bin/env node

/**
 * Script de test para verificar clases CSS en Tailwind v4
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🧪 Iniciando tests de CSS...\n');

// Test 1: Verificar que el servidor esté funcionando
console.log('1️⃣ Verificando servidor...');
try {
  const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:5173', { encoding: 'utf8' });
  if (response.trim() === '200') {
    console.log('✅ Servidor funcionando en http://localhost:5173\n');
  } else {
    console.log('❌ Servidor no responde correctamente\n');
  }
} catch (error) {
  console.log('❌ Error al verificar servidor:', error.message, '\n');
}

// Test 2: Verificar archivos de configuración
console.log('2️⃣ Verificando archivos de configuración...');

const files = [
  'vite.config.ts',
  'src/style.css',
  'tailwind.config.js'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} no encontrado`);
  }
});

// Test 3: Verificar contenido del CSS
console.log('\n3️⃣ Verificando contenido CSS...');
try {
  const cssContent = fs.readFileSync('src/style.css', 'utf8');
  
  const checks = [
    { pattern: '@import "tailwindcss"', name: 'Import de Tailwind v4' },
    { pattern: '@theme', name: 'Configuración @theme' },
    { pattern: '@utility shadow-bento', name: 'Utilidad shadow-bento' },
    { pattern: '@layer components', name: 'Layer components' },
    { pattern: '.bento-box', name: 'Clase bento-box' }
  ];
  
  checks.forEach(check => {
    if (cssContent.includes(check.pattern)) {
      console.log(`✅ ${check.name} encontrado`);
    } else {
      console.log(`❌ ${check.name} no encontrado`);
    }
  });
} catch (error) {
  console.log('❌ Error al leer CSS:', error.message);
}

// Test 4: Verificar configuración de Vite
console.log('\n4️⃣ Verificando configuración Vite...');
try {
  const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
  
  if (viteConfig.includes('@tailwindcss/vite')) {
    console.log('✅ Plugin @tailwindcss/vite configurado');
  } else {
    console.log('❌ Plugin @tailwindcss/vite no encontrado');
  }
  
  if (viteConfig.includes('tailwindcss()')) {
    console.log('✅ Plugin tailwindcss() agregado');
  } else {
    console.log('❌ Plugin tailwindcss() no agregado');
  }
} catch (error) {
  console.log('❌ Error al leer Vite config:', error.message);
}

// Test 5: Verificar dependencias
console.log('\n5️⃣ Verificando dependencias...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const deps = [
    '@tailwindcss/vite',
    'tailwindcss',
    'autoprefixer'
  ];
  
  deps.forEach(dep => {
    if (packageJson.devDependencies?.[dep] || packageJson.dependencies?.[dep]) {
      console.log(`✅ ${dep} instalado`);
    } else {
      console.log(`❌ ${dep} no instalado`);
    }
  });
} catch (error) {
  console.log('❌ Error al leer package.json:', error.message);
}

console.log('\n🎯 Recomendaciones:');
console.log('1. Visita http://localhost:5173/test para ver el test visual');
console.log('2. Las clases @layer components pueden no funcionar en Tailwind v4');
console.log('3. Considera convertir .bento-box a @utility o usar clases inline');
console.log('4. Verifica la consola del navegador para errores CSS');

console.log('\n✨ Test completado!');
