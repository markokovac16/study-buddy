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
  { predmetId: 'p1', naziv: 'Filozofija', opis: 'Epistemologija i logika', boja: 'amber', ikona: 'knjiga' },
  { predmetId: 'p2', naziv: 'Strukture podataka', opis: 'Računalne znanosti 202', boja: 'teal', ikona: 'ploca' },
  { predmetId: 'p3', naziv: 'Matematika', opis: 'Napredna analiza', boja: 'indigo', ikona: 'graf' },
  { predmetId: 'p4', naziv: 'Kvantna fizika', opis: 'Moderna fizika 301', boja: 'blue', ikona: 'iskra' },
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
    sadrzaj: 'Opravdano istinito vjerovanje nije dovoljno za znanje. Potreban je uvjet koji isključuje sreću.',
    datum: '2026-07-21',
  },
]

export const prilozi = [
  { prilogId: 'pr1', predmetId: 'p2', naziv: 'Syllabus_SP_2026.pdf', tip: 'pdf', velicinaKb: 1200, datum: '2026-07-17', url: '#' },
  { prilogId: 'pr2', predmetId: 'p2', naziv: 'B-Tree_Vizualizacija.png', tip: 'slika', velicinaKb: 4800, datum: '2026-07-26', url: '#' },
  { prilogId: 'pr3', predmetId: 'p2', naziv: 'Teorija_grafova.docx', tip: 'dokument', velicinaKb: 850, datum: '2026-07-30', url: '#' },
  { prilogId: 'pr4', predmetId: 'p1', naziv: 'Gettier_1963.pdf', tip: 'pdf', velicinaKb: 320, datum: '2026-07-20', url: '#' },
]

export const KVOTA_KB = 5 * 1024 * 1024
