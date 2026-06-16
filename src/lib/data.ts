// ─── S2 SPORT · Liga S2 Apertura 2026 ──────────────────────────────
// Datos mock realistas. Una sola fuente de verdad para toda la app.

export type TeamId =
  | 'halcones' | 'tiburones' | 'real-cancun' | 'maya'
  | 'atletico' | 'guerreros' | 'pumas' | 'inter'

export interface Team {
  id: TeamId
  name: string
  short: string        // 3 letras
  color: string        // color de marca del equipo
  pj: number; g: number; e: number; p: number
  gf: number; gc: number; pts: number
  form: ('G' | 'E' | 'P')[]   // últimos 5, más reciente al final
}

export interface Match {
  id: string
  jornada: number
  home: TeamId
  away: TeamId
  homeGoals: number | null
  awayGoals: number | null
  date: string         // ISO corto
  label: string        // "Hoy · 18:00" o "Sáb 20 Jun · 17:00"
  venue: string
  status: 'today' | 'upcoming' | 'played'
}

export interface Scorer {
  player: string
  team: TeamId
  goals: number
}

export const LEAGUE = {
  name: 'Liga S2',
  season: 'Apertura 2026',
  brand: 'S2 SPORT',
}

export const TEAMS: Team[] = [
  { id: 'halcones',   name: 'Halcones FC',     short: 'HAL', color: '#CCFF00', pj: 7, g: 6, e: 1, p: 0, gf: 18, gc: 6,  pts: 19, form: ['G','G','E','G','G'] },
  { id: 'tiburones',  name: 'Tiburones',       short: 'TIB', color: '#c2cad1', pj: 7, g: 5, e: 1, p: 1, gf: 15, gc: 8,  pts: 16, form: ['G','P','G','G','E'] },
  { id: 'real-cancun',name: 'Real Cancún',     short: 'RCN', color: '#ffffff', pj: 7, g: 4, e: 2, p: 1, gf: 13, gc: 9,  pts: 14, form: ['G','E','G','E','G'] },
  { id: 'maya',       name: 'Deportivo Maya',  short: 'MAY', color: '#f5c542', pj: 7, g: 4, e: 1, p: 2, gf: 12, gc: 10, pts: 13, form: ['P','G','G','E','G'] },
  { id: 'atletico',   name: 'Atlético Centro', short: 'ATC', color: '#ff5a5a', pj: 7, g: 3, e: 1, p: 3, gf: 11, gc: 11, pts: 10, form: ['E','P','G','P','G'] },
  { id: 'guerreros',  name: 'Guerreros FC',    short: 'GUE', color: '#ff8a3d', pj: 7, g: 2, e: 2, p: 3, gf: 9,  gc: 12, pts: 8,  form: ['P','G','E','P','G'] },
  { id: 'pumas',      name: 'Pumas del Sur',   short: 'PUM', color: '#9aff5a', pj: 7, g: 1, e: 1, p: 5, gf: 7,  gc: 16, pts: 4,  form: ['P','P','G','P','E'] },
  { id: 'inter',      name: 'Inter Caribe',    short: 'INT', color: '#ffd166', pj: 7, g: 0, e: 1, p: 6, gf: 5,  gc: 18, pts: 1,  form: ['P','P','E','P','P'] },
]

export const teamById = (id: TeamId): Team =>
  TEAMS.find((t) => t.id === id)!

export const standings = (): Team[] =>
  [...TEAMS].sort(
    (a, b) =>
      b.pts - a.pts ||
      (b.gf - b.gc) - (a.gf - a.gc) ||
      b.gf - a.gf,
  )

export const MATCHES: Match[] = [
  // Hoy · Jornada 8
  { id: 'm-801', jornada: 8, home: 'halcones', away: 'tiburones', homeGoals: null, awayGoals: null, date: '2026-06-16', label: 'Hoy · 18:00', venue: 'Cancha Norte',  status: 'today' },
  { id: 'm-802', jornada: 8, home: 'real-cancun', away: 'atletico', homeGoals: null, awayGoals: null, date: '2026-06-16', label: 'Hoy · 20:00', venue: 'Cancha Sur',   status: 'today' },

  // Próximos · Jornada 8/9
  { id: 'm-803', jornada: 8, home: 'maya', away: 'guerreros', homeGoals: null, awayGoals: null, date: '2026-06-20', label: 'Sáb 20 Jun · 17:00', venue: 'Cancha Centro', status: 'upcoming' },
  { id: 'm-804', jornada: 8, home: 'inter', away: 'pumas', homeGoals: null, awayGoals: null, date: '2026-06-20', label: 'Sáb 20 Jun · 19:00', venue: 'Cancha Sur',    status: 'upcoming' },
  { id: 'm-805', jornada: 9, home: 'halcones', away: 'real-cancun', homeGoals: null, awayGoals: null, date: '2026-06-21', label: 'Dom 21 Jun · 11:00', venue: 'Cancha Norte', status: 'upcoming' },
  { id: 'm-806', jornada: 9, home: 'tiburones', away: 'maya', homeGoals: null, awayGoals: null, date: '2026-06-21', label: 'Dom 21 Jun · 13:00', venue: 'Cancha Centro', status: 'upcoming' },

  // Jugados · Jornada 7
  { id: 'm-701', jornada: 7, home: 'halcones', away: 'pumas', homeGoals: 3, awayGoals: 0, date: '2026-06-08', label: 'J7 · Dom 8 Jun', venue: 'Cancha Norte', status: 'played' },
  { id: 'm-702', jornada: 7, home: 'tiburones', away: 'guerreros', homeGoals: 2, awayGoals: 1, date: '2026-06-08', label: 'J7 · Dom 8 Jun', venue: 'Cancha Sur', status: 'played' },
  { id: 'm-703', jornada: 7, home: 'real-cancun', away: 'maya', homeGoals: 2, awayGoals: 2, date: '2026-06-07', label: 'J7 · Sáb 7 Jun', venue: 'Cancha Centro', status: 'played' },
  { id: 'm-704', jornada: 7, home: 'atletico', away: 'inter', homeGoals: 1, awayGoals: 0, date: '2026-06-07', label: 'J7 · Sáb 7 Jun', venue: 'Cancha Norte', status: 'played' },
  { id: 'm-602', jornada: 6, home: 'maya', away: 'pumas', homeGoals: 2, awayGoals: 1, date: '2026-06-01', label: 'J6 · Dom 1 Jun', venue: 'Cancha Sur', status: 'played' },
  { id: 'm-603', jornada: 6, home: 'guerreros', away: 'inter', homeGoals: 3, awayGoals: 1, date: '2026-06-01', label: 'J6 · Dom 1 Jun', venue: 'Cancha Centro', status: 'played' },
]

export const todayMatches = (): Match[] => MATCHES.filter((m) => m.status === 'today')
export const upcomingMatches = (): Match[] => MATCHES.filter((m) => m.status === 'upcoming')
export const playedMatches = (): Match[] =>
  MATCHES.filter((m) => m.status === 'played').sort((a, b) => b.date.localeCompare(a.date))

export const SCORERS: Scorer[] = [
  { player: 'D. Canul',    team: 'halcones',   goals: 9 },
  { player: 'A. Pat',      team: 'tiburones',  goals: 7 },
  { player: 'R. Chablé',   team: 'real-cancun',goals: 6 },
  { player: 'M. Uc',       team: 'maya',       goals: 5 },
  { player: 'J. Poot',     team: 'halcones',   goals: 5 },
  { player: 'L. Dzul',     team: 'atletico',   goals: 4 },
]

// Plantilla demo (para /capitan)
export interface Player {
  id: number
  name: string
  number: number
  position: 'POR' | 'DEF' | 'MED' | 'DEL'
  goals: number
  yellow: number
  red: number
  paid: boolean
}

export const SQUAD: Player[] = [
  { id: 1,  name: 'Diego Canul',     number: 9,  position: 'DEL', goals: 9, yellow: 1, red: 0, paid: true },
  { id: 2,  name: 'Jorge Poot',      number: 11, position: 'DEL', goals: 5, yellow: 2, red: 0, paid: true },
  { id: 3,  name: 'Saúl Tuz',        number: 8,  position: 'MED', goals: 3, yellow: 3, red: 1, paid: true },
  { id: 4,  name: 'Iván Cocom',      number: 10, position: 'MED', goals: 2, yellow: 1, red: 0, paid: false },
  { id: 5,  name: 'Pedro May',       number: 4,  position: 'DEF', goals: 1, yellow: 4, red: 0, paid: true },
  { id: 6,  name: 'Luis Balam',      number: 2,  position: 'DEF', goals: 0, yellow: 2, red: 0, paid: false },
  { id: 7,  name: 'Mario Ek',        number: 5,  position: 'DEF', goals: 0, yellow: 1, red: 0, paid: true },
  { id: 8,  name: 'Ángel Chi',       number: 1,  position: 'POR', goals: 0, yellow: 0, red: 0, paid: true },
]
