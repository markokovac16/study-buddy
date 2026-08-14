import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref as mjestoDatoteke, uploadBytes } from 'firebase/storage'
import { db, spremiste } from '../firebase'
import { useAuthStore } from './auth'
import { STATUSI } from '../data/mock'

const danas = () => new Date().toISOString().slice(0, 10)

function tipDatoteke(datoteka) {
  if (datoteka.type.startsWith('image/')) return 'slika'
  return datoteka.type === 'application/pdf' ? 'pdf' : 'dokument'
}

export const useSubjectsStore = defineStore('subjects', () => {
  const auth = useAuthStore()

  const predmeti = ref([])
  const zadaciPoPredmetu = ref({})
  const biljeskePoPredmetu = ref({})
  const priloziPoPredmetu = ref({})
  const ucitavanjePredmeta = ref(true)
  const slanjePriloga = ref(false)

  const PODZBIRKE = [
    { naziv: 'zadaci', kljuc: 'zadatakId', spremnik: zadaciPoPredmetu },
    { naziv: 'biljeske', kljuc: 'biljeskaId', spremnik: biljeskePoPredmetu },
    { naziv: 'prilozi', kljuc: 'prilogId', spremnik: priloziPoPredmetu },
  ]

  const zbirkaPredmeta = () => collection(db, 'korisnici', auth.korisnik.korisnikId, 'predmeti')
  const zapisPredmeta = (predmetId) => doc(zbirkaPredmeta(), predmetId)
  const podzbirka = (predmetId, naziv) => collection(zapisPredmeta(predmetId), naziv)

  const zadaci = computed(() => Object.values(zadaciPoPredmetu.value).flat())
  const biljeske = computed(() => Object.values(biljeskePoPredmetu.value).flat())
  const prilozi = computed(() => Object.values(priloziPoPredmetu.value).flat())

  const ucitavanje = computed(
    () =>
      ucitavanjePredmeta.value ||
      predmeti.value.some((predmet) =>
        PODZBIRKE.some(({ spremnik }) => !(predmet.predmetId in spremnik.value)),
      ),
  )

  const zadaciPredmeta = (predmetId) => zadaciPoPredmetu.value[predmetId] ?? []
  const biljeskePredmeta = (predmetId) => biljeskePoPredmetu.value[predmetId] ?? []
  const priloziPredmeta = (predmetId) => priloziPoPredmetu.value[predmetId] ?? []
  const predmetPoId = (predmetId) =>
    predmeti.value.find((predmet) => predmet.predmetId === predmetId)
  const zadatakPoId = (zadatakId) => zadaci.value.find((zadatak) => zadatak.zadatakId === zadatakId)
  const biljeskaPoId = (biljeskaId) =>
    biljeske.value.find((biljeska) => biljeska.biljeskaId === biljeskaId)
  const prilogPoId = (prilogId) => prilozi.value.find((prilog) => prilog.prilogId === prilogId)

  const kategorijePredmeta = (predmetId) =>
    [...new Set(biljeskePredmeta(predmetId).map((biljeska) => biljeska.kategorija))]
      .filter(Boolean)
      .sort((prva, druga) => prva.localeCompare(druga))

  const naCekanju = (predmetId) =>
    zadaciPredmeta(predmetId).filter((zadatak) => zadatak.status !== STATUSI.ZAVRSENO).length

  function napredak(predmetId) {
    const svi = zadaciPredmeta(predmetId)
    if (!svi.length) return 0
    const zavrseni = svi.filter((zadatak) => zadatak.status === STATUSI.ZAVRSENO).length
    return Math.round((zavrseni / svi.length) * 100)
  }

  let odjavaPredmeta = null
  const odjavePodzbirki = new Map()

  function pratiPodzbirke(predmetId) {
    const odjave = PODZBIRKE.map(({ naziv, kljuc, spremnik }) =>
      onSnapshot(podzbirka(predmetId, naziv), (snimka) => {
        spremnik.value = {
          ...spremnik.value,
          [predmetId]: snimka.docs.map((dokument) => ({
            [kljuc]: dokument.id,
            predmetId,
            ...dokument.data(),
          })),
        }
      }),
    )
    odjavePodzbirki.set(predmetId, odjave)
  }

  function prestaniPratiti(predmetId) {
    odjavePodzbirki.get(predmetId).forEach((odjava) => odjava())
    odjavePodzbirki.delete(predmetId)
    PODZBIRKE.forEach(({ spremnik }) => {
      const preostali = { ...spremnik.value }
      delete preostali[predmetId]
      spremnik.value = preostali
    })
  }

  function uskladiPodzbirke(idevi) {
    idevi.filter((predmetId) => !odjavePodzbirki.has(predmetId)).forEach(pratiPodzbirke)
    ;[...odjavePodzbirki.keys()]
      .filter((predmetId) => !idevi.includes(predmetId))
      .forEach(prestaniPratiti)
  }

  function pretplati() {
    ucitavanjePredmeta.value = true
    odjavaPredmeta = onSnapshot(zbirkaPredmeta(), (snimka) => {
      predmeti.value = snimka.docs
        .map((dokument) => ({ predmetId: dokument.id, ...dokument.data() }))
        .sort((prvi, drugi) => prvi.naziv.localeCompare(drugi.naziv))
      uskladiPodzbirke(predmeti.value.map((predmet) => predmet.predmetId))
      ucitavanjePredmeta.value = false
    })
  }

  function odjaviSve() {
    if (odjavaPredmeta) odjavaPredmeta()
    odjavaPredmeta = null
    odjavePodzbirki.forEach((odjave) => odjave.forEach((odjava) => odjava()))
    odjavePodzbirki.clear()
    predmeti.value = []
    PODZBIRKE.forEach(({ spremnik }) => (spremnik.value = {}))
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
    await Promise.all(priloziPredmeta(predmetId).map((prilog) => obrisiDatoteku(prilog.putanja)))
    await Promise.all(
      PODZBIRKE.flatMap(({ naziv, kljuc, spremnik }) =>
        (spremnik.value[predmetId] ?? []).map((stavka) =>
          deleteDoc(doc(podzbirka(predmetId, naziv), stavka[kljuc])),
        ),
      ),
    )
    await deleteDoc(zapisPredmeta(predmetId))
  }

  function dodajZadatak({ predmetId, ...zadatak }) {
    return addDoc(podzbirka(predmetId, 'zadaci'), {
      status: STATUSI.NA_CEKANJU,
      opis: '',
      ...zadatak,
    })
  }

  function urediZadatak(zadatakId, promjene) {
    const zadatak = zadatakPoId(zadatakId)
    if (!zadatak) return
    return updateDoc(doc(podzbirka(zadatak.predmetId, 'zadaci'), zadatakId), promjene)
  }

  function obrisiZadatak(zadatakId) {
    const zadatak = zadatakPoId(zadatakId)
    if (!zadatak) return
    return deleteDoc(doc(podzbirka(zadatak.predmetId, 'zadaci'), zadatakId))
  }

  function prebaciStatus(zadatakId) {
    const zadatak = zadatakPoId(zadatakId)
    if (!zadatak) return
    const status = zadatak.status === STATUSI.ZAVRSENO ? STATUSI.NA_CEKANJU : STATUSI.ZAVRSENO
    return urediZadatak(zadatakId, { status })
  }

  function dodajBiljesku({ predmetId, ...biljeska }) {
    return addDoc(podzbirka(predmetId, 'biljeske'), { datum: danas(), ...biljeska })
  }

  function urediBiljesku(biljeskaId, promjene) {
    const biljeska = biljeskaPoId(biljeskaId)
    if (!biljeska) return
    return updateDoc(doc(podzbirka(biljeska.predmetId, 'biljeske'), biljeskaId), promjene)
  }

  function obrisiBiljesku(biljeskaId) {
    const biljeska = biljeskaPoId(biljeskaId)
    if (!biljeska) return
    return deleteDoc(doc(podzbirka(biljeska.predmetId, 'biljeske'), biljeskaId))
  }

  const obrisiDatoteku = (putanja) =>
    putanja ? deleteObject(mjestoDatoteke(spremiste, putanja)) : Promise.resolve()

  async function dodajPrilog({ predmetId, datoteka }) {
    slanjePriloga.value = true
    try {
      const putanja = `korisnici/${auth.korisnik.korisnikId}/predmeti/${predmetId}/${Date.now()}-${datoteka.name}`
      const mjesto = mjestoDatoteke(spremiste, putanja)
      await uploadBytes(mjesto, datoteka, {
        contentDisposition: `attachment; filename="${datoteka.name}"`,
      })
      await addDoc(podzbirka(predmetId, 'prilozi'), {
        naziv: datoteka.name,
        tip: tipDatoteke(datoteka),
        velicinaKb: Math.round(datoteka.size / 1024),
        url: await getDownloadURL(mjesto),
        putanja,
        datum: danas(),
      })
    } finally {
      slanjePriloga.value = false
    }
  }

  async function obrisiPrilog(prilogId) {
    const prilog = prilogPoId(prilogId)
    if (!prilog) return
    await obrisiDatoteku(prilog.putanja)
    await deleteDoc(doc(podzbirka(prilog.predmetId, 'prilozi'), prilogId))
  }

  return {
    predmeti,
    zadaci,
    ucitavanje,
    slanjePriloga,
    biljeske,
    prilozi,
    predmetPoId,
    zadaciPredmeta,
    biljeskePredmeta,
    kategorijePredmeta,
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
