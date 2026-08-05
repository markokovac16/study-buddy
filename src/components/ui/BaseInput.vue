<script setup>
defineProps({
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  error: String,
})

const model = defineModel()
</script>

<template>
  <label class="block">
    <span
      v-if="label"
      class="mb-1.5 block text-xs font-semibold tracking-wide text-sb-blue uppercase"
    >
      {{ label }}
    </span>
    <input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      class="w-full rounded-xl bg-slate-200/70 px-4 py-3 text-slate-800 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-sb-indigo"
      :class="error && 'ring-2 ring-red-500'"
    />
    <span v-if="error" class="mt-1 block text-xs text-red-600">{{ error }}</span>
  </label>
</template>
