<script setup>
defineProps({
  icon: { type: Boolean, default: true },
})
</script>

<template>
  <div class="flex items-center gap-3">
    <img v-if="icon" src="../assets/header_icon.svg" alt="" class="h-10 w-10" />
    <p class="text-3xl font-bold text-sb-blue">StudyBuddy</p>
  </div>
</template>
