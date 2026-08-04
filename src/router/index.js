import { createRouter, createWebHistory } from 'vue-router'
import PublicLayout from '../layouts/PublicLayout.vue'
import Homepage from '../pages/Homepage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [{ path: '', name: 'naslovnica', component: Homepage }],
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
