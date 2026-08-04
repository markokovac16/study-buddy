import { PRIORITETI, STATUSI } from '../data/mock'

export const bojePredmeta = {
  amber: {
    pozadina: 'bg-amber-100',
    tekst: 'text-amber-600',
    traka: 'bg-amber-500',
    hex: '#f59e0b',
  },
  teal: { pozadina: 'bg-teal-100', tekst: 'text-teal-600', traka: 'bg-teal-500', hex: '#14b8a6' },
  indigo: {
    pozadina: 'bg-indigo-100',
    tekst: 'text-sb-blue',
    traka: 'bg-sb-indigo',
    hex: '#24389c',
  },
  blue: { pozadina: 'bg-sky-100', tekst: 'text-sky-700', traka: 'bg-sky-500', hex: '#0284c7' },
  rose: { pozadina: 'bg-rose-100', tekst: 'text-rose-600', traka: 'bg-rose-500', hex: '#f43f5e' },
}

export const bojaPredmeta = (boja) => bojePredmeta[boja] ?? bojePredmeta.indigo

export const prioritetNaziv = {
  [PRIORITETI.VISOK]: 'Visok prioritet',
  [PRIORITETI.SREDNJI]: 'Srednji prioritet',
  [PRIORITETI.NIZAK]: 'Nizak prioritet',
}

export const prioritetBoja = {
  [PRIORITETI.VISOK]: 'red',
  [PRIORITETI.SREDNJI]: 'indigo',
  [PRIORITETI.NIZAK]: 'teal',
}

export const statusNaziv = {
  [STATUSI.NA_CEKANJU]: 'Na čekanju',
  [STATUSI.U_TIJEKU]: 'U tijeku',
  [STATUSI.ZAVRSENO]: 'Završeno',
}

export function formatDatum(iso) {
  return new Date(iso).toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function danaDo(iso) {
  const rok = new Date(iso)
  rok.setHours(0, 0, 0, 0)
  const danas = new Date()
  danas.setHours(0, 0, 0, 0)
  return Math.round((rok - danas) / 86400000)
}

export function relativniRok(iso) {
  const dana = danaDo(iso)
  if (dana < 0) return `Rok prošao prije ${Math.abs(dana)} d`
  if (dana === 0) return 'Rok danas'
  if (dana === 1) return 'Rok sutra'
  if (dana < 7) return `Rok za ${dana} dana`
  if (dana < 14) return 'Rok za 1 tjedan'
  return `Rok ${formatDatum(iso)}`
}

export function formatVelicina(kb) {
  if (kb < 1024) return `${Math.round(kb)} KB`
  if (kb < 1024 * 1024) return `${(kb / 1024).toFixed(1).replace('.', ',')} MB`
  return `${Math.round(kb / 1024 / 1024)} GB`
}

export function satiIMinute(minuta) {
  const sati = Math.floor(minuta / 60)
  const ostatak = minuta % 60
  if (!sati) return `${ostatak} min`
  return ostatak ? `${sati} h ${ostatak} min` : `${sati} h`
}
