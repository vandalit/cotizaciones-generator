<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Test de Clases CSS</h1>
      
      <!-- Test de utilidades básicas de Tailwind -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">✅ Utilidades Básicas de Tailwind</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-md">
            <p class="text-primary-600">Color primario funcionando</p>
          </div>
          <div class="bg-gray-100 p-4 rounded-lg shadow-lg">
            <p class="text-gray-700">Sombras básicas funcionando</p>
          </div>
          <div class="bg-white p-4 rounded-xl border border-gray-200">
            <p class="text-gray-900">Bordes y rounded funcionando</p>
          </div>
        </div>
      </section>

      <!-- Test de utilidades personalizadas -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">🔧 Utilidades Personalizadas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-bento">
            <p class="text-gray-900">shadow-bento</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-bento-lg">
            <p class="text-gray-900">shadow-bento-lg</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-bento-xl">
            <p class="text-gray-900">shadow-bento-xl</p>
          </div>
        </div>
      </section>

      <!-- Test de clases de componentes (problemáticas) -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">❌ Clases de Componentes (Problemáticas)</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bento-box">
            <p class="text-gray-900">Clase bento-box</p>
          </div>
          <div class="bento-box-lg">
            <p class="text-gray-900">Clase bento-box-lg</p>
          </div>
          <div class="btn-primary">
            Botón primario
          </div>
        </div>
      </section>

      <!-- Test de clases alternativas -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">🔄 Clases Alternativas (Inline)</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-xl shadow-bento border border-gray-200 p-6 transition-all duration-200 hover:shadow-bento-lg">
            <p class="text-gray-900">Bento box inline</p>
          </div>
          <div class="bg-white rounded-xl shadow-bento-lg border border-gray-200 p-8 transition-all duration-200 hover:shadow-bento-xl">
            <p class="text-gray-900">Bento box lg inline</p>
          </div>
          <div class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            Botón inline
          </div>
        </div>
      </section>

      <!-- Test de animaciones -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">🎬 Animaciones</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <p class="text-gray-900">Animación fade-in</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md animate-slide-up">
            <p class="text-gray-900">Animación slide-up</p>
          </div>
        </div>
      </section>

      <!-- Debug info -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">🐛 Debug Info</h2>
        <div class="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm">
          <p>Tailwind CSS Version: v4.x</p>
          <p>Plugin: @tailwindcss/vite</p>
          <p>Config: CSS-first configuration</p>
          <p>Custom utilities: shadow-bento, shadow-bento-lg, shadow-bento-xl</p>
          <p>Problem: @layer components not working properly</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Test component para debuggear clases CSS
</script>
