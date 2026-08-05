<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseSelect from '../components/ui/BaseSelect.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseToggle from '../components/ui/BaseToggle.vue'
import Avatar from '../components/ui/Avatar.vue'
import Icon from '../components/ui/Icon.vue'
import PageHeading from '../components/ui/PageHeading.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const obrazac = ref({
  ime: auth.korisnik.ime,
  email: auth.korisnik.email,
  sveuciliste: auth.korisnik.sveuciliste,
  godina: auth.korisnik.godina,
  dnevniCiljSati: auth.korisnik.dnevniCiljSati,
})

const preferencije = ref({ ...auth.korisnik.preferencije })
const obavijesti = ref({ ...auth.korisnik.obavijesti })
const spremljeno = ref(false)

const jezikOpcije = [
  { value: 'hr', label: 'Hrvatski' },
  { value: 'en', label: 'Engleski (SAD)' },
]

const obavijestiStavke = [
  {
    kljuc: 'podsjetnici',
    ikona: 'kvacica',
    naslov: 'Podsjetnici za zadatke',
    opis: 'Obavijesti me kada se rok približava.',
  },
  {
    kljuc: 'pauze',
    ikona: 'sat',
    naslov: 'Pomodoro pauze',
    opis: 'Zvučna obavijest kada sesija fokusa završi.',
  },
  {
    kljuc: 'ciljevi',
    ikona: 'pehar',
    naslov: 'Obavijesti o ciljevima učenja',
    opis: 'Tjedni sažetak i proslave prekretnica.',
  },
]

function spremi() {
  auth.azuriraj({
    ...obrazac.value,
    godina: Number(obrazac.value.godina),
    dnevniCiljSati: Number(obrazac.value.dnevniCiljSati),
    preferencije: preferencije.value,
    obavijesti: obavijesti.value,
  })
  spremljeno.value = true
  setTimeout(() => (spremljeno.value = false), 2500)
}

function odjava() {
  auth.odjava()
  router.push('/')
}

function deaktiviraj() {
  if (!confirm('Deaktivirati račun? Nakon deaktivacije nema povratka.')) return
  auth.deaktiviraj()
  router.push('/')
}
</script>

<template>
  <div>
    <PageHeading title="Postavke profila" subtitle="Osobni podaci, preferencije i obavijesti." />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <BaseCard class="lg:col-span-2">
        <div class="mb-6 flex items-center gap-5">
          <Avatar :ime="obrazac.ime" size="h-20 w-20 text-2xl" />
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ obrazac.ime }}</p>
            <p class="text-sm text-slate-500">
              {{ auth.korisnik.opis }} • {{ obrazac.godina }}. godina
            </p>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="spremi">
          <BaseInput v-model="obrazac.ime" label="Ime i prezime" />
          <BaseInput v-model="obrazac.email" label="Adresa e-pošte" type="email" />
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="sm:col-span-2">
              <BaseInput
                v-model="obrazac.sveuciliste"
                label="Sveučilište"
                placeholder="npr. Sveučilište u Puli"
              />
            </div>
            <BaseInput v-model="obrazac.godina" label="Godina" type="number" />
          </div>
          <BaseInput v-model="obrazac.dnevniCiljSati" label="Dnevni cilj (sati)" type="number" />

          <div class="flex items-center gap-4 pt-2">
            <BaseButton>Spremi promjene</BaseButton>
            <p
              v-if="spremljeno"
              class="flex items-center gap-1.5 text-sm font-semibold text-sb-teal"
            >
              <Icon name="kvacica" size="h-4 w-4" />
              Spremljeno
            </p>
          </div>
        </form>
      </BaseCard>

      <div class="space-y-6">
        <BaseCard>
          <p class="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="stit" />
            Sigurnost
          </p>
          <BaseButton variant="secondary" block>Promijeni lozinku</BaseButton>

          <p class="mt-5 mb-2 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
            Povezani računi
          </p>
          <div class="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3">
            <span class="flex items-center gap-2 text-sm text-slate-700">
              <Icon name="korisnik" size="h-4 w-4" />
              Google
            </span>
            <span class="text-sm font-semibold text-sb-teal">Povezano</span>
          </div>
        </BaseCard>

        <BaseCard>
          <p class="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="postavke" />
            Preferencije
          </p>

          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-600">Jezik</span>
            <BaseSelect v-model="preferencije.jezik" :options="jezikOpcije" />
          </div>

          <div class="mt-4 flex items-center justify-between">
            <span class="text-sm text-slate-600">Tema sučelja</span>
            <div class="flex rounded-xl bg-slate-100 p-1">
              <button
                v-for="tema in ['svijetla', 'tamna']"
                :key="tema"
                class="cursor-pointer rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition"
                :class="
                  preferencije.tema === tema
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500'
                "
                @click="preferencije.tema = tema"
              >
                {{ tema }}
              </button>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <BaseCard class="mt-6">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div>
          <p class="text-2xl font-bold text-slate-900">Obavijesti</p>
          <p class="mt-2 text-sm text-slate-500">
            Upravljajte time kako i kada primate obavijesti o sesijama učenja i ciljevima.
          </p>
        </div>

        <div class="space-y-3 lg:col-span-2">
          <div
            v-for="stavka in obavijestiStavke"
            :key="stavka.kljuc"
            class="flex items-center gap-4 rounded-xl bg-slate-100 px-5 py-4"
          >
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sb-indigo"
            >
              <Icon :name="stavka.ikona" />
            </span>
            <div class="flex-1">
              <p class="text-sm font-semibold text-slate-800">
                {{ stavka.naslov }}
              </p>
              <p class="text-xs text-slate-500">{{ stavka.opis }}</p>
            </div>
            <BaseToggle v-model="obavijesti[stavka.kljuc]" />
          </div>
        </div>
      </div>
    </BaseCard>

    <div class="rounded-card mt-6 flex flex-wrap items-center justify-between gap-4 bg-red-50 p-6">
      <div>
        <p class="text-xl font-bold text-red-700">Opasna zona</p>
        <p class="mt-1 text-sm text-red-600">
          Nakon brisanja računa nema povratka! Budite sigurni.
        </p>
      </div>
      <div class="flex gap-3">
        <BaseButton variant="outline" @click="odjava">Odjava</BaseButton>
        <BaseButton variant="danger" @click="deaktiviraj">Deaktiviraj račun</BaseButton>
      </div>
    </div>
  </div>
</template>
