# StudyBuddy

Web aplikacija za organizaciju učenja. Projekt iz kolegija Programsko inženjerstvo.

Student tijekom semestra prati više kolegija odjednom, a rokovi, bilješke i materijali obično završe razbacani po bilježnicama, mailovima i chatovima. StudyBuddy ih drži na jednom mjestu i uz to mjeri koliko je vremena stvarno potrošeno na učenje, umjesto da se student oslanja na dojam.

## Što aplikacija radi

- **Predmeti** - svaki kolegij ima boju, ikonu, profesora i ECTS bodove, a kartica predmeta prikazuje napredak u postocima izračunat iz omjera dovršenih zadataka.
- **Zadaci** - naslov, opis, rok, prioritet i status. Nadzorna ploča izdvaja nadolazeće zadatke po roku, a zadaci se označavaju dovršenima izravno s liste.
- **Bilješke i prilozi** - bilješke vezane uz predmet i popis materijala s tipom i veličinom datoteke.
- **Pomodoro timer** - ciklus od četiri sesije, 25 minuta rada i 5 minuta pauze. Timer se pokreće za odabrani predmet i vidljiv je u sidebaru kroz cijelu aplikaciju, a svaka dovršena sesija se sprema.
- **Statistika** - grafovi se računaju iz spremljenih Pomodoro sesija: sati po danima tjedna, raspodjela po predmetima i kretanje po tjednima, uz filtere predmeta i razdoblja.
- **Profil** - osobni podaci, dnevni cilj sati koji određuje postotak na nadzornoj ploči, jezik i tema sučelja, prekidači obavijesti te deaktivacija računa.
- **Administracija** - metrike platforme, uređivanje sadržaja koji se prikazuje na naslovnici i tablica korisnika s pretragom, filterima, paginacijom i skupnim akcijama.

## Tehnologije

- Vue 3 (Composition API, `<script setup>`)
- Vue Router - ugniježđene rute i tri layouta (javni, korisnički, admin)
- Pinia - storeovi za autentikaciju, predmete, Pomodoro, statistiku i administraciju
- Tailwind CSS 4 - dizajn tokeni u `@theme` bloku u `src/style.css`
- Chart.js - grafovi statistike učenja
- Vite

## Pokretanje

```sh
npm install
npm run dev
```

Produkcijski build:

```sh
npm run build
```

## Prijava tijekom razvoja

Podaci su još uvijek mock (Firebase nije spojen). Prijava prolazi s bilo kojom ispravnom e-mail adresom i lozinkom od barem 6 znakova. Adresa koja sadrži `admin` otvara administratorsko sučelje.

## Struktura

```
src/
  assets/       slike i ikone
  components/   komponente (ui/ = bazne, charts/ = grafovi, modals/ = obrasci)
  data/         mock podaci prema class dijagramu
  layouts/      PublicLayout, AppLayout, AdminLayout
  pages/        stranice po rutama
  router/       rute i guardovi
  stores/       Pinia storeovi
  utils/        formatiranje datuma, veličina i boja
```

## Uloge

- **Neregistrirani korisnik** - naslovnica, registracija i prijava
- **Registrirani korisnik** - predmeti, zadaci, bilješke, prilozi, Pomodoro timer, statistika, profil
- **Administrator** - pregled platforme, sadržaj naslovnice, upravljanje korisnicima
