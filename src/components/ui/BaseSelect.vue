<script setup>
defineProps({
  options: { type: Array, required: true },
})

const model = defineModel()
</script>

<template>
  <select
    v-model="model"
    class="cursor-pointer rounded-xl bg-slate-200/70 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sb-indigo"
  >
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
