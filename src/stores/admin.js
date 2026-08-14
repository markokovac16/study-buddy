import { ref } from 'vue'
import { defineStore } from 'pinia'
import { korisniciPlatforme, metrikePlatforme } from '../data/mock'

export const useAdminStore = defineStore('admin', () => {
  const korisnici = ref([...korisniciPlatforme])
  const metrike = ref(metrikePlatforme)

  function postaviAktivnost(korisnikId, aktivan) {
    const korisnik = korisnici.value.find((k) => k.korisnikId === korisnikId)
    if (korisnik) korisnik.aktivan = aktivan
  }

  function obrisiKorisnika(korisnikId) {
    korisnici.value = korisnici.value.filter((k) => k.korisnikId !== korisnikId)
  }

  function skupnaDeaktivacija(idevi) {
    idevi.forEach((id) => postaviAktivnost(id, false))
  }

  function skupnoBrisanje(idevi) {
    korisnici.value = korisnici.value.filter((k) => !idevi.includes(k.korisnikId))
  }

  return {
    korisnici,
    metrike,
    postaviAktivnost,
    obrisiKorisnika,
    skupnaDeaktivacija,
    skupnoBrisanje,
  }
})
