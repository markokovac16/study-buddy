import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { pomodoroSesije } from '../data/mock'

const MINUTA_RADA = 25
const MINUTA_PAUZE = 5
const SESIJA_U_CIKLUSU = 4

let interval = null
let brojac = 100

export const usePomodoroStore = defineStore('pomodoro', () => {
  const sesije = ref([...pomodoroSesije])
  const faza = ref('rad')
  const sekunde = ref(MINUTA_RADA * 60)
  const radi = ref(false)
  const sesija = ref(1)
  const predmetId = ref(null)

  const minute = computed(() => String(Math.floor(sekunde.value / 60)).padStart(2, '0'))
  const preostaleSekunde = computed(() => String(sekunde.value % 60).padStart(2, '0'))
  const prikaz = computed(() => `${minute.value}:${preostaleSekunde.value}`)
  const trajanjeFaze = computed(() => (faza.value === 'rad' ? MINUTA_RADA : MINUTA_PAUZE) * 60)
  const napredak = computed(() => ((trajanjeFaze.value - sekunde.value) / trajanjeFaze.value) * 100)
  const opisSesije = computed(() => `Sesija ${sesija.value} od ${SESIJA_U_CIKLUSU}`)

  function spremiSesiju() {
    const zavrsetak = new Date()
    const pocetak = new Date(zavrsetak.getTime() - MINUTA_RADA * 60000)
    sesije.value.push({
      sesijaId: `s${++brojac}`,
      predmetId: predmetId.value,
      pocetak: pocetak.toISOString(),
      zavrsetak: zavrsetak.toISOString(),
      trajanje: MINUTA_RADA,
    })
  }

  function sljedecaFaza() {
    if (faza.value === 'rad') {
      spremiSesiju()
      faza.value = 'pauza'
      sesija.value = (sesija.value % SESIJA_U_CIKLUSU) + 1
    } else {
      faza.value = 'rad'
    }
    sekunde.value = trajanjeFaze.value
  }

  function zaustavi() {
    radi.value = false
    clearInterval(interval)
    interval = null
  }

  function pokreni() {
    if (radi.value) return
    radi.value = true
    interval = setInterval(() => {
      if (sekunde.value > 0) sekunde.value--
      else {
        zaustavi()
        sljedecaFaza()
      }
    }, 1000)
  }

  function resetiraj() {
    zaustavi()
    faza.value = 'rad'
    sekunde.value = MINUTA_RADA * 60
  }

  function postaviPredmet(id) {
    predmetId.value = id
  }

  return {
    sesije,
    faza,
    sekunde,
    radi,
    sesija,
    predmetId,
    prikaz,
    napredak,
    opisSesije,
    pokreni,
    zaustavi,
    resetiraj,
    postaviPredmet,
  }
})
