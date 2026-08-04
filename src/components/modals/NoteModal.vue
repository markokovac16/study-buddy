<script setup>
import { ref, watch } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseTextarea from '../ui/BaseTextarea.vue'
import BaseButton from '../ui/BaseButton.vue'

const props = defineProps({ biljeska: Object })

const open = defineModel({ type: Boolean })
const emit = defineEmits(['spremi'])

const prazna = { naslov: '', kategorija: 'Koncepti', sadrzaj: '' }
const obrazac = ref({ ...prazna })

watch(open, (vrijednost) => {
  if (vrijednost) obrazac.value = props.biljeska ? { ...props.biljeska } : { ...prazna }
})

function posalji() {
  if (!obrazac.value.naslov.trim()) return
  emit('spremi', { ...obrazac.value })
  open.value = false
}
</script>

<template>
  <BaseModal v-model="open" :title="biljeska ? 'Uredi bilješku' : 'Nova bilješka'">
    <form class="space-y-4" @submit.prevent="posalji">
      <BaseInput v-model="obrazac.naslov" label="Naslov" placeholder="npr. Kolizije hash tablice" />
      <BaseInput v-model="obrazac.kategorija" label="Kategorija" placeholder="npr. Koncepti" />
      <BaseTextarea
        v-model="obrazac.sadrzaj"
        label="Sadržaj"
        :rows="6"
        placeholder="Zapiši ključne misli..."
      />

      <div class="flex justify-end gap-3 pt-2">
        <BaseButton type="button" variant="secondary" @click="open = false">Odustani</BaseButton>
        <BaseButton>Spremi</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
