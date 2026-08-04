<script setup>
import { useRouter } from 'vue-router'
import Icon from './ui/Icon.vue'
import Avatar from './ui/Avatar.vue'
import BaseButton from './ui/BaseButton.vue'
import { useAuthStore } from '../stores/auth'
import { usePomodoroStore } from '../stores/pomodoro'

const auth = useAuthStore()
const pomodoro = usePomodoroStore()
const router = useRouter()

const stavke = [
  { to: '/app/ploca', ikona: 'ploca', naziv: 'Nadzorna ploča' },
  { to: '/app/predmeti', ikona: 'knjiga', naziv: 'Predmeti' },
  { to: '/app/statistika', ikona: 'graf', naziv: 'Statistika' },
  { to: '/app/profil', ikona: 'korisnik', naziv: 'Profil' },
]

function pokreniPomodoro() {
  pomodoro.pokreni()
  router.push('/app/ploca')
}

function odjava() {
  auth.odjava()
  router.push('/')
}
</script>

<template>
  <aside class="flex w-64 shrink-0 flex-col justify-between px-6 py-8">
    <div>
      <div class="mb-6 flex items-center gap-3">
        <Avatar :ime="auth.korisnik.ime" />
        <div>
          <p class="font-semibold text-slate-800">
            {{ auth.korisnik.ime.split(' ')[0] }}
          </p>
          <p class="text-xs text-slate-500">Način dubokog rada</p>
        </div>
      </div>

      <BaseButton block class="mb-8" @click="pokreniPomodoro">Pokreni Pomodoro</BaseButton>

      <nav class="flex flex-col gap-1">
        <RouterLink
          v-for="stavka in stavke"
          :key="stavka.to"
          :to="stavka.to"
          class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-white"
          active-class="bg-indigo-100 text-sb-blue"
        >
          <Icon :name="stavka.ikona" />
          {{ stavka.naziv }}
        </RouterLink>
      </nav>
    </div>

    <div>
      <BaseButton variant="secondary" block class="mb-4" @click="odjava">Odjava</BaseButton>
      <div class="flex flex-col gap-1 border-t border-slate-200 pt-4">
        <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-500">
          <Icon name="postavke" />
          Postavke
        </a>
        <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-500">
          <Icon name="pomoc" />
          Pomoć
        </a>
      </div>
    </div>
  </aside>
</template>
