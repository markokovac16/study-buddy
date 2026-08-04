<script setup>
import Icon from './ui/Icon.vue'
import ProgressBar from './ui/ProgressBar.vue'
import { bojaPredmeta } from '../utils/format'

defineProps({
  predmet: { type: Object, required: true },
  naCekanju: { type: Number, default: 0 },
  napredak: { type: Number, default: 0 },
  aktivan: { type: Boolean, default: false },
})
</script>

<template>
  <button
    class="rounded-card w-full cursor-pointer bg-white p-6 text-left shadow-sm transition hover:shadow-md"
    :class="aktivan && 'ring-2 ring-sb-indigo'"
  >
    <span
      class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
      :class="[bojaPredmeta(predmet.boja).pozadina, bojaPredmeta(predmet.boja).tekst]"
    >
      <Icon :name="predmet.ikona" size="h-6 w-6" />
    </span>

    <p class="text-xl font-bold text-slate-900">{{ predmet.naziv }}</p>
    <p class="mb-4 text-sm text-slate-500 italic">{{ predmet.opis }}</p>

    <div class="mb-3 flex items-center gap-4 text-xs">
      <span
        class="flex items-center gap-1.5"
        :class="naCekanju > 5 ? 'text-red-600' : 'text-sb-indigo'"
      >
        <Icon name="ploca" size="h-4 w-4" />
        {{ naCekanju }} na čekanju
      </span>
      <span class="flex items-center gap-1.5 text-slate-400">
        <Icon name="sat" size="h-4 w-4" />
        {{ napredak }}% riješeno
      </span>
    </div>

    <ProgressBar :value="napredak" :color="bojaPredmeta(predmet.boja).traka" />
  </button>
</template>
