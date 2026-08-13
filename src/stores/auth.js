import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { auth, db, googleProvider } from '../firebase'

const PREDLOZAK = {
  aktivan: true,
  uloga: 'student',
  profilnaSlika: '',
  sveuciliste: '',
  godina: 1,
  opis: 'Student',
  dnevniCiljSati: 6,
  preferencije: { jezik: 'hr', tema: 'svijetla' },
  obavijesti: { podsjetnici: true, pauze: true, ciljevi: false },
}

const imeIzEmaila = (email) =>
  email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((rijec) => rijec[0].toUpperCase() + rijec.slice(1))
    .join(' ')

function greska(kod) {
  return Object.assign(new Error(kod), { code: kod })
}

export const useAuthStore = defineStore('auth', () => {
  const korisnik = ref(null)
  let razrijesi
  const inicijalizacija = new Promise((resolve) => (razrijesi = resolve))

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

  const zapis = (korisnikId) => db.collection('korisnici').doc(korisnikId)

  function noviProfil(racun) {
    return {
      ...PREDLOZAK,
      email: racun.email,
      ime: racun.displayName || imeIzEmaila(racun.email),
      profilnaSlika: racun.photoURL || '',
      uloga: racun.email.includes('admin') ? 'admin' : 'student',
      datumRegistracije: new Date().toISOString().slice(0, 10),
    }
  }

  async function ucitaj(racun) {
    const dokument = zapis(racun.uid)
    let snimka = await dokument.get()
    if (!snimka.exists) {
      await dokument.set(noviProfil(racun))
      snimka = await dokument.get()
    }
    korisnik.value = { korisnikId: racun.uid, ...snimka.data() }
    if (!korisnik.value.aktivan) {
      await odjava()
      throw greska('auth/user-disabled')
    }
  }

  async function prijava(email, lozinka) {
    const { user } = await auth.signInWithEmailAndPassword(email, lozinka)
    await ucitaj(user)
  }

  async function registracija(email, lozinka) {
    const { user } = await auth.createUserWithEmailAndPassword(email, lozinka)
    await ucitaj(user)
  }

  async function prijavaGoogle() {
    const { user } = await auth.signInWithPopup(googleProvider)
    await ucitaj(user)
  }

  async function odjava() {
    korisnik.value = null
    await auth.signOut()
  }

  async function azuriraj(promjene) {
    const korisnikId = korisnik.value.korisnikId
    korisnik.value = { ...korisnik.value, ...promjene }
    await zapis(korisnikId).update(promjene)
  }

  async function deaktiviraj() {
    await azuriraj({ aktivan: false })
    await odjava()
  }

  auth.onAuthStateChanged(async (racun) => {
    if (racun && korisnik.value?.korisnikId !== racun.uid) {
      await ucitaj(racun).catch(() => {})
    } else if (!racun) {
      korisnik.value = null
    }
    razrijesi()
  })

  return {
    korisnik,
    inicijalizacija,
    prijavljen,
    jeAdmin,
    inicijali,
    prijava,
    registracija,
    prijavaGoogle,
    odjava,
    azuriraj,
    deaktiviraj,
  }
})
