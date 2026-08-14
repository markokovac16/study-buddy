<script setup>
import { ref, watch } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import BaseButton from '../ui/BaseButton.vue'
import { bojePredmeta } from '../../utils/format'

const props = defineProps({ predmet: Object })

const open = defineModel({ type: Boolean })
const emit = defineEmits(['spremi'])

const prazan = { naziv: '', opis: '', boja: 'indigo', ikona: 'knjiga' }
const obrazac = ref({ ...prazan })

const bojeOpcije = Object.keys(bojePredmeta).map((boja) => ({ value: boja, label: boja }))
const ikoneOpcije = [
  { value: 'knjiga', label: 'Knjiga' },
  { value: 'ploca', label: 'Ploča' },
  { value: 'graf', label: 'Graf' },
  { value: 'iskra', label: 'Iskra' },
  { value: 'sat', label: 'Sat' },
]

watch(open, (vrijednost) => {
  if (vrijednost) obrazac.value = props.predmet ? { ...props.predmet } : { ...prazan }
})

function posalji() {
  if (!obrazac.value.naziv.trim()) return
  emit('spremi', { ...obrazac.value })
  open.value = false
}
</script>

<template>
  <BaseModal v-model="open" :title="predmet ? 'Uredi predmet' : 'Novi predmet'">
    <form class="space-y-4" @submit.prevent="posalji">
      <BaseInput v-model="obrazac.naziv" label="Naziv" placeholder="npr. Strukture podataka" />
      <BaseInput v-model="obrazac.opis" label="Opis" placeholder="npr. Računalne znanosti 202" />

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BaseSelect v-model="obrazac.boja" :options="bojeOpcije" label="Boja" class="w-full" />
        <BaseSelect v-model="obrazac.ikona" :options="ikoneOpcije" label="Ikona" class="w-full" />
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <BaseButton type="button" variant="secondary" @click="open = false">Odustani</BaseButton>
        <BaseButton>Spremi</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
