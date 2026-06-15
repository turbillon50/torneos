'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Standing, Tournament } from '@/types'

const stagger = { show: { transition: { staggerChildren: 0.05 } } }
const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

export default function TablaPage() {
  const [standings, setStandings] = useState<Standing[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [activeTournament, setActiveTournament] = useState<string>('')
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
    fetch(`/api/standings?tournament_id=${activeTournament}`)
      .then(r => r.json()).then(data => { setStandings(data); setLoading(false) })
  }, [activeTournament])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>🏆 Tabla de Posiciones</h1>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Posiciones en tiempo real</p>
      </motion.div>

      {/* Selector torneo */}
      {tournaments.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }}>
          {tournaments.map(t => (
            <button key={t.id} onClick={() => setActiveTournament(t.id)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              border: '1px solid', whiteSpace: 'nowrap', cursor: 'pointer',
              borderColor: activeTournament === t.id ? '#CCFF00' : '#333',
              background: activeTournament === t.id ? '#CCFF00' : 'transparent',
              color: activeTournament === t.id ? '#000' : '#888',
            }}>{t.name} · {t.category}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ height: 52, background: '#141414', borderRadius: 10, animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : standings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div>Aún no hay posiciones registradas</div>
        </div>
      ) : (
        <>
          {/* Header tabla */}
          <div style={{
            display: 'grid', gridTemplateColumns: '32px 1fr 40px 40px 40px 40px 40px 40px 48px',
            gap: 4, padding: '8px 12px', color: '#555', fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4
          }}>
            <span>#</span><span>Equipo</span>
            <span style={{ textAlign: 'center' }}>PJ</span>
            <span style={{ textAlign: 'center' }}>G</span>
            <span style={{ textAlign: 'center' }}>E</span>
            <span style={{ textAlign: 'center' }}>P</span>
            <span style={{ textAlign: 'center' }}>GD</span>
            <span style={{ textAlign: 'center' }}>GF</span>
            <span style={{ textAlign: 'center' }}>PTS</span>
          </div>

          <motion.div initial="hidden" animate="show" variants={stagger} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {standings.map((s, i) => (
              <motion.div key={s.id} variants={fadeUp} style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr 40px 40px 40px 40px 40px 40px 48px',
                gap: 4, padding: '12px', borderRadius: 10,
                background: i < 3 ? 'rgba(204,255,0,0.05)' : '#141414',
                border: `1px solid ${i < 3 ? 'rgba(204,255,0,0.15)' : '#1e1e1e'}`,
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 700, color: i < 3 ? '#CCFF00' : '#555', fontSize: 14 }}>{i + 1}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  {s.team_shield ? (
                    <img src={s.team_shield} alt="" style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 24, height: 24, background: '#222', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#555' }}>⚽</div>
                  )}
                  <span style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.team_name}</span>
                </div>
                {[s.played, s.won, s.drawn, s.lost, s.goal_difference, s.goals_for].map((val, vi) => (
                  <span key={vi} style={{ textAlign: 'center', fontSize: 13, color: '#aaa' }}>{val}</span>
                ))}
                <span style={{
                  textAlign: 'center', fontWeight: 900, fontSize: 16,
                  color: i < 3 ? '#CCFF00' : '#fff'
                }}>{s.points}</span>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  )
}
