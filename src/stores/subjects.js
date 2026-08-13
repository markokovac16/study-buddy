import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthStore } from './auth'
import * as mock from '../data/mock'
import { STATUSI } from '../data/mock'

let brojac = 100
const noviId = (prefiks) => `${prefiks}${++brojac}`

export const useSubjectsStore = defineStore('subjects', () => {
  const auth = useAuthStore()

  const predmeti = ref([])
  const zadaci = ref([])
  const ucitavanje = ref(true)
  const biljeske = ref([...mock.biljeske])
  const prilozi = ref([...mock.prilozi])

  const zbirka = (naziv) => collection(db, 'korisnici', auth.korisnik.korisnikId, naziv)

  const zadaciPredmeta = (predmetId) => zadaci.value.filter((z) => z.predmetId === predmetId)
  const biljeskePredmeta = (predmetId) => biljeske.value.filter((b) => b.predmetId === predmetId)
  const priloziPredmeta = (predmetId) => prilozi.value.filter((p) => p.predmetId === predmetId)
  const predmetPoId = (predmetId) => predmeti.value.find((p) => p.predmetId === predmetId)

  const naCekanju = (predmetId) =>
    zadaciPredmeta(predmetId).filter((z) => z.status !== STATUSI.ZAVRSENO).length

  function napredak(predmetId) {
    const svi = zadaciPredmeta(predmetId)
    if (!svi.length) return 0
    const zavrseni = svi.filter((z) => z.status === STATUSI.ZAVRSENO).length
    return Math.round((zavrseni / svi.length) * 100)
  }

  const IZVORI = 2
  let odjave = []
  let primljeno = 0

  function oznaciUcitano() {
    primljeno += 1
    if (primljeno >= IZVORI) ucitavanje.value = false
  }

  function pretplati() {
    ucitavanje.value = true
    primljeno = 0
    odjave = [
      onSnapshot(zbirka('predmeti'), (snimka) => {
        predmeti.value = snimka.docs
          .map((dokument) => ({ predmetId: dokument.id, ...dokument.data() }))
          .sort((prvi, drugi) => prvi.naziv.localeCompare(drugi.naziv))
        oznaciUcitano()
      }),
      onSnapshot(zbirka('zadaci'), (snimka) => {
        zadaci.value = snimka.docs.map((dokument) => ({
          zadatakId: dokument.id,
          ...dokument.data(),
        }))
        oznaciUcitano()
      }),
    ]
  }

  function odjaviSve() {
    odjave.forEach((odjava) => odjava())
    odjave = []
    predmeti.value = []
    zadaci.value = []
  }

  watch(
    () => auth.korisnik?.korisnikId,
    (korisnikId) => {
      odjaviSve()
      if (korisnikId) pretplati()
    },
    { immediate: true },
  )

  function dodajPredmet(predmet) {
    return addDoc(zbirka('predmeti'), { ikona: 'knjiga', ...predmet })
  }

  function urediPredmet(predmetId, promjene) {
    return updateDoc(doc(zbirka('predmeti'), predmetId), promjene)
  }

  async function obrisiPredmet(predmetId) {
    await Promise.all(
      zadaciPredmeta(predmetId).map((zadatak) =>
        deleteDoc(doc(zbirka('zadaci'), zadatak.zadatakId)),
      ),
    )
    await deleteDoc(doc(zbirka('predmeti'), predmetId))
    biljeske.value = biljeske.value.filter((b) => b.predmetId !== predmetId)
    prilozi.value = prilozi.value.filter((p) => p.predmetId !== predmetId)
  }

  function dodajZadatak(zadatak) {
    return addDoc(zbirka('zadaci'), { status: STATUSI.NA_CEKANJU, opis: '', ...zadatak })
  }

  function urediZadatak(zadatakId, promjene) {
    return updateDoc(doc(zbirka('zadaci'), zadatakId), promjene)
  }

  function obrisiZadatak(zadatakId) {
    return deleteDoc(doc(zbirka('zadaci'), zadatakId))
  }

  function prebaciStatus(zadatakId) {
    const zadatak = zadaci.value.find((z) => z.zadatakId === zadatakId)
    if (!zadatak) return
    const status = zadatak.status === STATUSI.ZAVRSENO ? STATUSI.NA_CEKANJU : STATUSI.ZAVRSENO
    return urediZadatak(zadatakId, { status })
  }

  function dodajBiljesku(biljeska) {
    biljeske.value.push({
      biljeskaId: noviId('b'),
      datum: new Date().toISOString().slice(0, 10),
      ...biljeska,
    })
  }

  function urediBiljesku(biljeskaId, promjene) {
    const biljeska = biljeske.value.find((b) => b.biljeskaId === biljeskaId)
    if (biljeska) Object.assign(biljeska, promjene)
  }

  function obrisiBiljesku(biljeskaId) {
    biljeske.value = biljeske.value.filter((b) => b.biljeskaId !== biljeskaId)
  }

  function dodajPrilog(prilog) {
    prilozi.value.push({
      prilogId: noviId('pr'),
      datum: new Date().toISOString().slice(0, 10),
      url: '#',
      ...prilog,
    })
  }

  function obrisiPrilog(prilogId) {
    prilozi.value = prilozi.value.filter((p) => p.prilogId !== prilogId)
  }

  return {
    predmeti,
    zadaci,
    ucitavanje,
    biljeske,
    prilozi,
    predmetPoId,
    zadaciPredmeta,
    biljeskePredmeta,
    priloziPredmeta,
    naCekanju,
    napredak,
    dodajPredmet,
    urediPredmet,
    obrisiPredmet,
    dodajZadatak,
    urediZadatak,
    obrisiZadatak,
    prebaciStatus,
    dodajBiljesku,
    urediBiljesku,
    obrisiBiljesku,
    dodajPrilog,
    obrisiPrilog,
  }
})
