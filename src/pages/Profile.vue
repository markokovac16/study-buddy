<script setup>
import { useRouter } from 'vue-router'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import Avatar from '../components/ui/Avatar.vue'
import Icon from '../components/ui/Icon.vue'
import PageHeading from '../components/ui/PageHeading.vue'
import SaveBar from '../components/SaveBar.vue'
import ConfirmModal from '../components/modals/ConfirmModal.vue'
import { useConfirm } from '../composables/useConfirm'
import { useProfileForm } from '../composables/profileForm'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const { upit, pitaj, odgovori } = useConfirm()

const pocetno = () => ({
  ime: auth.korisnik.ime,
  email: auth.korisnik.email,
  sveuciliste: auth.korisnik.sveuciliste,
  godina: auth.korisnik.godina,
  dnevniCiljSati: auth.korisnik.dnevniCiljSati,
})

const pretvori = (podaci) => ({
  ...podaci,
  godina: Number(podaci.godina),
  dnevniCiljSati: Number(podaci.dnevniCiljSati),
})

const { obrazac, promijenjeno, spremljeno, spremi, odbaci } = useProfileForm(pocetno, pretvori)

async function odjava() {
  await auth.odjava()
  router.push('/')
}

async function deaktiviraj() {
  const potvrda = await pitaj({
    naslov: 'Deaktivacija računa',
    tekst: 'Nakon deaktivacije nema povratka. Deaktivirati račun?',
    gumb: 'Deaktiviraj',
  })
  if (!potvrda) return
  await auth.deaktiviraj()
  router.push('/')
}
</script>

<template>
  <div>
    <PageHeading title="Profil" subtitle="Osobni podaci, dnevni cilj i sigurnost računa." />

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
        </form>
      </BaseCard>

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
    </div>

    <div class="rounded-card mt-6 flex flex-wrap items-center justify-between gap-4 bg-red-50 p-6">
      <div>
        <p class="text-xl font-bold text-red-700">Opasna zona</p>
        <p class="mt-1 text-sm text-red-600">
          Nakon brisanja računa nema povratka! Budite sigurni u svoju odluku.
        </p>
      </div>
      <div class="flex gap-3">
        <BaseButton variant="outline" @click="odjava">Odjava</BaseButton>
        <BaseButton variant="danger" @click="deaktiviraj">Deaktiviraj račun</BaseButton>
      </div>
    </div>

    <SaveBar
      :promijenjeno="promijenjeno"
      :spremljeno="spremljeno"
      @spremi="spremi"
      @odbaci="odbaci"
    />
    <ConfirmModal :upit="upit" @odgovor="odgovori" />
  </div>
</template>
