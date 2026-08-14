import { reactive, ref } from 'vue'

export function useEditing(dodaj, uredi, kljuc) {
  const otvoren = ref(false)
  const stavka = ref(null)

  function otvoriNovu() {
    stavka.value = null
    otvoren.value = true
  }

  function otvoriUredi(postojeca) {
    stavka.value = postojeca
    otvoren.value = true
  }

  function spremi(podaci) {
    if (stavka.value) uredi(stavka.value[kljuc], podaci)
    else dodaj(podaci)
  }

  return reactive({ otvoren, stavka, otvoriNovu, otvoriUredi, spremi })
}
