import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import PublicLayout from '../layouts/PublicLayout.vue'
import Homepage from '../pages/Homepage.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', name: 'naslovnica', component: Homepage },
        { path: 'prijava', name: 'prijava', component: Login, meta: { gost: true } },
        { path: 'registracija', name: 'registracija', component: Register, meta: { gost: true } },
      ],
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.gost && auth.prijavljen) return { name: 'naslovnica' }
})

export default router
