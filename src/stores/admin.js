import { ref } from 'vue'
import { defineStore } from 'pinia'
import { korisniciPlatforme, sadrzajNaslovnice, metrikePlatforme } from '../data/mock'

let brojac = 100

export const useAdminStore = defineStore('admin', () => {
  const korisnici = ref([...korisniciPlatforme])
  const sadrzaj = ref([...sadrzajNaslovnice])
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

  function dodajSadrzaj(stavka) {
    sadrzaj.value.push({ sadrzajId: `sn${++brojac}`, vidljiv: true, ...stavka })
  }

  function urediSadrzaj(sadrzajId, promjene) {
    const stavka = sadrzaj.value.find((s) => s.sadrzajId === sadrzajId)
    if (stavka) Object.assign(stavka, promjene)
  }

  function obrisiSadrzaj(sadrzajId) {
    sadrzaj.value = sadrzaj.value.filter((s) => s.sadrzajId !== sadrzajId)
  }

  function pomakni(sadrzajId, smjer) {
    const indeks = sadrzaj.value.findIndex((s) => s.sadrzajId === sadrzajId)
    const novi = indeks + smjer
    if (indeks < 0 || novi < 0 || novi >= sadrzaj.value.length) return
    const [stavka] = sadrzaj.value.splice(indeks, 1)
    sadrzaj.value.splice(novi, 0, stavka)
  }

  return {
    korisnici,
    sadrzaj,
    metrike,
    postaviAktivnost,
    obrisiKorisnika,
    skupnaDeaktivacija,
    skupnoBrisanje,
    dodajSadrzaj,
    urediSadrzaj,
    obrisiSadrzaj,
    pomakni,
  }
})
