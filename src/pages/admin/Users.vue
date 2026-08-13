<script setup>
import { computed, ref, watch } from 'vue'
import BaseSelect from '../../components/ui/BaseSelect.vue'
import BaseBadge from '../../components/ui/BaseBadge.vue'
import Avatar from '../../components/ui/Avatar.vue'
import Icon from '../../components/ui/Icon.vue'
import PageHeading from '../../components/ui/PageHeading.vue'
import { useAdminStore } from '../../stores/admin'
import { formatDatum } from '../../utils/format'

const admin = useAdminStore()

const PO_STRANICI = 8

const upit = ref('')
const filterUloge = ref('sve')
const filterStatusa = ref('svi')
const stranica = ref(1)
const odabrani = ref([])

const ulogaOpcije = [
  { value: 'sve', label: 'Sve uloge' },
  { value: 'student', label: 'Student' },
  { value: 'admin', label: 'Administrator' },
]

const statusOpcije = [
  { value: 'svi', label: 'Svi statusi' },
  { value: 'aktivan', label: 'Aktivan' },
  { value: 'neaktivan', label: 'Deaktiviran' },
]

const filtrirani = computed(() =>
  admin.korisnici.filter((korisnik) => {
    const tekst = `${korisnik.ime} ${korisnik.email}`.toLowerCase()
    const odgovaraUpitu = tekst.includes(upit.value.toLowerCase().trim())
    const odgovaraUlozi = filterUloge.value === 'sve' || korisnik.uloga === filterUloge.value
    const odgovaraStatusu =
      filterStatusa.value === 'svi' || (filterStatusa.value === 'aktivan') === korisnik.aktivan
    return odgovaraUpitu && odgovaraUlozi && odgovaraStatusu
  }),
)

const brojStranica = computed(() => Math.max(1, Math.ceil(filtrirani.value.length / PO_STRANICI)))
const stranicaKorisnika = computed(() =>
  filtrirani.value.slice((stranica.value - 1) * PO_STRANICI, stranica.value * PO_STRANICI),
)

const sviOdabrani = computed(
  () =>
    stranicaKorisnika.value.length > 0 &&
    stranicaKorisnika.value.every((k) => odabrani.value.includes(k.korisnikId)),
)

watch([upit, filterUloge, filterStatusa], () => {
  stranica.value = 1
})

watch(brojStranica, (broj) => {
  if (stranica.value > broj) stranica.value = broj
})

function prebaciOdabir(korisnikId) {
  odabrani.value = odabrani.value.includes(korisnikId)
    ? odabrani.value.filter((id) => id !== korisnikId)
    : [...odabrani.value, korisnikId]
}

function prebaciSve() {
  const idevi = stranicaKorisnika.value.map((k) => k.korisnikId)
  odabrani.value = sviOdabrani.value
    ? odabrani.value.filter((id) => !idevi.includes(id))
    : [...new Set([...odabrani.value, ...idevi])]
}

function skupnaDeaktivacija() {
  admin.skupnaDeaktivacija(odabrani.value)
  odabrani.value = []
}

function skupnoBrisanje() {
  if (!confirm(`Trajno obrisati ${odabrani.value.length} korisnika?`)) return
  admin.skupnoBrisanje(odabrani.value)
  odabrani.value = []
}

function obrisi(korisnik) {
  if (!confirm(`Trajno obrisati korisnika ${korisnik.ime}?`)) return
  admin.obrisiKorisnika(korisnik.korisnikId)
  odabrani.value = odabrani.value.filter((id) => id !== korisnik.korisnikId)
}
</script>

<template>
  <div>
    <PageHeading
      title="Upravljanje korisnicima"
      subtitle="Pregled i uređivanje registriranih korisnika."
    />

    <div class="flex flex-wrap gap-4">
      <label class="relative min-w-72 flex-1">
        <Icon
          name="pretraga"
          size="h-5 w-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"
        />
        <input
          v-model="upit"
          type="search"
          placeholder="Pretraži po imenu ili e-pošti..."
          class="w-full rounded-xl bg-slate-200/70 py-3 pr-4 pl-12 text-slate-800 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-sb-indigo"
        />
      </label>
      <BaseSelect v-model="filterUloge" :options="ulogaOpcije" />
      <BaseSelect v-model="filterStatusa" :options="statusOpcije" />
    </div>

    <div
      v-if="odabrani.length"
      class="mt-6 flex flex-wrap items-center gap-4 rounded-xl bg-indigo-50 px-5 py-3"
    >
      <p class="text-sm font-semibold text-sb-blue">{{ odabrani.length }} korisnika odabrano</p>
      <span class="h-5 w-px bg-indigo-200" />
      <button
        class="flex cursor-pointer items-center gap-2 text-sm text-slate-600 transition hover:text-sb-blue"
        @click="skupnaDeaktivacija"
      >
        <Icon name="zabrana" size="h-4 w-4" />
        Skupna deaktivacija
      </button>
      <button
        class="flex cursor-pointer items-center gap-2 text-sm text-slate-600 transition hover:text-red-600"
        @click="skupnoBrisanje"
      >
        <Icon name="kanta" size="h-4 w-4" />
        Skupno brisanje
      </button>
    </div>

    <div class="rounded-card mt-6 overflow-hidden bg-white shadow-sm">
      <table class="w-full text-left">
        <thead class="bg-slate-100 text-[10px] tracking-wide text-slate-500 uppercase">
          <tr>
            <th class="w-12 px-6 py-4">
              <input
                type="checkbox"
                :checked="sviOdabrani"
                class="h-4 w-4 cursor-pointer"
                @change="prebaciSve"
              />
            </th>
            <th class="px-6 py-4">Ime</th>
            <th class="px-6 py-4">Uloga</th>
            <th class="px-6 py-4">Datum pridruživanja</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4 text-right">Radnje</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="korisnik in stranicaKorisnika"
            :key="korisnik.korisnikId"
            class="hover:bg-slate-50"
          >
            <td class="px-6 py-4">
              <input
                type="checkbox"
                :checked="odabrani.includes(korisnik.korisnikId)"
                class="h-4 w-4 cursor-pointer"
                @change="prebaciOdabir(korisnik.korisnikId)"
              />
            </td>

            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <Avatar :ime="korisnik.ime" size="h-9 w-9 text-xs" />
                <div>
                  <p
                    class="text-sm font-semibold"
                    :class="korisnik.aktivan ? 'text-slate-800' : 'text-slate-400'"
                  >
                    {{ korisnik.ime }}
                  </p>
                  <p class="text-xs text-slate-400">{{ korisnik.email }}</p>
                </div>
              </div>
            </td>

            <td class="px-6 py-4">
              <BaseBadge :color="korisnik.uloga === 'admin' ? 'amber' : 'indigo'">
                {{ korisnik.uloga === 'admin' ? 'Administrator' : 'Student' }}
              </BaseBadge>
            </td>

            <td class="px-6 py-4 text-sm text-slate-500">
              {{ formatDatum(korisnik.datumRegistracije) }}
            </td>

            <td class="px-6 py-4">
              <span
                class="flex items-center gap-2 text-sm"
                :class="korisnik.aktivan ? 'text-sb-teal' : 'text-rose-500'"
              >
                <span
                  class="h-2 w-2 rounded-full"
                  :class="korisnik.aktivan ? 'bg-sb-teal' : 'bg-rose-400'"
                />
                {{ korisnik.aktivan ? 'Aktivan' : 'Deaktiviran' }}
              </span>
            </td>

            <td class="px-6 py-4">
              <div class="flex justify-end gap-1">
                <button
                  class="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:text-sb-indigo"
                  :title="korisnik.aktivan ? 'Deaktiviraj' : 'Aktiviraj'"
                  @click="admin.postaviAktivnost(korisnik.korisnikId, !korisnik.aktivan)"
                >
                  <Icon :name="korisnik.aktivan ? 'zabrana' : 'kvacica'" size="h-4 w-4" />
                </button>
                <button
                  class="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:text-red-600"
                  title="Obriši"
                  @click="obrisi(korisnik)"
                >
                  <Icon name="kanta" size="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!stranicaKorisnika.length">
            <td colspan="6" class="px-6 py-10 text-center text-sm text-slate-500">
              Nema korisnika koji odgovaraju filterima.
            </td>
          </tr>
        </tbody>
      </table>

      <div
        class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-4"
      >
        <p class="text-sm text-slate-500">
          Prikaz {{ stranicaKorisnika.length }} od {{ filtrirani.length }} korisnika
        </p>

        <div class="flex items-center gap-1">
          <button
            class="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:text-sb-indigo disabled:opacity-30"
            :disabled="stranica === 1"
            @click="stranica--"
          >
            <Icon name="lijevo" size="h-4 w-4" />
          </button>

          <button
            v-for="broj in brojStranica"
            :key="broj"
            class="h-9 w-9 cursor-pointer rounded-lg text-sm font-medium transition"
            :class="
              broj === stranica ? 'bg-sb-indigo text-white' : 'text-slate-500 hover:bg-slate-100'
            "
            @click="stranica = broj"
          >
            {{ broj }}
          </button>

          <button
            class="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:text-sb-indigo disabled:opacity-30"
            :disabled="stranica === brojStranica"
            @click="stranica++"
          >
            <Icon name="desno" size="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
