// Datos demo — Liga S2 Apertura 2026
// Se usan cuando no hay DATABASE_URL real. Tabla calculada de partidos reales.
import type {
  Tournament, Team, Player, Match, Standing, Payment, Card, Referee, Notification,
} from '@/types'

const TID = 'apertura-2026'

export const TOURNAMENT: Tournament = {
  id: TID,
  name: 'Liga S2 Apertura 2026',
  category: 'Primera Fuerza',
  season: '2026',
  status: 'active',
  start_date: '2026-05-17',
  end_date: '2026-07-26',
  created_at: '2026-04-01T00:00:00Z',
}

// 8 equipos — index 0 = más fuerte (define goleo y resultados)
const TEAM_DEFS: { id: string; name: string; captain: string; phone: string }[] = [
  { id: 'tm-tigres',  name: 'Tigres FC',      captain: 'Luis Ramírez',     phone: '+52 998 111 2201' },
  { id: 'tm-leones',  name: 'Leones Negros',  captain: 'Jorge Padilla',    phone: '+52 998 111 2202' },
  { id: 'tm-aguilas', name: 'Águilas Reales', captain: 'Marco Beltrán',    phone: '+52 998 111 2203' },
  { id: 'tm-halcon',  name: 'Halcones',       captain: 'Iván Cruz',        phone: '+52 998 111 2204' },
  { id: 'tm-pumas',   name: 'Pumas Dorados',  captain: 'Erick Salinas',    phone: '+52 998 111 2205' },
  { id: 'tm-lobos',   name: 'Lobos FC',       captain: 'Diego Fuentes',    phone: '+52 998 111 2206' },
  { id: 'tm-diablos', name: 'Diablos Rojos',  captain: 'Raúl Méndez',      phone: '+52 998 111 2207' },
  { id: 'tm-condor',  name: 'Cóndores',       captain: 'Saúl Rivas',       phone: '+52 998 111 2208' },
]

export const TEAMS: Team[] = TEAM_DEFS.map((t, i) => ({
  id: t.id,
  tournament_id: TID,
  name: t.name,
  captain_name: t.captain,
  contact_phone: t.phone,
  status: 'active',
  created_at: '2026-04-10T00:00:00Z',
}))

const teamName = (id: string) => TEAM_DEFS.find(t => t.id === id)?.name
const teamIdx = (id: string) => TEAM_DEFS.findIndex(t => t.id === id)

// ---------- ÁRBITROS ----------
export const REFEREES: Referee[] = [
  { id: 'ref-1', name: 'Carlos Mendoza',  phone: '+52 998 220 3301', status: 'active',   created_at: '2026-04-05T00:00:00Z' },
  { id: 'ref-2', name: 'Rubén Ortega',    phone: '+52 998 220 3302', status: 'active',   created_at: '2026-04-05T00:00:00Z' },
  { id: 'ref-3', name: 'Javier Salas',    phone: '+52 998 220 3303', status: 'active',   created_at: '2026-04-05T00:00:00Z' },
  { id: 'ref-4', name: 'Antonio Guzmán',  phone: '+52 998 220 3304', status: 'inactive', created_at: '2026-04-05T00:00:00Z' },
]
const FIELDS = ['Cancha 1 · La Bombonera', 'Cancha 2 · El Coloso', 'Cancha 3 · Norte']

// ---------- JUGADORES ----------
const FIRST = ['Miguel', 'Carlos', 'Diego', 'Roberto', 'Fernando', 'Andrés', 'Sergio', 'Pablo', 'Héctor', 'Emilio', 'Óscar', 'Daniel']
const LAST  = ['Torres', 'Jiménez', 'Hernández', 'Vega', 'Cruz', 'Morales', 'Aguilar', 'Ríos', 'Navarro', 'Campos', 'Delgado', 'Ibarra']
const POS   = ['Portero', 'Defensa Central', 'Lateral Der', 'Mediocampista', 'Extremo', 'Delantero']

export const PLAYERS: Player[] = (() => {
  const list: Player[] = []
  TEAM_DEFS.forEach((team, ti) => {
    for (let p = 0; p < 6; p++) {
      const ni = (ti * 6 + p) % FIRST.length
      const li = (ti * 5 + p * 2) % LAST.length
      const pos = POS[p]
      const strength = 8 - ti // mejores equipos, más goles
      let goals = 0
      if (pos === 'Delantero') goals = Math.max(1, strength)
      else if (pos === 'Extremo') goals = Math.max(0, strength - 3)
      else if (pos === 'Mediocampista') goals = Math.max(0, strength - 5)
      const yellow = (ti + p) % 3 === 0 ? ((ti + p) % 2) + 1 : 0
      const red = (ti === 6 && p === 1) || (ti === 3 && p === 5) ? 1 : 0
      list.push({
        id: `pl-${team.id}-${p}`,
        team_id: team.id,
        name: `${FIRST[ni]} ${LAST[li]}`,
        number: p === 0 ? 1 : p * 4 + (ti % 5) + 2,
        position: pos,
        status: red > 0 ? 'suspended' : 'active',
        yellow_cards: yellow,
        red_cards: red,
        goals,
        created_at: '2026-04-12T00:00:00Z',
      })
    }
  })
  return list
})()

// ---------- PARTIDOS (round-robin circle method) ----------
function roundRobin(ids: string[]): string[][][] {
  const n = ids.length
  const arr = [...ids]
  const rounds: string[][][] = []
  for (let r = 0; r < n - 1; r++) {
    const pairs: string[][] = []
    for (let i = 0; i < n / 2; i++) pairs.push([arr[i], arr[n - 1 - i]])
    rounds.push(pairs)
    arr.splice(1, 0, arr.pop() as string)
  }
  return rounds
}

// Resultados de las jornadas ya jugadas (round index -> [home, away] por pareja)
const RESULTS: Record<number, [number, number][]> = {
  0: [[3, 0], [2, 1], [1, 1], [0, 2]],
  1: [[2, 0], [1, 3], [1, 1], [2, 2]],
  2: [[1, 0], [0, 1], [0, 2], [3, 1]],
  3: [[2, 2], [1, 0], [1, 1], [0, 4]],
}
// Jornada 5 (round 4): partido 0 EN VIVO, resto programado
const LIVE_ROUND = 4
const LIVE_SCORE: [number, number] = [1, 0]

const ROUND_DATES = [
  '2026-05-17', '2026-05-24', '2026-05-31', '2026-06-07',
  '2026-06-15', '2026-06-21', '2026-06-28',
]
const TIMES = ['10:00', '12:00', '16:00', '18:00']

export const MATCHES: Match[] = (() => {
  const rounds = roundRobin(TEAM_DEFS.map(t => t.id))
  const out: Match[] = []
  rounds.forEach((pairs, r) => {
    pairs.forEach(([home, away], pi) => {
      const finished = RESULTS[r] !== undefined
      const isLive = r === LIVE_ROUND && pi === 0
      let status: Match['status'] = 'scheduled'
      let hs: number | undefined
      let as: number | undefined
      if (finished) { status = 'finished'; [hs, as] = RESULTS[r][pi] }
      else if (isLive) { status = 'live'; [hs, as] = LIVE_SCORE }
      out.push({
        id: `mt-${r}-${pi}`,
        matchday_id: `md-${r}`,
        tournament_id: TID,
        home_team_id: home,
        away_team_id: away,
        referee_id: REFEREES[pi % 3].id,
        field: FIELDS[pi % FIELDS.length],
        scheduled_at: `${ROUND_DATES[r]}T${TIMES[pi % TIMES.length]}:00-06:00`,
        home_score: hs,
        away_score: as,
        status,
        home_team_name: teamName(home),
        away_team_name: teamName(away),
        referee_name: REFEREES[pi % 3].name,
        matchday_number: r + 1,
        created_at: '2026-05-01T00:00:00Z',
      })
    })
  })
  return out
})()

// ---------- TABLA (calculada de partidos finalizados) ----------
export const STANDINGS: Standing[] = (() => {
  type Row = { played: number; won: number; drawn: number; lost: number; gf: number; ga: number; pts: number }
  const table = new Map<string, Row>()
  TEAM_DEFS.forEach(t => table.set(t.id, { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 }))
  for (const m of MATCHES) {
    if (m.status !== 'finished' || m.home_score == null || m.away_score == null) continue
    const h = table.get(m.home_team_id)!
    const a = table.get(m.away_team_id)!
    h.played++; a.played++
    h.gf += m.home_score; h.ga += m.away_score
    a.gf += m.away_score; a.ga += m.home_score
    if (m.home_score > m.away_score) { h.won++; h.pts += 3; a.lost++ }
    else if (m.home_score < m.away_score) { a.won++; a.pts += 3; h.lost++ }
    else { h.drawn++; a.drawn++; h.pts++; a.pts++ }
  }
  const rows: Standing[] = TEAM_DEFS.map(t => {
    const r = table.get(t.id)!
    return {
      id: `st-${t.id}`,
      tournament_id: TID,
      team_id: t.id,
      team_name: t.name,
      played: r.played, won: r.won, drawn: r.drawn, lost: r.lost,
      goals_for: r.gf, goals_against: r.ga,
      goal_difference: r.gf - r.ga, points: r.pts,
    }
  })
  rows.sort((x, y) =>
    y.points - x.points ||
    y.goal_difference - x.goal_difference ||
    y.goals_for - x.goals_for ||
    (x.team_name || '').localeCompare(y.team_name || ''))
  return rows
})()

// ---------- PAGOS ----------
export const PAYMENTS: Payment[] = (() => {
  const out: Payment[] = []
  TEAM_DEFS.forEach((t, i) => {
    // Inscripción: pagada para casi todos; pendiente/vencida para los últimos
    out.push({
      id: `pay-insc-${t.id}`, team_id: t.id, team_name: t.name,
      type: 'inscription', amount: 3500, currency: 'MXN',
      status: i < 6 ? 'paid' : i === 6 ? 'pending' : 'overdue',
      due_date: '2026-05-10', paid_at: i < 6 ? '2026-05-08T00:00:00Z' : undefined,
      reference: `INS-${1000 + i}`, created_at: '2026-04-20T00:00:00Z',
    })
    // Arbitraje jornada: pendiente para la mitad
    out.push({
      id: `pay-arb-${t.id}`, team_id: t.id, team_name: t.name,
      type: 'arbitration', amount: 800, currency: 'MXN',
      status: i % 2 === 0 ? 'pending' : 'paid',
      due_date: '2026-06-20', paid_at: i % 2 === 0 ? undefined : '2026-06-10T00:00:00Z',
      reference: `ARB-${2000 + i}`, created_at: '2026-06-05T00:00:00Z',
    })
  })
  // Multas puntuales
  out.push({
    id: 'pay-mul-diablos', team_id: 'tm-diablos', team_name: 'Diablos Rojos',
    type: 'penalty', amount: 1200, currency: 'MXN', status: 'overdue',
    due_date: '2026-06-12', reference: 'MUL-3001', notes: 'Conducta antideportiva J3',
    created_at: '2026-06-01T00:00:00Z',
  })
  return out
})()

// ---------- TARJETAS ----------
export const CARDS: Card[] = (() => {
  const out: Card[] = []
  const add = (team: string, pIdx: number, type: Card['type'], minute: number, susp: number, reason: string) => {
    const player = PLAYERS.find(p => p.id === `pl-${team}-${pIdx}`)
    out.push({
      id: `cd-${team}-${pIdx}-${type}`, match_id: 'mt-2-0',
      player_id: player!.id, team_id: team,
      player_name: player!.name, team_name: teamName(team),
      type, minute, reason, suspension_matches: susp,
      created_at: '2026-06-01T00:00:00Z',
    })
  }
  add('tm-tigres', 3, 'yellow', 34, 0, 'Falta táctica')
  add('tm-tigres', 5, 'yellow', 67, 0, 'Protestar')
  add('tm-diablos', 1, 'red', 81, 2, 'Juego brusco grave')
  add('tm-halcon', 5, 'red', 55, 1, 'Doble amarilla')
  add('tm-leones', 2, 'yellow', 12, 0, 'Mano')
  return out
})()

// ---------- NOTIFICACIONES ----------
export const NOTIFICATIONS: Notification[] = [
  { id: 'nt-1', tournament_id: TID, title: 'Jornada 5 en curso', body: 'Tigres FC vs Pumas Dorados se juega ahora en Cancha 1.', type: 'result', target: 'all', created_at: '2026-06-15T10:05:00Z' },
  { id: 'nt-2', tournament_id: TID, title: 'Cambio de horario J6', body: 'El partido Halcones vs Tigres se recorre a las 18:00 hrs.', type: 'schedule', target: 'captains', created_at: '2026-06-14T18:00:00Z' },
  { id: 'nt-3', tournament_id: TID, title: 'Pago de arbitraje', body: 'Recordatorio: la cuota de arbitraje vence el 20 de junio.', type: 'warning', target: 'captains', created_at: '2026-06-13T09:00:00Z' },
  { id: 'nt-4', tournament_id: TID, title: 'Resultados J4 publicados', body: 'Ya puedes consultar la tabla actualizada de la jornada 4.', type: 'info', target: 'all', created_at: '2026-06-08T20:00:00Z' },
]

// ================= API helpers =================
export function getTournaments() { return [TOURNAMENT] }
export function getTeams(tid?: string | null) {
  return [...TEAMS].sort((a, b) => a.name.localeCompare(b.name))
}
export function getStandings(tid?: string | null) { return STANDINGS }
export function getMatches(tid?: string | null) {
  return [...MATCHES].sort((a, b) => (a.scheduled_at || '').localeCompare(b.scheduled_at || ''))
}
export function getPlayers(teamId?: string | null) {
  if (teamId) {
    return PLAYERS.filter(p => p.team_id === teamId)
      .sort((a, b) => (a.number || 99) - (b.number || 99))
  }
  return [...PLAYERS]
    .map(p => ({ ...p, team_name: teamName(p.team_id) }))
    .sort((a, b) => b.goals - a.goals)
}
export function getPayments(teamId?: string | null) {
  const rows = teamId ? PAYMENTS.filter(p => p.team_id === teamId) : PAYMENTS
  const order: Record<string, number> = { overdue: 0, pending: 1, paid: 2 }
  return [...rows].sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9))
}
export function getReferees() { return REFEREES }
export function getCards(opts: { playerId?: string | null; teamId?: string | null }) {
  if (opts.playerId) return CARDS.filter(c => c.player_id === opts.playerId)
  if (opts.teamId) return CARDS.filter(c => c.team_id === opts.teamId)
  return CARDS
}
export function getNotifications(tid?: string | null) { return NOTIFICATIONS }
