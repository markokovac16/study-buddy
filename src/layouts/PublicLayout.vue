<script setup>
import { ref } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Sidebar from '../components/Sidebar.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const izbornikOtvoren = ref(false)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Header :izbornik="auth.prijavljen" @izbornik="izbornikOtvoren = true" />
    <Sidebar v-if="auth.prijavljen" v-model="izbornikOtvoren" samo-drawer />
    <main class="flex-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
