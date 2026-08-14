import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthStore } from './auth'

const zbroj = (glasovi) => Object.values(glasovi ?? {}).reduce((suma, glas) => suma + glas, 0)

export const useNewsStore = defineStore('news', () => {
  const auth = useAuthStore()

  const objave = ref([])
  const ucitavanje = ref(true)

  const zbirka = collection(db, 'sadrzajNaslovnice')
  const zapis = (sadrzajId) => doc(zbirka, sadrzajId)

  onSnapshot(zbirka, (snimka) => {
    objave.value = snimka.docs
      .map((dokument) => ({ sadrzajId: dokument.id, ...dokument.data() }))
      .sort(
        (prva, druga) =>
          zbroj(druga.glasovi) - zbroj(prva.glasovi) || druga.datum.localeCompare(prva.datum),
      )
    ucitavanje.value = false
  })

  const vidljive = computed(() => objave.value.filter((objava) => objava.vidljiv))

  const objavaPoId = (sadrzajId) =>
    objave.value.find((objava) => objava.sadrzajId === sadrzajId) ?? null

  const rezultat = (objava) => zbroj(objava.glasovi)
  const mojGlas = (objava) => objava.glasovi?.[auth.korisnik?.korisnikId] ?? 0

  function dodaj(podaci) {
    return addDoc(zbirka, {
      vidljiv: true,
      poveznica: '',
      ...podaci,
      datum: new Date().toISOString(),
      autorId: auth.korisnik.korisnikId,
      glasovi: {},
    })
  }

  function uredi(sadrzajId, promjene) {
    return updateDoc(zapis(sadrzajId), promjene)
  }

  function obrisi(sadrzajId) {
    return deleteDoc(zapis(sadrzajId))
  }

  function prebaciVidljivost(objava) {
    return uredi(objava.sadrzajId, { vidljiv: !objava.vidljiv })
  }

  function glasaj(sadrzajId, vrijednost) {
    const korisnikId = auth.korisnik?.korisnikId
    const objava = objavaPoId(sadrzajId)
    if (!korisnikId || !objava) return
    const isti = mojGlas(objava) === vrijednost
    return updateDoc(zapis(sadrzajId), {
      [`glasovi.${korisnikId}`]: isti ? deleteField() : vrijednost,
    })
  }

  return {
    objave,
    ucitavanje,
    vidljive,
    objavaPoId,
    rezultat,
    mojGlas,
    dodaj,
    uredi,
    obrisi,
    prebaciVidljivost,
    glasaj,
  }
})
