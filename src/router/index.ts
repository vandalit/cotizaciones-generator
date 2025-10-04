import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import ClientsView from '@/views/ClientsView.vue'
import QuotationView from '@/views/QuotationView.vue'
import QuotationsListView from '@/views/QuotationsListView.vue'
import TestView from '@/views/TestView.vue'
import DebugView from '@/views/DebugView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        title: 'Dashboard - Generador de Cotizaciones'
      }
    },
    {
      path: '/clients',
      name: 'clients',
      component: ClientsView,
      meta: {
        title: 'Clientes - Generador de Cotizaciones'
      }
    },
    {
      path: '/quotations',
      name: 'quotations',
      component: QuotationsListView,
      meta: {
        title: 'Cotizaciones - Generador de Cotizaciones'
      }
    },
    {
      path: '/quotations/:id',
      name: 'quotation-view',
      component: QuotationView,
      meta: {
        title: 'Ver Cotización - Generador de Cotizaciones'
      }
    },
    {
      path: '/quotations/:id/edit',
      name: 'quotation-edit',
      component: QuotationView,
      meta: {
        title: 'Editar Cotización - Generador de Cotizaciones'
      }
    },
    {
      path: '/test',
      name: 'test',
      component: TestView,
      meta: {
        title: 'Test CSS - Generador de Cotizaciones'
      }
    },
    {
      path: '/debug',
      name: 'debug',
      component: DebugView,
      meta: {
        title: 'Debug Panel - Generador de Cotizaciones'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/'
    }
  ],
})

// Navigation guard para actualizar el título de la página
router.beforeEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
})

export default router
