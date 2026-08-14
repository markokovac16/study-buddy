<script setup>
import { computed, ref } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import BaseTextarea from '../ui/BaseTextarea.vue'
import BaseButton from '../ui/BaseButton.vue'
import { useModalForm } from '../../composables/modalForm'

const props = defineProps({ biljeska: Object, kategorije: { type: Array, default: () => [] } })

const open = defineModel({ type: Boolean })
const emit = defineEmits(['spremi'])

const NOVA = '__nova'

const prazna = { naslov: '', kategorija: '', sadrzaj: '' }
const novaKategorija = ref('')

const kategorijaOpcije = computed(() => [
  ...props.kategorije.map((kategorija) => ({ value: kategorija, label: kategorija })),
  { value: NOVA, label: 'Nova kategorija...' },
])

const { obrazac, posalji } = useModalForm(open, prazna, {
  stavka: () => props.biljeska,
  nakon: (podaci) => {
    novaKategorija.value = ''
    if (!props.biljeska) podaci.kategorija = props.kategorije[0] ?? ''
    if (!props.kategorije.includes(podaci.kategorija)) podaci.kategorija = NOVA
  },
  pretvori: (podaci) => {
    const kategorija = podaci.kategorija === NOVA ? novaKategorija.value.trim() : podaci.kategorija
    return kategorija ? { ...podaci, kategorija } : null
  },
  spremi: (podaci) => emit('spremi', podaci),
})
</script>

<template>
  <BaseModal v-model="open" :title="biljeska ? 'Uredi bilješku' : 'Nova bilješka'">
    <form class="space-y-4" @submit.prevent="posalji">
      <BaseInput v-model="obrazac.naslov" label="Naslov" placeholder="npr. Kolizije hash tablice" />

      <BaseSelect
        v-model="obrazac.kategorija"
        :options="kategorijaOpcije"
        label="Kategorija"
        class="w-full"
      />

      <BaseInput
        v-if="obrazac.kategorija === NOVA"
        v-model="novaKategorija"
        label="Naziv nove kategorije"
        placeholder="npr. Koncepti"
      />

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
