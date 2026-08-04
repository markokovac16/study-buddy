import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import PublicLayout from '../layouts/PublicLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import Homepage from '../pages/Homepage.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Dashboard from '../pages/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', name: 'naslovnica', component: Homepage, meta: { gost: true } },
        { path: 'prijava', name: 'prijava', component: Login, meta: { gost: true } },
        { path: 'registracija', name: 'registracija', component: Register, meta: { gost: true } },
      ],
    },
    {
      path: '/',
      component: AppLayout,
      meta: { auth: true },
      children: [{ path: 'ploca', name: 'ploca', component: Dashboard }],
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.auth && !auth.prijavljen) return { name: 'prijava' }
  if (to.meta.gost && auth.prijavljen) return { name: 'ploca' }
})

export default router
