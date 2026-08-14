<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import BaseTextarea from '../ui/BaseTextarea.vue'
import BaseButton from '../ui/BaseButton.vue'

const props = defineProps({ biljeska: Object, kategorije: { type: Array, default: () => [] } })

const open = defineModel({ type: Boolean })
const emit = defineEmits(['spremi'])

const NOVA = '__nova'

const prazna = { naslov: '', kategorija: '', sadrzaj: '' }
const obrazac = ref({ ...prazna })
const novaKategorija = ref('')

const kategorijaOpcije = computed(() => [
  ...props.kategorije.map((kategorija) => ({ value: kategorija, label: kategorija })),
  { value: NOVA, label: 'Nova kategorija...' },
])

watch(open, (vrijednost) => {
  if (!vrijednost) return
  obrazac.value = props.biljeska
    ? { ...props.biljeska }
    : { ...prazna, kategorija: props.kategorije[0] ?? '' }
  novaKategorija.value = ''
  if (!props.kategorije.includes(obrazac.value.kategorija)) obrazac.value.kategorija = NOVA
})

function posalji() {
  const kategorija =
    obrazac.value.kategorija === NOVA ? novaKategorija.value.trim() : obrazac.value.kategorija
  if (!obrazac.value.naslov.trim() || !kategorija) return
  emit('spremi', { ...obrazac.value, kategorija })
  open.value = false
}
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
