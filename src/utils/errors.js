const PORUKE = {
  'auth/invalid-email': 'Adresa e-pošte nije ispravna.',
  'auth/user-not-found': 'Pogrešna adresa e-pošte ili lozinka.',
  'auth/wrong-password': 'Pogrešna adresa e-pošte ili lozinka.',
  'auth/invalid-credential': 'Pogrešna adresa e-pošte ili lozinka.',
  'auth/user-disabled': 'Račun je deaktiviran.',
  'auth/email-already-in-use': 'Račun s tom adresom već postoji.',
  'auth/weak-password': 'Lozinka mora imati barem 6 znakova.',
  'auth/too-many-requests': 'Previše pokušaja. Pokušajte ponovno kasnije.',
  'auth/network-request-failed': 'Nema veze s poslužiteljem.',
  'auth/popup-closed-by-user': '',
  'auth/cancelled-popup-request': '',
}

export function porukaGreske(greska) {
  return PORUKE[greska?.code] ?? 'Nešto je pošlo po zlu. Pokušajte ponovno.'
}
