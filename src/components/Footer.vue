<script setup>
import Logo from './Logo.vue'

const links = ['O nama', 'Kontakt', 'Privatnost', 'Uvjeti']
</script>

<template>
  <div class="flex h-16 w-full items-center justify-between px-12 py-3 shadow-xl">
    <div class="w-1/3">
      <Logo :icon="false" />
    </div>

    <div class="flex w-1/3 items-center justify-center gap-6">
      <p v-for="link in links" :key="link">{{ link }}</p>
    </div>

    <p class="flex w-1/3 items-center justify-end">© 2024 StudyBuddy Kognitivno utočište</p>
  </div>
</template>
