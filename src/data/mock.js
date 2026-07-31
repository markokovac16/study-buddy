export const PRIORITETI = { NIZAK: 'NIZAK', SREDNJI: 'SREDNJI', VISOK: 'VISOK' }

export const STATUSI = { NA_CEKANJU: 'NA_CEKANJU', U_TIJEKU: 'U_TIJEKU', ZAVRSENO: 'ZAVRSENO' }

export const korisnik = {
  korisnikId: 'u1',
  email: 'marko.kovac@unipu.hr',
  ime: 'Marko Kovač',
  aktivan: true,
  uloga: 'student',
  googleId: 'google-1',
  profilnaSlika: '',
  datumRegistracije: '2025-10-02',
  sveuciliste: 'Sveučilište Jurja Dobrile u Puli',
  godina: 3,
  opis: 'Student preddiplomskog studija',
  dnevniCiljSati: 6,
  preferencije: { jezik: 'hr', tema: 'svijetla' },
  obavijesti: { podsjetnici: true, pauze: true, ciljevi: false },
}

export const predmeti = [
  {
    predmetId: 'p1',
    naziv: 'Filozofija',
    opis: 'Epistemologija i logika',
    boja: 'amber',
    ikona: 'knjiga',
  },
  {
    predmetId: 'p2',
    naziv: 'Strukture podataka',
    opis: 'Računalne znanosti 202',
    boja: 'teal',
    ikona: 'ploca',
  },
  { predmetId: 'p3', naziv: 'Matematika', opis: 'Napredna analiza', boja: 'indigo', ikona: 'graf' },
  {
    predmetId: 'p4',
    naziv: 'Kvantna fizika',
    opis: 'Moderna fizika 301',
    boja: 'blue',
    ikona: 'iskra',
  },
]

export const zadaci = [
  {
    zadatakId: 'z1',
    predmetId: 'p2',
    naslov: 'Implementiraj rotaciju crveno-crnog stabla',
    opis: 'Lijeva i desna rotacija s testovima.',
    rokIzvrsenja: '2026-08-01',
    prioritet: PRIORITETI.VISOK,
    status: STATUSI.NA_CEKANJU,
  },
  {
    zadatakId: 'z2',
    predmetId: 'p2',
    naslov: 'Ponovi analizu složenosti heap sorta',
    opis: 'Najgori i prosječni slučaj.',
    rokIzvrsenja: '2026-08-04',
    prioritet: PRIORITETI.SREDNJI,
    status: STATUSI.U_TIJEKU,
  },
  {
    zadatakId: 'z3',
    predmetId: 'p4',
    naslov: 'Predaj lab. izvještaj: Dinamika fluida',
    opis: 'Kemijski laboratorij • Grupa B',
    rokIzvrsenja: '2026-08-01',
    prioritet: PRIORITETI.VISOK,
    status: STATUSI.NA_CEKANJU,
  },
  {
    zadatakId: 'z4',
    predmetId: 'p3',
    naslov: 'Riješi zbirku: redovi i konvergencija',
    opis: 'Poglavlja 4 do 7.',
    rokIzvrsenja: '2026-08-03',
    prioritet: PRIORITETI.SREDNJI,
    status: STATUSI.U_TIJEKU,
  },
  {
    zadatakId: 'z5',
    predmetId: 'p1',
    naslov: 'Nacrt seminarskog rada iz epistemologije',
    opis: 'Moderna Europa • Završni projekt',
    rokIzvrsenja: '2026-08-07',
    prioritet: PRIORITETI.NIZAK,
    status: STATUSI.NA_CEKANJU,
  },
  {
    zadatakId: 'z6',
    predmetId: 'p1',
    naslov: 'Pročitaj Gettierov članak',
    opis: '',
    rokIzvrsenja: '2026-07-28',
    prioritet: PRIORITETI.SREDNJI,
    status: STATUSI.ZAVRSENO,
  },
  {
    zadatakId: 'z7',
    predmetId: 'p3',
    naslov: 'Kolokvij iz derivacija',
    opis: '',
    rokIzvrsenja: '2026-07-24',
    prioritet: PRIORITETI.VISOK,
    status: STATUSI.ZAVRSENO,
  },
  {
    zadatakId: 'z8',
    predmetId: 'p4',
    naslov: 'Vježbe: Schrödingerova jednadžba',
    opis: '',
    rokIzvrsenja: '2026-08-10',
    prioritet: PRIORITETI.NIZAK,
    status: STATUSI.NA_CEKANJU,
  },
]

export const biljeske = [
  {
    biljeskaId: 'b1',
    predmetId: 'p2',
    kategorija: 'Koncepti',
    naslov: 'Kolizije hash tablice',
    sadrzaj:
      'Ulančavanje nasuprot otvorenog adresiranja. Otvoreno adresiranje uključuje linearno sondiranje, kvadratno sondiranje i dvostruko hashiranje.',
    datum: '2026-07-24',
  },
  {
    biljeskaId: 'b2',
    predmetId: 'p2',
    kategorija: 'Priprema za ispit',
    naslov: 'Prečaci za Big O',
    sadrzaj:
      'Pamćenje stogova rekurzije, ugniježđenih petlji (n^2) i podijeli pa vladaj (log n). Master teorem pokriva većinu primjera sa zadaće.',
    datum: '2026-07-27',
  },
  {
    biljeskaId: 'b3',
    predmetId: 'p1',
    kategorija: 'Koncepti',
    naslov: 'Gettierovi protuprimjeri',
    sadrzaj:
      'Opravdano istinito vjerovanje nije dovoljno za znanje. Potreban je uvjet koji isključuje sreću.',
    datum: '2026-07-21',
  },
]

export const prilozi = [
  {
    prilogId: 'pr1',
    predmetId: 'p2',
    naziv: 'Syllabus_SP_2026.pdf',
    tip: 'pdf',
    velicinaKb: 1200,
    datum: '2026-07-17',
    url: '#',
  },
  {
    prilogId: 'pr2',
    predmetId: 'p2',
    naziv: 'B-Tree_Vizualizacija.png',
    tip: 'slika',
    velicinaKb: 4800,
    datum: '2026-07-26',
    url: '#',
  },
  {
    prilogId: 'pr3',
    predmetId: 'p2',
    naziv: 'Teorija_grafova.docx',
    tip: 'dokument',
    velicinaKb: 850,
    datum: '2026-07-30',
    url: '#',
  },
  {
    prilogId: 'pr4',
    predmetId: 'p1',
    naziv: 'Gettier_1963.pdf',
    tip: 'pdf',
    velicinaKb: 320,
    datum: '2026-07-20',
    url: '#',
  },
]

export const KVOTA_KB = 5 * 1024 * 1024

const sesijeVrijeme = [
  ['2026-07-06T09:00', 'p4', 50],
  ['2026-07-07T11:00', 'p2', 25],
  ['2026-07-08T14:00', 'p3', 50],
  ['2026-07-09T09:30', 'p4', 75],
  ['2026-07-10T16:00', 'p1', 25],
  ['2026-07-11T10:00', 'p2', 50],
  ['2026-07-13T09:00', 'p4', 75],
  ['2026-07-14T13:00', 'p2', 50],
  ['2026-07-15T10:00', 'p3', 25],
  ['2026-07-16T09:00', 'p4', 50],
  ['2026-07-17T15:00', 'p1', 50],
  ['2026-07-18T11:00', 'p2', 75],
  ['2026-07-19T17:00', 'p3', 25],
  ['2026-07-20T09:00', 'p4', 100],
  ['2026-07-21T10:30', 'p1', 50],
  ['2026-07-22T14:00', 'p2', 50],
  ['2026-07-23T09:00', 'p4', 75],
  ['2026-07-24T11:00', 'p3', 50],
  ['2026-07-25T16:00', 'p2', 25],
  ['2026-07-26T10:00', 'p1', 50],
  ['2026-07-27T09:00', 'p4', 100],
  ['2026-07-28T10:00', 'p2', 75],
  ['2026-07-29T09:30', 'p3', 50],
  ['2026-07-29T14:00', 'p4', 50],
  ['2026-07-30T09:00', 'p2', 75],
  ['2026-07-30T15:00', 'p1', 25],
  ['2026-07-31T09:00', 'p4', 100],
  ['2026-07-31T13:00', 'p2', 50],
]

export const pomodoroSesije = sesijeVrijeme.map(([pocetak, predmetId, trajanje], i) => ({
  sesijaId: `s${i + 1}`,
  predmetId,
  pocetak,
  zavrsetak: new Date(new Date(pocetak).getTime() + trajanje * 60000).toISOString(),
  trajanje,
}))

export const aktivnosti = [
  {
    id: 'a1',
    ikona: 'knjiga',
    naslov: 'Kvantna fizika',
    opis: 'Ponovljeno 12 kartica',
    vrijeme: 'prije 45 min',
  },
  {
    id: 'a2',
    ikona: 'dokument',
    naslov: 'Strukture podataka',
    opis: 'Anotiran PDF "B-Tree vizualizacija"',
    vrijeme: 'prije 2 h',
  },
  {
    id: 'a3',
    ikona: 'pomoc',
    naslov: 'Filozofija',
    opis: 'Vježbeni kviz: Sustavi pamćenja',
    vrijeme: 'jučer',
  },
]

export const korisniciPlatforme = [
  {
    korisnikId: 'k1',
    ime: 'Elena Vance',
    email: 'elena.v@university.edu',
    uloga: 'student',
    datumRegistracije: '2025-10-12',
    aktivan: true,
  },
  {
    korisnikId: 'k2',
    ime: 'Julian Thorne',
    email: 'jthorne.admin@studybuddy.com',
    uloga: 'admin',
    datumRegistracije: '2025-01-05',
    aktivan: true,
  },
  {
    korisnikId: 'k3',
    ime: 'Maya Sterling',
    email: 'maya.s@edu.org',
    uloga: 'student',
    datumRegistracije: '2026-03-22',
    aktivan: false,
  },
  {
    korisnikId: 'k4',
    ime: 'Owen Kael',
    email: 'kael.o@study.com',
    uloga: 'student',
    datumRegistracije: '2026-02-15',
    aktivan: true,
  },
  {
    korisnikId: 'k5',
    ime: 'Ana Horvat',
    email: 'ana.horvat@unipu.hr',
    uloga: 'student',
    datumRegistracije: '2026-04-02',
    aktivan: true,
  },
  {
    korisnikId: 'k6',
    ime: 'Luka Novak',
    email: 'luka.novak@unipu.hr',
    uloga: 'student',
    datumRegistracije: '2026-05-19',
    aktivan: true,
  },
  {
    korisnikId: 'k7',
    ime: 'Petra Babić',
    email: 'petra.babic@edu.org',
    uloga: 'student',
    datumRegistracije: '2026-06-01',
    aktivan: false,
  },
  {
    korisnikId: 'k8',
    ime: 'Ivan Marić',
    email: 'ivan.maric@university.edu',
    uloga: 'student',
    datumRegistracije: '2026-06-11',
    aktivan: true,
  },
  {
    korisnikId: 'k9',
    ime: 'Sara Vuković',
    email: 'sara.v@study.com',
    uloga: 'admin',
    datumRegistracije: '2025-11-30',
    aktivan: true,
  },
  {
    korisnikId: 'k10',
    ime: 'Filip Jurić',
    email: 'filip.juric@unipu.hr',
    uloga: 'student',
    datumRegistracije: '2026-07-04',
    aktivan: true,
  },
  {
    korisnikId: 'k11',
    ime: 'Nina Perić',
    email: 'nina.peric@edu.org',
    uloga: 'student',
    datumRegistracije: '2026-07-15',
    aktivan: true,
  },
  {
    korisnikId: 'k12',
    ime: 'Domagoj Klarić',
    email: 'd.klaric@university.edu',
    uloga: 'student',
    datumRegistracije: '2026-07-28',
    aktivan: true,
  },
]

export const sadrzajNaslovnice = [
  {
    sadrzajId: 'sn1',
    tip: 'Istaknuto',
    naslov: 'Toplinska karta kognitivnog opterećenja',
    opis: 'Vizualizacija vršnih sati učenja među 50 tis. korisnika.',
    vidljiv: true,
  },
  {
    sadrzajId: 'sn2',
    tip: 'Kategorija',
    naslov: 'Neuro-arhitektura',
    opis: 'Najtrendovskiji predmet s 4,2 tis. aktivnih sudionika.',
    vidljiv: true,
  },
  {
    sadrzajId: 'sn3',
    tip: 'Ljestvica',
    naslov: 'Globalna ljestvica nizova učenja',
    opis: 'Dodaj istaknuti element.',
    vidljiv: false,
  },
]

export const metrikePlatforme = {
  aktivniDanas: 18492,
  rastAktivnih: 12,
  noveRegistracije: 1264,
  rastRegistracija: 5,
  tjedniRast: [42, 55, 48, 71, 63, 68, 92],
  stanjeSustava: [
    { naziv: 'Latencija', vrijednost: '12 ms', status: 'ok' },
    { naziv: 'Sinkronizacija', vrijednost: '99,9% dostupno', status: 'ok' },
    { naziv: 'Indeks pretraživanja', vrijednost: 'u tijeku', status: 'upozorenje' },
  ],
  nedavnaAktivnost: [
    {
      id: 'na1',
      ikona: 'korisnici',
      naslov: 'Registracija novog korisnika',
      opis: 'd.klaric@university.edu se pridružio.',
      vrijeme: 'prije 20 min',
    },
    {
      id: 'na2',
      ikona: 'stit',
      naslov: 'Sigurnosna pravila ažurirana',
      opis: 'Rotacija lozinki za cijeli sustav.',
      vrijeme: 'prije 1 h',
    },
    {
      id: 'na3',
      ikona: 'upload',
      naslov: 'Objava istaknutog sadržaja',
      opis: '"Neuro-arhitektura" objavljena na naslovnicu.',
      vrijeme: 'prije 2 h',
    },
  ],
}
