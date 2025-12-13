import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      redirect: '/clients',
    },
    {
      path: '/clients',
      name: 'clients',
      component: () => import('../views/Clients.vue'),
    },
    {
      path: '/time-entries',
      name: 'timeEntries',
      component: () => import('../views/TimeEntries.vue'),
    },
    {
      path: '/time-entry-form',
      name: 'timeEntryForm',
      component: () => import('../views/TimeEntryForm.vue'),
    },

  ],
})

export default router
