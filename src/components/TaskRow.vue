<script setup>
import Icon from './ui/Icon.vue'
import BaseBadge from './ui/BaseBadge.vue'
import { STATUSI } from '../data/mock'
import { prioritetBoja, prioritetNaziv, relativniRok, statusNaziv } from '../utils/format'

defineProps({ zadatak: { type: Object, required: true } })

defineEmits(['prebaci', 'uredi', 'obrisi'])
</script>

<template>
  <div class="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
    <button
      class="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition"
      :class="
        zadatak.status === STATUSI.ZAVRSENO
          ? 'border-sb-indigo bg-sb-indigo text-white'
          : 'border-slate-300'
      "
      @click="$emit('prebaci')"
    >
      <Icon v-if="zadatak.status === STATUSI.ZAVRSENO" name="kvacica" size="h-3.5 w-3.5" />
    </button>

    <div class="flex-1">
      <p
        class="text-sm font-semibold"
        :class="
          zadatak.status === STATUSI.ZAVRSENO ? 'text-slate-400 line-through' : 'text-slate-800'
        "
      >
        {{ zadatak.naslov }}
      </p>
      <p class="mt-1 flex items-center gap-2 text-xs text-slate-500">
        {{ relativniRok(zadatak.rokIzvrsenja) }} •
        {{ statusNaziv[zadatak.status] }}
      </p>
    </div>

    <BaseBadge :color="prioritetBoja[zadatak.prioritet]">{{
      prioritetNaziv[zadatak.prioritet]
    }}</BaseBadge>

    <button
      class="cursor-pointer text-slate-400 transition hover:text-sb-indigo"
      @click="$emit('uredi')"
    >
      <Icon name="olovka" />
    </button>
    <button
      class="cursor-pointer text-slate-400 transition hover:text-red-600"
      @click="$emit('obrisi')"
    >
      <Icon name="kanta" />
    </button>
  </div>
</template>
