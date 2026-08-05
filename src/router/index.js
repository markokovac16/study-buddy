import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import PublicLayout from '../layouts/PublicLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import Homepage from '../pages/Homepage.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Dashboard from '../pages/Dashboard.vue'
import Subjects from '../pages/Subjects.vue'
import Statistics from '../pages/Statistics.vue'
import Profile from '../pages/Profile.vue'
import AdminOverview from '../pages/admin/Overview.vue'

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
      children: [
        { path: 'ploca', name: 'ploca', component: Dashboard },
        { path: 'predmeti', name: 'predmeti', component: Subjects },
        { path: 'statistika', name: 'statistika', component: Statistics },
        { path: 'profil', name: 'profil', component: Profile },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { auth: true, admin: true },
      children: [
        { path: '', redirect: '/admin/pregled' },
        { path: 'pregled', name: 'admin-pregled', component: AdminOverview },
      ],
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.auth && !auth.prijavljen) return { name: 'prijava' }
  if (to.meta.admin && !auth.jeAdmin) return { name: 'ploca' }
  if (to.meta.gost && auth.prijavljen) return { name: auth.jeAdmin ? 'admin-pregled' : 'ploca' }
})

export default router
