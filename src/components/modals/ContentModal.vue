<script setup>
import { ref, watch } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import BaseTextarea from '../ui/BaseTextarea.vue'
import BaseToggle from '../ui/BaseToggle.vue'
import BaseButton from '../ui/BaseButton.vue'

const props = defineProps({ stavka: Object })

const open = defineModel({ type: Boolean })
const emit = defineEmits(['spremi'])

const tipOpcije = ['Obavijest', 'Savjet', 'Događanje', 'Ažuriranje'].map((tip) => ({
  value: tip,
  label: tip,
}))

const prazna = { tip: 'Obavijest', naslov: '', sadrzaj: '', poveznica: '', vidljiv: true }
const obrazac = ref({ ...prazna })

watch(open, (vrijednost) => {
  if (!vrijednost) return
  obrazac.value = props.stavka
    ? Object.fromEntries(
        Object.keys(prazna).map((polje) => [polje, props.stavka[polje] ?? prazna[polje]]),
      )
    : { ...prazna }
})

function posalji() {
  if (!obrazac.value.naslov.trim()) return
  emit('spremi', { ...obrazac.value })
  open.value = false
}
</script>

<template>
  <BaseModal v-model="open" :title="stavka ? 'Uredi objavu' : 'Nova objava'">
    <form class="space-y-4" @submit.prevent="posalji">
      <label class="block">
        <span class="mb-1.5 block text-xs font-semibold tracking-wide text-sb-blue uppercase"
          >Tip</span
        >
        <BaseSelect v-model="obrazac.tip" :options="tipOpcije" class="w-full" />
      </label>
      <BaseInput v-model="obrazac.naslov" label="Naslov" />
      <BaseTextarea v-model="obrazac.sadrzaj" label="Sadržaj" :rows="6" />
      <BaseInput
        v-model="obrazac.poveznica"
        label="Poveznica (neobavezno)"
        placeholder="https://"
      />

      <div class="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3">
        <span class="text-sm text-slate-600">Vidljivo korisnicima</span>
        <BaseToggle v-model="obrazac.vidljiv" />
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <BaseButton type="button" variant="secondary" @click="open = false">Odustani</BaseButton>
        <BaseButton>Spremi</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
