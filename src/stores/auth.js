import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { korisnik as mockKorisnik } from '../data/mock'

const KLJUC = 'sb-korisnik'

export const useAuthStore = defineStore('auth', () => {
  const spremljen = localStorage.getItem(KLJUC)
  const korisnik = ref(spremljen ? JSON.parse(spremljen) : null)

  const prijavljen = computed(() => korisnik.value !== null)
  const jeAdmin = computed(() => korisnik.value?.uloga === 'admin')
  const inicijali = computed(() =>
    korisnik.value
      ? korisnik.value.ime
          .split(' ')
          .map((rijec) => rijec[0])
          .join('')
      : '',
  )

  function spremi() {
    if (korisnik.value) localStorage.setItem(KLJUC, JSON.stringify(korisnik.value))
    else localStorage.removeItem(KLJUC)
  }

  function prijava(email) {
    korisnik.value = { ...mockKorisnik, email, uloga: email.includes('admin') ? 'admin' : 'student' }
    spremi()
  }

  function registracija(email) {
    prijava(email)
  }

  function prijavaGoogle() {
    prijava(mockKorisnik.email)
  }

  function odjava() {
    korisnik.value = null
    spremi()
  }

  function azuriraj(promjene) {
    korisnik.value = { ...korisnik.value, ...promjene }
    spremi()
  }

  function deaktiviraj() {
    azuriraj({ aktivan: false })
    odjava()
  }

  return { korisnik, prijavljen, jeAdmin, inicijali, prijava, registracija, prijavaGoogle, odjava, azuriraj, deaktiviraj }
})
