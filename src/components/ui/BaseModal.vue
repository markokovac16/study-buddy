<script setup>
defineProps({
  title: String,
})

const open = defineModel({ type: Boolean })
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
    @click.self="open = false"
  >
    <div class="rounded-card w-full max-w-lg bg-white p-6 shadow-xl">
      <h2 class="mb-5 text-xl font-bold text-sb-blue">{{ title }}</h2>
      <slot />
    </div>
  </div>
</template>
