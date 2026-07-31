<script setup>
defineProps({
  icon: { type: Boolean, default: true },
  size: { type: String, default: 'text-2xl' },
})
</script>

<template>
  <div class="flex items-center gap-2">
    <img v-if="icon" src="../assets/header_icon.svg" alt="" class="h-9 w-9" />
    <p class="font-bold text-sb-blue" :class="size">StudyBuddy</p>
  </div>
</template>
