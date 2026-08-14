<script setup>
import { ref, watch } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import BaseButton from '../ui/BaseButton.vue'
import { PRIORITETI, STATUSI } from '../../data/mock'
import { prioritetNaziv, statusNaziv } from '../../utils/format'

const props = defineProps({ zadatak: Object })

const open = defineModel({ type: Boolean })
const emit = defineEmits(['spremi'])

const prazan = {
  naslov: '',
  opis: '',
  rokIzvrsenja: new Date().toISOString().slice(0, 10),
  prioritet: PRIORITETI.SREDNJI,
  status: STATUSI.NA_CEKANJU,
}
const obrazac = ref({ ...prazan })

const prioritetOpcije = Object.values(PRIORITETI).map((prioritet) => ({
  value: prioritet,
  label: prioritetNaziv[prioritet],
}))
const statusOpcije = Object.values(STATUSI).map((status) => ({
  value: status,
  label: statusNaziv[status],
}))

watch(open, (vrijednost) => {
  if (vrijednost) obrazac.value = props.zadatak ? { ...props.zadatak } : { ...prazan }
})

function posalji() {
  if (!obrazac.value.naslov.trim()) return
  emit('spremi', { ...obrazac.value })
  open.value = false
}
</script>

<template>
  <BaseModal v-model="open" :title="zadatak ? 'Uredi zadatak' : 'Novi zadatak'">
    <form class="space-y-4" @submit.prevent="posalji">
      <BaseInput v-model="obrazac.naslov" label="Naslov" placeholder="npr. Riješi zadaću 3" />
      <BaseInput v-model="obrazac.opis" label="Opis" placeholder="Neobavezno" />
      <BaseInput v-model="obrazac.rokIzvrsenja" label="Rok izvršenja" type="date" />

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BaseSelect
          v-model="obrazac.prioritet"
          :options="prioritetOpcije"
          label="Prioritet"
          class="w-full"
        />
        <BaseSelect
          v-model="obrazac.status"
          :options="statusOpcije"
          label="Status"
          class="w-full"
        />
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <BaseButton type="button" variant="secondary" @click="open = false">Odustani</BaseButton>
        <BaseButton>Spremi</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
