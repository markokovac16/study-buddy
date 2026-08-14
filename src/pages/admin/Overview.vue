<script setup>
import { computed, ref } from 'vue'
import BaseCard from '../../components/ui/BaseCard.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import BaseBadge from '../../components/ui/BaseBadge.vue'
import Icon from '../../components/ui/Icon.vue'
import PageHeading from '../../components/ui/PageHeading.vue'
import BarChart from '../../components/charts/BarChart.vue'
import Loader from '../../components/ui/Loader.vue'
import ContentModal from '../../components/modals/ContentModal.vue'
import ConfirmModal from '../../components/modals/ConfirmModal.vue'
import { useConfirm } from '../../composables/useConfirm'
import { prijeVremena } from '../../utils/format'
import { useAdminStore } from '../../stores/admin'
import { useNewsStore } from '../../stores/news'

const admin = useAdminStore()
const novosti = useNewsStore()
const { upit, pitaj, odgovori } = useConfirm()

const modal = ref(false)
const zaUredivanje = ref(null)

const nedavno = computed(() =>
  [
    ...admin.korisnici.map((korisnik) => ({
      id: `korisnik-${korisnik.korisnikId}`,
      ikona: 'korisnici',
      naslov: korisnik.ime,
      opis: korisnik.uloga === 'admin' ? 'Registriran administrator' : 'Registriran student',
      vrijeme: korisnik.datumRegistracije,
    })),
    ...novosti.objave.map((objava) => ({
      id: `objava-${objava.sadrzajId}`,
      ikona: 'iskra',
      naslov: objava.naslov,
      opis: `Objava u Novostima - ${objava.tip}`,
      vrijeme: objava.datum,
    })),
  ]
    .sort((prvi, drugi) => drugi.vrijeme.localeCompare(prvi.vrijeme))
    .slice(0, 5),
)

function otvoriNovi() {
  zaUredivanje.value = null
  modal.value = true
}

function otvoriUredi(stavka) {
  zaUredivanje.value = stavka
  modal.value = true
}

function spremi(podaci) {
  if (zaUredivanje.value) novosti.uredi(zaUredivanje.value.sadrzajId, podaci)
  else novosti.dodaj(podaci)
}

async function obrisi(stavka) {
  const potvrda = await pitaj({
    naslov: 'Brisanje objave',
    tekst: `Obrisati objavu "${stavka.naslov}"?`,
    gumb: 'Obriši',
  })
  if (!potvrda) return
  novosti.obrisi(stavka.sadrzajId)
}
</script>

<template>
  <div>
    <PageHeading
      title="Pregled platforme"
      subtitle="Ključni brojevi platforme i objave u Novostima."
    />

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <BaseCard>
        <div class="mb-4 flex items-start justify-between">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-sb-indigo"
          >
            <Icon name="korisnici" />
          </span>
        </div>
        <p class="text-sm text-slate-500">Prijavljeni danas</p>
        <p class="mt-1 text-3xl font-bold text-slate-900">{{ admin.prijavljenihDanas }}</p>
        <p class="mt-1 text-xs text-slate-400">od {{ admin.korisnici.length }} računa</p>
      </BaseCard>

      <BaseCard>
        <div class="mb-4 flex items-start justify-between">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600"
          >
            <Icon name="munja" />
          </span>
        </div>
        <p class="text-sm text-slate-500">Nove registracije</p>
        <p class="mt-1 text-3xl font-bold text-slate-900">{{ admin.novihTjedan }}</p>
        <p class="mt-1 text-xs text-slate-400">u zadnjih 7 dana</p>
      </BaseCard>

      <BaseCard class="lg:col-span-2">
        <p class="mb-4 font-semibold text-slate-700">Registracije zadnjih 7 dana</p>
        <div class="h-40">
          <BarChart
            :labels="admin.registracijePoDanima.map((dan) => dan.oznaka)"
            :values="admin.registracijePoDanima.map((dan) => dan.broj)"
          />
        </div>
      </BaseCard>
    </div>

    <div class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-sb-indigo">Novosti</h2>
          <p class="text-sm text-slate-500">{{ novosti.vidljive.length }} vidljivo</p>
        </div>

        <Loader v-if="novosti.ucitavanje" />

        <div v-else class="space-y-3">
          <div
            v-for="stavka in novosti.objave"
            :key="stavka.sadrzajId"
            class="flex flex-wrap items-center gap-4 rounded-xl bg-slate-100 p-4"
          >
            <span
              class="flex h-14 w-20 shrink-0 flex-col items-center justify-center rounded-lg bg-sb-indigo text-sb-light"
            >
              <span class="text-lg font-bold tabular-nums">{{ novosti.rezultat(stavka) }}</span>
              <span class="text-[10px] opacity-80">glasova</span>
            </span>

            <div class="min-w-0 flex-1">
              <p class="flex items-center gap-2 font-semibold text-slate-900">
                {{ stavka.tip }}: {{ stavka.naslov }}
                <BaseBadge v-if="!stavka.vidljiv">Skriveno</BaseBadge>
              </p>
              <p class="truncate text-sm text-slate-500">{{ stavka.sadrzaj }}</p>
            </div>

            <div class="flex items-center gap-1">
              <button
                class="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:text-sb-indigo"
                :title="stavka.vidljiv ? 'Sakrij objavu' : 'Objavi'"
                @click="novosti.prebaciVidljivost(stavka)"
              >
                <Icon :name="stavka.vidljiv ? 'zabrana' : 'kvacica'" size="h-4 w-4" />
              </button>
              <button
                class="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:text-sb-indigo"
                title="Uredi objavu"
                @click="otvoriUredi(stavka)"
              >
                <Icon name="olovka" size="h-4 w-4" />
              </button>
              <button
                class="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:text-red-600"
                title="Obriši objavu"
                @click="obrisi(stavka)"
              >
                <Icon name="kanta" size="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-5 text-sm font-semibold text-slate-500 transition hover:border-sb-indigo hover:text-sb-indigo"
            @click="otvoriNovi"
          >
            <Icon name="plus" size="h-4 w-4" />
            Nova objava
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <BaseCard>
          <p class="mb-4 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
            Računi
          </p>
          <div class="space-y-3 text-sm">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-500" />
              <span class="flex-1 text-slate-600">Aktivni</span>
              <span class="text-slate-400">{{ admin.aktivnihKorisnika }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-amber-400" />
              <span class="flex-1 text-slate-600">Deaktivirani</span>
              <span class="text-slate-400">
                {{ admin.korisnici.length - admin.aktivnihKorisnika }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-sb-indigo" />
              <span class="flex-1 text-slate-600">Administratori</span>
              <span class="text-slate-400">{{ admin.administratora }}</span>
            </div>
            <div class="flex items-center gap-2 border-t border-slate-100 pt-3">
              <span class="h-2 w-2 rounded-full bg-slate-300" />
              <span class="flex-1 text-slate-600">Objave u Novostima</span>
              <span class="text-slate-400">
                {{ novosti.vidljive.length }} / {{ novosti.objave.length }}
              </span>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <p class="mb-4 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
            Nedavna aktivnost
          </p>
          <p v-if="!nedavno.length" class="text-sm text-slate-500">
            Još nema zabilježene aktivnosti.
          </p>

          <div v-else class="space-y-4">
            <div v-for="stavka in nedavno" :key="stavka.id" class="flex gap-3">
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sb-indigo"
              >
                <Icon :name="stavka.ikona" size="h-4 w-4" />
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-800">
                  {{ stavka.naslov }}
                </p>
                <p class="text-xs text-slate-500">{{ stavka.opis }}</p>
                <p class="mt-0.5 text-xs text-slate-400">
                  {{ prijeVremena(stavka.vrijeme) }}
                </p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <ContentModal v-model="modal" :stavka="zaUredivanje" @spremi="spremi" />
    <ConfirmModal :upit="upit" @odgovor="odgovori" />
  </div>
</template>
