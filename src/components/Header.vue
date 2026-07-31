<script setup>
import Logo from './Logo.vue'
</script>

<template>
  <header class="flex h-16 items-center justify-between bg-sb-surface px-12 shadow-sm">
    <Logo />

    <div class="flex items-center gap-4">
      <img src="../assets/notify_icon.svg" alt="" class="h-6 w-6" />
      <img src="../assets/profile_icon.svg" alt="" class="h-6 w-6" />
    </div>
  </header>
</template>
