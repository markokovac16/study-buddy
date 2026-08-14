import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

export function useProfileForm(pocetno, pretvori = (podaci) => podaci) {
  const auth = useAuthStore()

  const obrazac = ref(pocetno())
  const spremljeno = ref(false)

  const zaSpremanje = () => pretvori(obrazac.value)
  const promijenjeno = computed(
    () => JSON.stringify(zaSpremanje()) !== JSON.stringify(pretvori(pocetno())),
  )

  function spremi() {
    auth.azuriraj(zaSpremanje())
    spremljeno.value = true
    setTimeout(() => (spremljeno.value = false), 2500)
  }

  function odbaci() {
    obrazac.value = pocetno()
  }

  return { obrazac, promijenjeno, spremljeno, spremi, odbaci }
}
