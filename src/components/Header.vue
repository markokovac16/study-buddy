<script setup>
import { RouterLink } from 'vue-router'
import Logo from './Logo.vue'
import Icon from './ui/Icon.vue'
import Avatar from './ui/Avatar.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<template>
  <header class="flex h-16 items-center justify-between bg-sb-surface px-12 shadow-sm">
    <RouterLink :to="auth.prijavljen ? '/ploca' : '/'">
      <Logo />
    </RouterLink>

    <div v-if="auth.prijavljen" class="flex items-center gap-4">
      <Icon name="zvono" size="h-6 w-6 text-slate-500" />
      <RouterLink to="/profil">
        <Avatar :ime="auth.korisnik.ime" size="h-9 w-9 text-xs" />
      </RouterLink>
    </div>
  </header>
</template>
