<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const lozinka = ref('')
const poslano = ref(false)

const greskaEmaila = computed(() => {
  if (!poslano.value) return ''
  if (!email.value) return 'Unesite adresu e-pošte.'
  if (!/^\S+@\S+\.\S+$/.test(email.value)) return 'Adresa e-pošte nije ispravna.'
  return ''
})

const greskaLozinke = computed(() => {
  if (!poslano.value) return ''
  if (lozinka.value.length < 6) return 'Lozinka mora imati barem 6 znakova.'
  return ''
})

function posalji() {
  poslano.value = true
  if (greskaEmaila.value || greskaLozinke.value) return
  auth.registracija(email.value)
  router.push(auth.jeAdmin ? '/admin/pregled' : '/app/ploca')
}

function google() {
  auth.prijavaGoogle()
  router.push('/app/ploca')
}
</script>

<template>
  <div class="flex justify-center px-6 py-20">
    <form class="w-full max-w-md" @submit.prevent="posalji">
      <h1 class="text-center text-4xl font-bold text-slate-900">Zakoračite u svoje utočište</h1>
      <p class="mt-3 mb-8 text-center text-slate-500">
        Pridružite se s 10.000+ studenata koji danas vraćaju svoj fokus.
      </p>

      <BaseButton type="button" variant="outline" block @click="google"
        >Registracija putem Googlea</BaseButton
      >

      <div class="my-6 flex items-center gap-4">
        <span class="h-px flex-1 bg-slate-200" />
        <span class="text-[10px] font-semibold tracking-wide text-slate-400 uppercase"
          >ili koristite e-poštu</span
        >
        <span class="h-px flex-1 bg-slate-200" />
      </div>

      <div class="space-y-4">
        <BaseInput
          v-model="email"
          label="Adresa e-pošte"
          type="email"
          placeholder="name@university.edu"
          :error="greskaEmaila"
        />
        <BaseInput
          v-model="lozinka"
          label="Lozinka"
          type="password"
          placeholder="••••••••••"
          :error="greskaLozinke"
        />
        <BaseButton block>Izradi račun</BaseButton>
      </div>

      <p class="mt-4 text-center text-xs text-slate-500">
        Registracijom prihvaćate naše Uvjete pružanja usluge.
      </p>
      <p class="mt-6 text-center text-sm text-slate-500">
        Već imate račun?
        <RouterLink to="/prijava" class="font-semibold text-sb-indigo">Prijavite se</RouterLink>
      </p>
    </form>
  </div>
</template>
