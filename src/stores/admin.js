import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthStore } from './auth'
import { metrikePlatforme } from '../data/mock'

export const useAdminStore = defineStore('admin', () => {
  const auth = useAuthStore()

  const korisnici = ref([])
  const ucitavanje = ref(true)
  const metrike = ref(metrikePlatforme)

  const zbirka = collection(db, 'korisnici')
  const zapis = (korisnikId) => doc(zbirka, korisnikId)

  let odjavaKorisnika = null

  function pretplati() {
    ucitavanje.value = true
    odjavaKorisnika = onSnapshot(zbirka, (snimka) => {
      korisnici.value = snimka.docs
        .map((dokument) => ({ korisnikId: dokument.id, ...dokument.data() }))
        .sort((prvi, drugi) => prvi.ime.localeCompare(drugi.ime))
      ucitavanje.value = false
    })
  }

  function odjavi() {
    if (odjavaKorisnika) odjavaKorisnika()
    odjavaKorisnika = null
    korisnici.value = []
  }

  watch(
    () => auth.jeAdmin,
    (jeAdmin) => {
      odjavi()
      if (jeAdmin) pretplati()
    },
    { immediate: true },
  )

  const tudji = (idevi) => idevi.filter((korisnikId) => korisnikId !== auth.korisnik?.korisnikId)

  function postaviAktivnost(korisnikId, aktivan) {
    return updateDoc(zapis(korisnikId), { aktivan })
  }

  function postaviUlogu(korisnikId, uloga) {
    return updateDoc(zapis(korisnikId), { uloga })
  }

  function obrisiKorisnika(korisnikId) {
    return deleteDoc(zapis(korisnikId))
  }

  function skupnaDeaktivacija(idevi) {
    return Promise.all(tudji(idevi).map((korisnikId) => postaviAktivnost(korisnikId, false)))
  }

  function skupnoBrisanje(idevi) {
    return Promise.all(tudji(idevi).map(obrisiKorisnika))
  }

  return {
    korisnici,
    ucitavanje,
    metrike,
    postaviAktivnost,
    postaviUlogu,
    obrisiKorisnika,
    skupnaDeaktivacija,
    skupnoBrisanje,
  }
})
