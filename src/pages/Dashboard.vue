<script setup>
import { computed, ref } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import Icon from '../components/ui/Icon.vue'
import RingProgress from '../components/ui/RingProgress.vue'
import TimerCard from '../components/TimerCard.vue'
import TaskCard from '../components/TaskCard.vue'
import { useAuthStore } from '../stores/auth'
import { useSubjectsStore } from '../stores/subjects'
import { useStatisticsStore } from '../stores/statistics'
import { aktivnosti } from '../data/mock'
import { STATUSI } from '../data/mock'
import { bojaPredmeta, danaDo } from '../utils/format'

const auth = useAuthStore()
const predmetiStore = useSubjectsStore()
const statistika = useStatisticsStore()

const sortiranje = ref('datum')

const pozdrav = computed(() => {
  const sat = new Date().getHours()
  if (sat < 12) return 'Dobro jutro'
  if (sat < 18) return 'Dobar dan'
  return 'Dobra večer'
})

const ime = computed(() => auth.korisnik.ime.split(' ')[0])

const ciljMinuta = computed(() => auth.korisnik.dnevniCiljSati * 60)
const postotakCilja = computed(() => Math.round((statistika.danasMinuta / ciljMinuta.value) * 100))
const porukaCilja = computed(() => {
  if (postotakCilja.value >= 100) return 'Cilj ispunjen!'
  if (postotakCilja.value >= 60) return 'Skoro pa gotovo!'
  return 'Još malo pa stiže zamah.'
})

const tezinaPrioriteta = { VISOK: 0, SREDNJI: 1, NIZAK: 2 }

const nadolazeci = computed(() => {
  const otvoreni = predmetiStore.zadaci.filter((z) => z.status !== STATUSI.ZAVRSENO)
  const poredani = [...otvoreni].sort((a, b) =>
    sortiranje.value === 'datum'
      ? danaDo(a.rokIzvrsenja) - danaDo(b.rokIzvrsenja)
      : tezinaPrioriteta[a.prioritet] - tezinaPrioriteta[b.prioritet],
  )
  return poredani.slice(0, 3)
})
</script>

<template>
  <div>
    <h1 class="text-4xl font-bold text-slate-900">{{ pozdrav }}, {{ ime }}!</h1>
    <p class="mt-2 text-slate-500">
      Spremni za sesiju dubokog rada? Vaše kognitivno utočište je spremno.
    </p>

    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <TimerCard />

      <BaseCard>
        <p class="text-lg font-semibold text-slate-800">Današnji cilj</p>
        <div class="mt-4 flex flex-col items-center">
          <RingProgress :value="postotakCilja">
            <span class="text-3xl font-bold text-slate-900">{{ postotakCilja }}%</span>
          </RingProgress>
          <p class="mt-4 text-sm text-slate-500">
            {{ (statistika.danasMinuta / 60).toFixed(1) }} / {{ auth.korisnik.dnevniCiljSati }} sati
            odrađeno
          </p>
          <p class="mt-1 text-sm font-semibold text-sb-teal">
            {{ porukaCilja }}
          </p>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="mb-4 flex items-start justify-between">
          <p class="text-lg font-semibold text-slate-800">Nedavna aktivnost</p>
          <button class="cursor-pointer text-sm font-semibold text-sb-indigo">Prikaži sve</button>
        </div>

        <div class="space-y-4">
          <div v-for="stavka in aktivnosti" :key="stavka.id" class="flex gap-3">
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              :class="[bojaPredmeta(stavka.boja).pozadina, bojaPredmeta(stavka.boja).tekst]"
            >
              <Icon :name="stavka.ikona" />
            </span>
            <div>
              <p class="text-sm font-semibold text-slate-800">
                {{ stavka.naslov }}
              </p>
              <p class="text-xs text-slate-500">{{ stavka.opis }} • {{ stavka.vrijeme }}</p>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="rounded-card mt-6 bg-slate-100 p-6">
      <div class="mb-5 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-slate-900">Nadolazeći zadaci</h2>
        <div class="flex gap-2">
          <button
            v-for="opcija in [
              { kljuc: 'datum', naziv: 'Po datumu' },
              { kljuc: 'prioritet', naziv: 'Prioritet' },
            ]"
            :key="opcija.kljuc"
            class="cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition"
            :class="
              sortiranje === opcija.kljuc ? 'bg-sb-indigo text-white' : 'bg-white text-slate-600'
            "
            @click="sortiranje = opcija.kljuc"
          >
            {{ opcija.naziv }}
          </button>
        </div>
      </div>

      <div v-if="nadolazeci.length" class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TaskCard
          v-for="zadatak in nadolazeci"
          :key="zadatak.zadatakId"
          :zadatak="zadatak"
          :predmet="predmetiStore.predmetPoId(zadatak.predmetId)"
        />
      </div>
      <p v-else class="text-sm text-slate-500">Nema otvorenih zadataka. Odlično!</p>
    </div>
  </div>
</template>
