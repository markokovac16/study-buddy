<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: String,
})
</script>

<template>
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-slate-900 sm:text-4xl">{{ title }}</h1>
    <p v-if="subtitle" class="mt-2 max-w-2xl text-slate-500">{{ subtitle }}</p>
  </div>
</template>
