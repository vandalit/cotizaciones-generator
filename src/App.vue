<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuotationsStore } from '@/stores/quotations'
import AppNavbar from '@/components/AppNavbar.vue'

const store = useQuotationsStore()

onMounted(async () => {
  await store.initialize()
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <AppNavbar />
    
    <!-- Main Content -->
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
