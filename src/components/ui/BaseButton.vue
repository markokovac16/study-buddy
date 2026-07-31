<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  block: { type: Boolean, default: false },
})

const variants = {
  primary: 'bg-sb-indigo text-white hover:bg-sb-blue',
  secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}
</script>

<template>
  <button
    class="cursor-pointer rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
    :class="[variants[variant], block && 'w-full']"
  >
    <slot />
  </button>
</template>
