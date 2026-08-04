<script setup>
import Logo from './Logo.vue'

const links = ['O nama', 'Kontakt', 'Privatnost', 'Uvjeti']
</script>

<template>
  <footer
    class="flex h-16 w-full items-center justify-between bg-sb-surface px-12 text-sm text-slate-500"
  >
    <div class="w-1/3">
      <Logo :icon="false" size="text-xl" />
    </div>

    <div class="flex w-1/3 items-center justify-center gap-6">
      <a v-for="link in links" :key="link" href="#">{{ link }}</a>
    </div>

    <p class="w-1/3 text-right">© 2026 StudyBuddy. Sva prava pridržana.</p>
  </footer>
</template>
