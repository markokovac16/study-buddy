<script setup>
import { useRouter } from 'vue-router'
import Logo from '../components/Logo.vue'
import Footer from '../components/Footer.vue'
import Icon from '../components/ui/Icon.vue'
import Avatar from '../components/ui/Avatar.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const stavke = [
  { to: '/admin/pregled', naziv: 'Pregled' },
  { to: '/admin/korisnici', naziv: 'Upravljanje korisnicima' },
  { to: '/ploca', naziv: 'Moj studij' },
]

async function odjava() {
  await auth.odjava()
  router.push('/')
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex h-16 items-center justify-between bg-sb-surface px-12 shadow-sm">
      <div class="flex items-center gap-10">
        <Logo :icon="false" size="text-xl" />
        <nav class="flex gap-6">
          <RouterLink
            v-for="stavka in stavke"
            :key="stavka.to"
            :to="stavka.to"
            class="text-sm text-slate-500 transition hover:text-sb-blue"
            active-class="font-semibold text-sb-blue underline underline-offset-8"
          >
            {{ stavka.naziv }}
          </RouterLink>
        </nav>
      </div>

      <div class="flex items-center gap-4">
        <Icon name="zvono" size="h-6 w-6 text-slate-500" />
        <button class="cursor-pointer" @click="odjava">
          <Avatar :ime="auth.korisnik.ime" size="h-9 w-9 text-xs" />
        </button>
      </div>
    </header>

    <main class="flex-1 px-12 py-10">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>
