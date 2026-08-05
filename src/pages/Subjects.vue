<script setup>
import { computed, ref } from 'vue'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseSelect from '../components/ui/BaseSelect.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import ProgressBar from '../components/ui/ProgressBar.vue'
import Icon from '../components/ui/Icon.vue'
import PageHeading from '../components/ui/PageHeading.vue'
import SubjectCard from '../components/SubjectCard.vue'
import TaskRow from '../components/TaskRow.vue'
import NoteCard from '../components/NoteCard.vue'
import FileRow from '../components/FileRow.vue'
import SubjectModal from '../components/modals/SubjectModal.vue'
import TaskModal from '../components/modals/TaskModal.vue'
import NoteModal from '../components/modals/NoteModal.vue'
import { useSubjectsStore } from '../stores/subjects'
import { KVOTA_KB, PRIORITETI, STATUSI } from '../data/mock'
import { bojaPredmeta, formatVelicina, prioritetNaziv } from '../utils/format'

const store = useSubjectsStore()

const odabraniId = ref(store.predmeti[0]?.predmetId ?? null)
const filterPrioriteta = ref('svi')
const prikaziSveBiljeske = ref(false)

const predmetModal = ref(false)
const zadatakModal = ref(false)
const biljeskaModal = ref(false)
const predmetZaUredivanje = ref(null)
const zadatakZaUredivanje = ref(null)
const biljeskaZaUredivanje = ref(null)

const odabrani = computed(() => store.predmetPoId(odabraniId.value))

const prioritetOpcije = [
  { value: 'svi', label: 'Prioritet: svi' },
  ...Object.values(PRIORITETI).map((p) => ({ value: p, label: prioritetNaziv[p] })),
]

const zadaciOdabranog = computed(() => {
  const svi = store.zadaciPredmeta(odabraniId.value)
  const filtrirani =
    filterPrioriteta.value === 'svi'
      ? svi
      : svi.filter((z) => z.prioritet === filterPrioriteta.value)
  return [...filtrirani].sort(
    (a, b) => (a.status === STATUSI.ZAVRSENO) - (b.status === STATUSI.ZAVRSENO),
  )
})

const biljeskeOdabranog = computed(() => {
  const sve = store.biljeskePredmeta(odabraniId.value)
  return prikaziSveBiljeske.value ? sve : sve.slice(0, 2)
})

const priloziOdabranog = computed(() => store.priloziPredmeta(odabraniId.value))

const iskoristenoKb = computed(() => store.prilozi.reduce((zbroj, p) => zbroj + p.velicinaKb, 0))
const iskoristenoPostotak = computed(() =>
  Math.min(Math.round((iskoristenoKb.value / KVOTA_KB) * 1000) / 10, 100),
)

function otvoriNoviPredmet() {
  predmetZaUredivanje.value = null
  predmetModal.value = true
}

function otvoriUrediPredmet() {
  predmetZaUredivanje.value = odabrani.value
  predmetModal.value = true
}

function spremiPredmet(podaci) {
  if (predmetZaUredivanje.value) store.urediPredmet(predmetZaUredivanje.value.predmetId, podaci)
  else store.dodajPredmet(podaci)
}

function obrisiPredmet() {
  if (!confirm(`Obrisati predmet "${odabrani.value.naziv}" sa svim zadacima i bilješkama?`)) return
  store.obrisiPredmet(odabraniId.value)
  odabraniId.value = store.predmeti[0]?.predmetId ?? null
}

function otvoriNoviZadatak() {
  zadatakZaUredivanje.value = null
  zadatakModal.value = true
}

function otvoriUrediZadatak(zadatak) {
  zadatakZaUredivanje.value = zadatak
  zadatakModal.value = true
}

function spremiZadatak(podaci) {
  if (zadatakZaUredivanje.value) store.urediZadatak(zadatakZaUredivanje.value.zadatakId, podaci)
  else store.dodajZadatak({ ...podaci, predmetId: odabraniId.value })
}

function otvoriNovuBiljesku() {
  biljeskaZaUredivanje.value = null
  biljeskaModal.value = true
}

function otvoriUrediBiljesku(biljeska) {
  biljeskaZaUredivanje.value = biljeska
  biljeskaModal.value = true
}

function spremiBiljesku(podaci) {
  if (biljeskaZaUredivanje.value) store.urediBiljesku(biljeskaZaUredivanje.value.biljeskaId, podaci)
  else store.dodajBiljesku({ ...podaci, predmetId: odabraniId.value })
}

function ucitajDatoteku(dogadaj) {
  const datoteka = dogadaj.target.files[0]
  if (!datoteka) return
  const tip = datoteka.type.startsWith('image/')
    ? 'slika'
    : datoteka.type === 'application/pdf'
      ? 'pdf'
      : 'dokument'
  store.dodajPrilog({
    predmetId: odabraniId.value,
    naziv: datoteka.name,
    tip,
    velicinaKb: Math.round(datoteka.size / 1024),
  })
  dogadaj.target.value = ''
}
</script>

<template>
  <div>
    <div class="flex items-start justify-between gap-6">
      <PageHeading
        title="Upravljanje predmetima"
        subtitle="Organizirajte svoj akademski put modularnim zonama fokusa za svaku disciplinu."
      />
      <BaseButton class="flex items-center gap-2" @click="otvoriNoviPredmet">
        <Icon name="plus" size="h-4 w-4 inline" />
        Dodaj novi predmet
      </BaseButton>
    </div>

    <div v-if="store.predmeti.length" class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <SubjectCard
        v-for="predmet in store.predmeti"
        :key="predmet.predmetId"
        :predmet="predmet"
        :na-cekanju="store.naCekanju(predmet.predmetId)"
        :napredak="store.napredak(predmet.predmetId)"
        :aktivan="predmet.predmetId === odabraniId"
        @click="odabraniId = predmet.predmetId"
      />
    </div>
    <BaseCard v-else>
      <p class="text-slate-500">Još nemate predmeta. Dodajte prvi i krenite s organizacijom.</p>
    </BaseCard>

    <template v-if="odabrani">
      <div class="mt-12 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span
            class="flex h-12 w-12 items-center justify-center rounded-xl"
            :class="[bojaPredmeta(odabrani.boja).pozadina, bojaPredmeta(odabrani.boja).tekst]"
          >
            <Icon :name="odabrani.ikona" size="h-6 w-6" />
          </span>
          <h2 class="text-3xl font-bold text-slate-900">
            {{ odabrani.naziv }}
          </h2>
        </div>

        <div class="flex items-center gap-3">
          <BaseButton variant="ghost" @click="otvoriUrediPredmet">Uredi predmet</BaseButton>
          <BaseButton variant="ghost" class="text-red-600 hover:bg-red-50" @click="obrisiPredmet"
            >Obriši</BaseButton
          >
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div class="space-y-6 xl:col-span-2">
          <div class="rounded-card bg-slate-100 p-6">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 class="flex items-center gap-2 text-xl font-bold text-slate-900">
                <Icon name="kvacica" />
                Aktivni zadaci
              </h3>
              <div class="flex items-center gap-3">
                <BaseSelect v-model="filterPrioriteta" :options="prioritetOpcije" />
                <BaseButton class="flex items-center gap-2" @click="otvoriNoviZadatak">
                  <Icon name="plus" size="h-4 w-4 inline" />
                  Dodaj zadatak
                </BaseButton>
              </div>
            </div>

            <div v-if="zadaciOdabranog.length" class="space-y-3">
              <TaskRow
                v-for="zadatak in zadaciOdabranog"
                :key="zadatak.zadatakId"
                :zadatak="zadatak"
                @prebaci="store.prebaciStatus(zadatak.zadatakId)"
                @uredi="otvoriUrediZadatak(zadatak)"
                @obrisi="store.obrisiZadatak(zadatak.zadatakId)"
              />
            </div>
            <p v-else class="text-sm text-slate-500">Nema zadataka za odabrani filter.</p>
          </div>

          <div class="rounded-card bg-slate-100 p-6">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center gap-2 text-xl font-bold text-slate-900">
                <Icon name="dokument" />
                Kognitivne bilješke
              </h3>
              <div class="flex items-center gap-3">
                <button
                  v-if="store.biljeskePredmeta(odabraniId).length > 2"
                  class="cursor-pointer text-sm font-semibold text-sb-indigo"
                  @click="prikaziSveBiljeske = !prikaziSveBiljeske"
                >
                  {{ prikaziSveBiljeske ? 'Prikaži manje' : 'Prikaži sve bilješke' }}
                </button>
                <BaseButton class="flex items-center gap-2" @click="otvoriNovuBiljesku">
                  <Icon name="plus" size="h-4 w-4 inline" />
                  Nova bilješka
                </BaseButton>
              </div>
            </div>

            <div v-if="biljeskeOdabranog.length" class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <NoteCard
                v-for="biljeska in biljeskeOdabranog"
                :key="biljeska.biljeskaId"
                :biljeska="biljeska"
                @uredi="otvoriUrediBiljesku(biljeska)"
                @obrisi="store.obrisiBiljesku(biljeska.biljeskaId)"
              />
            </div>
            <p v-else class="text-sm text-slate-500">Još nema bilježaka za ovaj predmet.</p>
          </div>
        </div>

        <div class="rounded-card bg-slate-100 p-6">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Icon name="mapa" />
              Resursi
            </h3>
            <label
              class="cursor-pointer rounded-xl bg-white p-2.5 text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              <Icon name="upload" />
              <input type="file" class="hidden" @change="ucitajDatoteku" />
            </label>
          </div>

          <div v-if="priloziOdabranog.length" class="space-y-3">
            <FileRow
              v-for="prilog in priloziOdabranog"
              :key="prilog.prilogId"
              :prilog="prilog"
              @obrisi="store.obrisiPrilog(prilog.prilogId)"
            />
          </div>
          <p v-else class="text-sm text-slate-500">Nema priloga. Dodajte datoteku ili sliku.</p>

          <div class="mt-6 border-t border-slate-200 pt-4">
            <p class="mb-2 text-center text-xs text-slate-500">
              Iskoristili ste {{ iskoristenoPostotak }}% od {{ formatVelicina(KVOTA_KB) }} prostora
            </p>
            <ProgressBar :value="iskoristenoPostotak" />
          </div>
        </div>
      </div>
    </template>

    <SubjectModal v-model="predmetModal" :predmet="predmetZaUredivanje" @spremi="spremiPredmet" />
    <TaskModal v-model="zadatakModal" :zadatak="zadatakZaUredivanje" @spremi="spremiZadatak" />
    <NoteModal v-model="biljeskaModal" :biljeska="biljeskaZaUredivanje" @spremi="spremiBiljesku" />
  </div>
</template>
