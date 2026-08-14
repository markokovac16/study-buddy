import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthStore } from './auth'

const kljucDatuma = (datum) => datum.toISOString().slice(0, 10)

const zadnjihDana = (broj) =>
  Array.from({ length: broj }, (_, indeks) => {
    const datum = new Date()
    datum.setDate(datum.getDate() - (broj - 1 - indeks))
    return datum
  })

export const useAdminStore = defineStore('admin', () => {
  const auth = useAuthStore()

  const korisnici = ref([])
  const ucitavanje = ref(true)

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

  const aktivnihKorisnika = computed(
    () => korisnici.value.filter((korisnik) => korisnik.aktivan).length,
  )
  const administratora = computed(
    () => korisnici.value.filter((korisnik) => korisnik.uloga === 'admin').length,
  )
  const prijavljenihDanas = computed(
    () =>
      korisnici.value.filter(
        (korisnik) => korisnik.zadnjaPrijava?.slice(0, 10) === kljucDatuma(new Date()),
      ).length,
  )

  const registracijePoDanima = computed(() =>
    zadnjihDana(7).map((datum) => ({
      oznaka: datum.toLocaleDateString('hr-HR', { weekday: 'short' }),
      broj: korisnici.value.filter((korisnik) => korisnik.datumRegistracije === kljucDatuma(datum))
        .length,
    })),
  )

  const novihTjedan = computed(() =>
    registracijePoDanima.value.reduce((zbroj, dan) => zbroj + dan.broj, 0),
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
    aktivnihKorisnika,
    administratora,
    prijavljenihDanas,
    registracijePoDanima,
    novihTjedan,
    postaviAktivnost,
    postaviUlogu,
    obrisiKorisnika,
    skupnaDeaktivacija,
    skupnoBrisanje,
  }
})
