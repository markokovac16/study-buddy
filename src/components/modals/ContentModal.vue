<script setup>
import { ref, watch } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseTextarea from '../ui/BaseTextarea.vue'
import BaseToggle from '../ui/BaseToggle.vue'
import BaseButton from '../ui/BaseButton.vue'

const props = defineProps({ stavka: Object })

const open = defineModel({ type: Boolean })
const emit = defineEmits(['spremi'])

const prazna = { tip: 'Istaknuto', naslov: '', opis: '', vidljiv: true }
const obrazac = ref({ ...prazna })

watch(open, (vrijednost) => {
  if (vrijednost) obrazac.value = props.stavka ? { ...props.stavka } : { ...prazna }
})

function posalji() {
  if (!obrazac.value.naslov.trim()) return
  emit('spremi', { ...obrazac.value })
  open.value = false
}
</script>

<template>
  <BaseModal v-model="open" :title="stavka ? 'Uredi istaknuti element' : 'Novi istaknuti element'">
    <form class="space-y-4" @submit.prevent="posalji">
      <BaseInput v-model="obrazac.tip" label="Tip" placeholder="npr. Istaknuto" />
      <BaseInput v-model="obrazac.naslov" label="Naslov" />
      <BaseTextarea v-model="obrazac.opis" label="Opis" :rows="3" />

      <div class="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3">
        <span class="text-sm text-slate-600">Vidljivo na naslovnici</span>
        <BaseToggle v-model="obrazac.vidljiv" />
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <BaseButton type="button" variant="secondary" @click="open = false">Odustani</BaseButton>
        <BaseButton>Spremi</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
