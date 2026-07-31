import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as mock from '../data/mock'
import { STATUSI } from '../data/mock'

let brojac = 100
const noviId = (prefiks) => `${prefiks}${++brojac}`

export const usePredmetiStore = defineStore('predmeti', () => {
  const predmeti = ref([...mock.predmeti])
  const zadaci = ref([...mock.zadaci])
  const biljeske = ref([...mock.biljeske])
  const prilozi = ref([...mock.prilozi])

  const zadaciPredmeta = (predmetId) => zadaci.value.filter((z) => z.predmetId === predmetId)
  const biljeskePredmeta = (predmetId) => biljeske.value.filter((b) => b.predmetId === predmetId)
  const priloziPredmeta = (predmetId) => prilozi.value.filter((p) => p.predmetId === predmetId)
  const predmetPoId = (predmetId) => predmeti.value.find((p) => p.predmetId === predmetId)

  const naCekanju = (predmetId) => zadaciPredmeta(predmetId).filter((z) => z.status !== STATUSI.ZAVRSENO).length

  function napredak(predmetId) {
    const svi = zadaciPredmeta(predmetId)
    if (!svi.length) return 0
    const zavrseni = svi.filter((z) => z.status === STATUSI.ZAVRSENO).length
    return Math.round((zavrseni / svi.length) * 100)
  }

  function dodajPredmet(predmet) {
    predmeti.value.push({ predmetId: noviId('p'), ikona: 'knjiga', ...predmet })
  }

  function urediPredmet(predmetId, promjene) {
    const predmet = predmetPoId(predmetId)
    if (predmet) Object.assign(predmet, promjene)
  }

  function obrisiPredmet(predmetId) {
    predmeti.value = predmeti.value.filter((p) => p.predmetId !== predmetId)
    zadaci.value = zadaci.value.filter((z) => z.predmetId !== predmetId)
    biljeske.value = biljeske.value.filter((b) => b.predmetId !== predmetId)
    prilozi.value = prilozi.value.filter((p) => p.predmetId !== predmetId)
  }

  function dodajZadatak(zadatak) {
    zadaci.value.push({ zadatakId: noviId('z'), status: STATUSI.NA_CEKANJU, opis: '', ...zadatak })
  }

  function urediZadatak(zadatakId, promjene) {
    const zadatak = zadaci.value.find((z) => z.zadatakId === zadatakId)
    if (zadatak) Object.assign(zadatak, promjene)
  }

  function obrisiZadatak(zadatakId) {
    zadaci.value = zadaci.value.filter((z) => z.zadatakId !== zadatakId)
  }

  function prebaciStatus(zadatakId) {
    const zadatak = zadaci.value.find((z) => z.zadatakId === zadatakId)
    if (zadatak) zadatak.status = zadatak.status === STATUSI.ZAVRSENO ? STATUSI.NA_CEKANJU : STATUSI.ZAVRSENO
  }

  function dodajBiljesku(biljeska) {
    biljeske.value.push({ biljeskaId: noviId('b'), datum: new Date().toISOString().slice(0, 10), ...biljeska })
  }

  function urediBiljesku(biljeskaId, promjene) {
    const biljeska = biljeske.value.find((b) => b.biljeskaId === biljeskaId)
    if (biljeska) Object.assign(biljeska, promjene)
  }

  function obrisiBiljesku(biljeskaId) {
    biljeske.value = biljeske.value.filter((b) => b.biljeskaId !== biljeskaId)
  }

  function dodajPrilog(prilog) {
    prilozi.value.push({ prilogId: noviId('pr'), datum: new Date().toISOString().slice(0, 10), url: '#', ...prilog })
  }

  function obrisiPrilog(prilogId) {
    prilozi.value = prilozi.value.filter((p) => p.prilogId !== prilogId)
  }

  return {
    predmeti,
    zadaci,
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
