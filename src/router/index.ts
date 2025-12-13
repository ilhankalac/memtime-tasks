import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'clients',
      component: () => import('../views/Clients.vue'),
    },
  ],
})

export default router
