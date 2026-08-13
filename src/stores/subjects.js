import { computed, ref, watch } from 'vue'
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
  const zadaciPoPredmetu = ref({})
  const ucitavanjePredmeta = ref(true)
  const biljeske = ref([...mock.biljeske])
  const prilozi = ref([...mock.prilozi])

  const zbirkaPredmeta = () => collection(db, 'korisnici', auth.korisnik.korisnikId, 'predmeti')
  const zapisPredmeta = (predmetId) => doc(zbirkaPredmeta(), predmetId)
  const zbirkaZadataka = (predmetId) => collection(zapisPredmeta(predmetId), 'zadaci')

  const zadaci = computed(() => Object.values(zadaciPoPredmetu.value).flat())

  const ucitavanje = computed(
    () =>
      ucitavanjePredmeta.value ||
      predmeti.value.some((predmet) => !(predmet.predmetId in zadaciPoPredmetu.value)),
  )

  const zadaciPredmeta = (predmetId) => zadaciPoPredmetu.value[predmetId] ?? []
  const biljeskePredmeta = (predmetId) => biljeske.value.filter((b) => b.predmetId === predmetId)
  const priloziPredmeta = (predmetId) => prilozi.value.filter((p) => p.predmetId === predmetId)
  const predmetPoId = (predmetId) => predmeti.value.find((p) => p.predmetId === predmetId)
  const zadatakPoId = (zadatakId) => zadaci.value.find((z) => z.zadatakId === zadatakId)

  const naCekanju = (predmetId) =>
    zadaciPredmeta(predmetId).filter((z) => z.status !== STATUSI.ZAVRSENO).length

  function napredak(predmetId) {
    const svi = zadaciPredmeta(predmetId)
    if (!svi.length) return 0
    const zavrseni = svi.filter((z) => z.status === STATUSI.ZAVRSENO).length
    return Math.round((zavrseni / svi.length) * 100)
  }

  let odjavaPredmeta = null
  const odjaveZadataka = new Map()

  function pratiZadatke(predmetId) {
    const odjava = onSnapshot(zbirkaZadataka(predmetId), (snimka) => {
      zadaciPoPredmetu.value = {
        ...zadaciPoPredmetu.value,
        [predmetId]: snimka.docs.map((dokument) => ({
          zadatakId: dokument.id,
          predmetId,
          ...dokument.data(),
        })),
      }
    })
    odjaveZadataka.set(predmetId, odjava)
  }

  function prestaniPratiti(predmetId) {
    odjaveZadataka.get(predmetId)()
    odjaveZadataka.delete(predmetId)
    const preostali = { ...zadaciPoPredmetu.value }
    delete preostali[predmetId]
    zadaciPoPredmetu.value = preostali
  }

  function uskladiZadatke(idevi) {
    idevi.filter((predmetId) => !odjaveZadataka.has(predmetId)).forEach(pratiZadatke)
    ;[...odjaveZadataka.keys()]
      .filter((predmetId) => !idevi.includes(predmetId))
      .forEach(prestaniPratiti)
  }

  function pretplati() {
    ucitavanjePredmeta.value = true
    odjavaPredmeta = onSnapshot(zbirkaPredmeta(), (snimka) => {
      predmeti.value = snimka.docs
        .map((dokument) => ({ predmetId: dokument.id, ...dokument.data() }))
        .sort((prvi, drugi) => prvi.naziv.localeCompare(drugi.naziv))
      uskladiZadatke(predmeti.value.map((predmet) => predmet.predmetId))
      ucitavanjePredmeta.value = false
    })
  }

  function odjaviSve() {
    if (odjavaPredmeta) odjavaPredmeta()
    odjavaPredmeta = null
    odjaveZadataka.forEach((odjava) => odjava())
    odjaveZadataka.clear()
    predmeti.value = []
    zadaciPoPredmetu.value = {}
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
    return addDoc(zbirkaPredmeta(), { ikona: 'knjiga', ...predmet })
  }

  function urediPredmet(predmetId, promjene) {
    return updateDoc(zapisPredmeta(predmetId), promjene)
  }

  async function obrisiPredmet(predmetId) {
    await Promise.all(
      zadaciPredmeta(predmetId).map((zadatak) =>
        deleteDoc(doc(zbirkaZadataka(predmetId), zadatak.zadatakId)),
      ),
    )
    await deleteDoc(zapisPredmeta(predmetId))
    biljeske.value = biljeske.value.filter((b) => b.predmetId !== predmetId)
    prilozi.value = prilozi.value.filter((p) => p.predmetId !== predmetId)
  }

  function dodajZadatak({ predmetId, ...zadatak }) {
    return addDoc(zbirkaZadataka(predmetId), { status: STATUSI.NA_CEKANJU, opis: '', ...zadatak })
  }

  function urediZadatak(zadatakId, promjene) {
    const zadatak = zadatakPoId(zadatakId)
    if (!zadatak) return
    return updateDoc(doc(zbirkaZadataka(zadatak.predmetId), zadatakId), promjene)
  }

  function obrisiZadatak(zadatakId) {
    const zadatak = zadatakPoId(zadatakId)
    if (!zadatak) return
    return deleteDoc(doc(zbirkaZadataka(zadatak.predmetId), zadatakId))
  }

  function prebaciStatus(zadatakId) {
    const zadatak = zadatakPoId(zadatakId)
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
