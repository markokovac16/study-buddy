<script setup>
import Icon from './ui/Icon.vue'
import { formatDatum } from '../utils/format'

defineProps({ biljeska: { type: Object, required: true } })

defineEmits(['uredi', 'obrisi'])
</script>

<template>
  <div class="rounded-xl bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between">
      <p class="text-[10px] font-semibold tracking-wide text-sb-indigo uppercase">
        {{ biljeska.kategorija }}
      </p>
      <div class="flex gap-2">
        <button
          class="cursor-pointer text-slate-400 transition hover:text-sb-indigo"
          title="Uredi bilješku"
          @click="$emit('uredi')"
        >
          <Icon name="olovka" size="h-4 w-4" />
        </button>
        <button
          class="cursor-pointer text-slate-400 transition hover:text-red-600"
          title="Obriši bilješku"
          @click="$emit('obrisi')"
        >
          <Icon name="kanta" size="h-4 w-4" />
        </button>
      </div>
    </div>

    <p class="mt-1 font-semibold text-slate-900">{{ biljeska.naslov }}</p>
    <p class="mt-2 line-clamp-4 text-sm text-slate-500">
      {{ biljeska.sadrzaj }}
    </p>
    <p class="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
      <Icon name="kalendar" size="h-4 w-4" />
      {{ formatDatum(biljeska.datum) }}
    </p>
  </div>
</template>
