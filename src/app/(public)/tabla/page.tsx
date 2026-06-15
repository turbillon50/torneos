'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Standing, Tournament } from '@/types'

export default function TablaPage() {
  const [standings, setStandings] = useState<Standing[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [activeTournament, setActiveTournament] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tournaments').then(r => r.json()).catch(() => []).then((data: Tournament[]) => {
      if (!Array.isArray(data)) return
      setTournaments(data)
      const active = data.find(t => t.status === 'active')
      if (active) setActiveTournament(active.id)
      else if (data.length > 0) setActiveTournament(data[0].id)
      else setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!activeTournament) return
    setLoading(true)
    fetch(`/api/standings?tournament_id=${activeTournament}`)
      .then(r => r.json()).catch(() => [])
      .then((data: Standing[]) => { setStandings(Array.isArray(data) ? data : []); setLoading(false) })
  }, [activeTournament])

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: '#CCFF00', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>Clasificación</div>
        <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: -0.8 }}>Tabla de Posiciones</h1>
      </motion.div>

      {/* Selector torneo */}
      {tournaments.length > 1 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto' }}>
          {tournaments.map(t => (
            <button key={t.id} onClick={() => setActiveTournament(t.id)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              border: '1px solid', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.15s',
              borderColor: activeTournament === t.id ? '#CCFF00' : 'rgba(255,255,255,0.1)',
              background: activeTournament === t.id ? '#CCFF00' : 'transparent',
              color: activeTournament === t.id ? '#000' : '#666',
            }}>{t.name} — {t.category}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              height: 52, background: '#111', borderRadius: 10,
              animation: 'skeleton 1.5s ease-in-out infinite',
              opacity: 1 - i * 0.1
            }} />
          ))}
        </div>
      ) : standings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#333' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}>
            <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/>
          </svg>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Sin posiciones registradas</div>
          <div style={{ fontSize: 13, color: '#444', marginTop: 4 }}>Conecta la base de datos para ver la tabla</div>
        </div>
      ) : (
        <>
          {/* Cols header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '28px 1fr 36px 36px 36px 36px 40px 40px 48px',
            gap: 2, padding: '6px 12px', marginBottom: 4
          }}>
            {['#','Equipo','PJ','G','E','P','GF','GD','PTS'].map((h, i) => (
              <div key={h} style={{
                fontSize: 10, fontWeight: 700, color: '#444',
                textTransform: 'uppercase', letterSpacing: 0.5,
                textAlign: i > 1 ? 'center' : 'left'
              }}>{h}</div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {standings.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '28px 1fr 36px 36px 36px 36px 40px 40px 48px',
                  gap: 2, padding: '11px 12px', borderRadius: 10, alignItems: 'center',
                  background: i === 0 ? 'rgba(204,255,0,0.07)' : i < 3 ? 'rgba(204,255,0,0.03)' : '#0d0d0d',
                  border: `1px solid ${i === 0 ? 'rgba(204,255,0,0.2)' : 'rgba(255,255,255,0.04)'}`,
                }}
              >
                <span style={{
                  fontWeight: 800, fontSize: 13,
                  color: i === 0 ? '#CCFF00' : i < 3 ? 'rgba(204,255,0,0.5)' : '#333'
                }}>{i + 1}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  {s.team_shield ? (
                    <img src={s.team_shield} alt="" style={{ width: 22, height: 22, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 22, height: 22, background: '#1a1a1a', borderRadius: 4, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                    </div>
                  )}
                  <span style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.team_name}</span>
                </div>
                {[s.played, s.won, s.drawn, s.lost, s.goals_for, s.goal_difference].map((v, vi) => (
                  <span key={vi} style={{ textAlign: 'center', fontSize: 13, color: '#666' }}>{v}</span>
                ))}
                <span style={{
                  textAlign: 'center', fontWeight: 900, fontSize: 17,
                  color: i === 0 ? '#CCFF00' : i < 3 ? '#fff' : '#aaa'
                }}>{s.points}</span>
              </motion.div>
            ))}
          </div>
        </>
      )}
      <style>{`@keyframes skeleton { 0%,100%{opacity:0.4} 50%{opacity:0.8} }`}</style>
    </div>
  )
}
