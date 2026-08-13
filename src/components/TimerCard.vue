<script setup>
import { usePomodoroStore } from '../stores/pomodoro'
import BaseCard from './ui/BaseCard.vue'
import BaseButton from './ui/BaseButton.vue'
import Icon from './ui/Icon.vue'

const pomodoro = usePomodoroStore()
</script>

<template>
  <BaseCard>
    <div class="flex flex-col items-center">
      <p class="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
        {{ pomodoro.faza === 'rad' ? 'Timer fokusa' : 'Pauza' }}
      </p>
      <p class="my-3 text-6xl font-bold text-sb-indigo tabular-nums">
        {{ pomodoro.prikaz }}
      </p>

      <div class="flex items-center gap-3">
        <BaseButton :disabled="pomodoro.radi" @click="pomodoro.pokreni()">Pokreni</BaseButton>
        <BaseButton variant="secondary" :disabled="!pomodoro.radi" @click="pomodoro.zaustavi()">
          Pauza
        </BaseButton>
        <button
          class="cursor-pointer rounded-xl bg-slate-100 p-2.5 text-slate-600 transition hover:bg-slate-200"
          @click="pomodoro.resetiraj()"
        >
          <Icon name="reset" />
        </button>
      </div>

      <p class="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
        <Icon name="iskra" size="h-4 w-4" />
        {{ pomodoro.opisSesije }}
      </p>
    </div>
  </BaseCard>
</template>
