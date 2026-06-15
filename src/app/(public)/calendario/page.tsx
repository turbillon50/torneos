'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Match, Tournament } from '@/types'
import { IconPin, IconClock, IconWhistle, IconCalendar, IconBall } from '@/components/Icons'

function MatchCard({ m }: { m: Match }) {
  const isLive = m.status === 'live'
  const isFinished = m.status === 'finished'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#141414', border: `1px solid ${isLive ? 'rgba(204,255,0,0.4)' : '#1e1e1e'}`,
        borderRadius: 12, padding: '16px', marginBottom: 8,
        position: 'relative', overflow: 'hidden'
      }}
    >
      {isLive && (
        <div style={{
          position: 'absolute', top: 8, right: 8, fontSize: 10, fontWeight: 700,
          color: '#000', background: '#CCFF00', padding: '2px 8px', borderRadius: 999, letterSpacing: 1
        }}>EN VIVO</div>
      )}
      <div style={{ fontSize: 11, color: '#555', marginBottom: 10, display: 'flex', gap: 12 }}>
        {m.matchday_number && <span>Jornada {m.matchday_number}</span>}
        {m.field && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconPin size={12} />{m.field}</span>}
        {m.scheduled_at && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconClock size={12} />{new Date(m.scheduled_at).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
        {m.referee_name && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconWhistle size={12} />{m.referee_name}</span>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{m.home_team_name}</div>
        </div>
        <div style={{ textAlign: 'center', minWidth: 80 }}>
          {isFinished || isLive ? (
            <div style={{ fontSize: 24, fontWeight: 900, color: isLive ? '#CCFF00' : '#fff' }}>
              {m.home_score} - {m.away_score}
            </div>
          ) : (
            <div style={{ fontSize: 18, fontWeight: 700, color: '#555' }}>VS</div>
          )}
          <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>
            {m.status === 'postponed' ? 'Pospuesto' : m.status === 'finished' ? 'Final' : m.status === 'live' ? '' : 'Pendiente'}
          </div>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{m.away_team_name}</div>
        </div>
      </div>
    </motion.div>
  )
}

export default function CalendarioPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [activeTournament, setActiveTournament] = useState<string>('')
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tournaments').then(r => r.json()).then(data => {
      setTournaments(data)
      const active = data.find((t: Tournament) => t.status === 'active')
      if (active) setActiveTournament(active.id)
    })
  }, [])

  useEffect(() => {
    if (!activeTournament) return
    setLoading(true)
    fetch(`/api/matches?tournament_id=${activeTournament}`)
      .then(r => r.json()).then(data => { setMatches(data); setLoading(false) })
  }, [activeTournament])

  const filtered = matches.filter(m => filter === 'all' || m.status === filter)

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 4, display: 'inline-flex', alignItems: 'center', gap: 10 }}><IconCalendar size={24} />Calendario</h1>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Partidos y resultados</p>
      </motion.div>

      {tournaments.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
          {tournaments.map(t => (
            <button key={t.id} onClick={() => setActiveTournament(t.id)} style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              border: '1px solid', whiteSpace: 'nowrap', cursor: 'pointer',
              borderColor: activeTournament === t.id ? '#CCFF00' : '#333',
              background: activeTournament === t.id ? '#CCFF00' : 'transparent',
              color: activeTournament === t.id ? '#000' : '#888',
            }}>{t.name}</button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }}>
        {[['all','Todos'],['live','En Vivo'],['scheduled','Próximos'],['finished','Finalizados']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
            border: '1px solid', whiteSpace: 'nowrap', cursor: 'pointer',
            borderColor: filter === val ? '#CCFF00' : '#333',
            background: filter === val ? '#CCFF00' : 'transparent',
            color: filter === val ? '#000' : '#888',
          }}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(5)].map((_, i) => <div key={i} style={{ height: 96, background: '#141414', borderRadius: 12, opacity: 0.5 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
          <div style={{ marginBottom: 12 }}><IconBall size={40} /></div>
          <div>No hay partidos en esta categoría</div>
        </div>
      ) : (
        <div>{filtered.map(m => <MatchCard key={m.id} m={m} />)}</div>
      )}
    </div>
  )
}
