# StudyBuddy

Web aplikacija za organizaciju učenja. Projekt iz kolegija Programsko inženjerstvo.

Student tijekom semestra prati više kolegija odjednom, a rokovi, bilješke i materijali obično završe razbacani po bilježnicama, mailovima i chatovima. StudyBuddy ih drži na jednom mjestu i uz to mjeri koliko je vremena stvarno potrošeno na učenje, umjesto da se student oslanja na dojam.

## Što aplikacija radi

- **Predmeti** - svaki kolegij ima boju, ikonu, profesora i ECTS bodove, a kartica predmeta prikazuje napredak u postocima izračunat iz omjera dovršenih zadataka.
- **Zadaci** - naslov, opis, rok, prioritet i status. Nadzorna ploča izdvaja nadolazeće zadatke po roku, a zadaci se označavaju dovršenima izravno s liste.
- **Bilješke i prilozi** - bilješke vezane uz predmet i materijali koji se šalju na Firebase Storage, s prikazom tipa, veličine i zauzeća kvote.
- **Pomodoro timer** - ciklus od četiri sesije, 25 minuta rada i 5 minuta pauze. Timer se pokreće za odabrani predmet i vidljiv je u sidebaru kroz cijelu aplikaciju, a svaka dovršena sesija se sprema.
- **Statistika** - grafovi se računaju iz spremljenih Pomodoro sesija: sati po danima tjedna, raspodjela po predmetima i kretanje po tjednima, uz filtere predmeta i razdoblja.
- **Profil** - osobni podaci, dnevni cilj sati koji određuje postotak na nadzornoj ploči, jezik i tema sučelja, prekidači obavijesti te deaktivacija računa.
- **Novosti** - objave administratora s glasanjem gore ili dolje, jedan glas po korisniku. Poredak je po zbroju glasova pa po datumu, a tri vidljive objave stoje i na naslovnici.
- **Administracija** - brojevi platforme računati iz baze (prijave danas, registracije po danima, stanje računa), uređivanje Novosti i tablica korisnika s pretragom, filterima, paginacijom, promjenom uloge i skupnim akcijama.

## Tehnologije

- Vue 3 (Composition API, `<script setup>`)
- Vue Router - ugniježđene rute i tri layouta (javni, korisnički, admin)
- Pinia - storeovi za autentikaciju, predmete, Pomodoro, statistiku, Novosti i administraciju
- Tailwind CSS 4 - dizajn tokeni u `@theme` bloku u `src/style.css`
- Chart.js - grafovi statistike učenja
- Firebase 12 (modularni SDK) - Authentication, Firestore i Storage
- Vite

## Pokretanje

```sh
npm install
cp .env.example .env
npm run dev
```

Produkcijski build:

```sh
npm run build
```

## Firebase

Aplikacija traži vlastiti Firebase projekt. U [konzoli](https://console.firebase.google.com):

1. Napravi projekt i dodaj web aplikaciju.
2. U **Authentication** uključi načine prijave **Email/Password** i **Google**.
3. U **Firestore Database** napravi bazu.
4. Uključi **Storage** za priloge uz bilješke. Storage traži Blaze plan, ali sve ostaje unutar besplatne kvote.
5. Konfiguraciju web aplikacije prepiši u `.env` prema `.env.example`.
6. Objavi pravila iz `firestore.rules` - `firebase deploy --only firestore:rules` ili copy-paste u konzolu pod **Firestore Database → Rules**.

`.env` je u `.gitignore` i ne ide u repozitorij.

### Struktura baze

```
korisnici/{korisnikId}                    profil, uloga, preferencije, Pomodoro postavke
  predmeti/{predmetId}
    zadaci/{zadatakId}
    biljeske/{biljeskaId}
    prilozi/{prilogId}                    URL i putanja datoteke na Storageu
  pomodoroSesije/{sesijaId}
sadrzajNaslovnice/{sadrzajId}             objave u Novostima, glasovi kao mapa {uid: 1 | -1}
```

Pravila drže da korisnik čita i piše samo pod svojim `korisnici/{uid}`, da administrator vidi sve, da Novosti svatko može čitati i da prijavljeni korisnik u tuđoj objavi smije dirati samo vlastiti glas.

## Prijava tijekom razvoja

Registracija otvara pravi Firebase račun i uz njega dokument u kolekciji `korisnici`. Adresa koja sadrži `admin` dobiva ulogu administratora, sve ostale ulogu studenta. Svi podaci aplikacije žive u Firestoreu; mock ostaje samo za izlog na naslovnici, koji gost vidi bez prijave.

## Struktura

```
firestore.rules   sigurnosna pravila baze
src/
  assets/       slike i ikone
  components/   komponente (ui/ = bazne, charts/ = grafovi, modals/ = obrasci)
  composables/  obrazac prijave i potvrdni modal
  data/         enumi prioriteta i statusa te podaci za izlog na naslovnici
  firebase.js   inicijalizacija Firebasea iz .env varijabli
  layouts/      PublicLayout, AppLayout, AdminLayout
  pages/        stranice po rutama
  router/       rute i guardovi
  stores/       Pinia storeovi
  utils/        formatiranje datuma, veličina i boja
```

## Uloge

- **Neregistrirani korisnik** - naslovnica, registracija i prijava
- **Registrirani korisnik** - predmeti, zadaci, bilješke, prilozi, Pomodoro timer, statistika, Novosti s glasanjem, profil
- **Administrator** - pregled platforme, objave u Novostima, upravljanje korisnicima

Deaktivacija računa nije brisanje: dokument ostaje, `aktivan` pada na `false` i prijava se prekida s `auth/user-disabled`. Brisanje iz administracije briše samo dokument, dok Auth račun ostaje - njega uklanja Admin SDK, što je izvan opsega projekta.
