<script setup>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Sidebar from '../components/Sidebar.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Header />
    <div class="flex flex-1">
      <Sidebar />
      <main class="flex-1 px-8 py-8">
        <RouterView />
      </main>
    </div>
    <Footer />
  </div>
</template>
