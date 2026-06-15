'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Team, Tournament } from '@/types'
import { IconUsers, IconStadium, IconBall } from '@/components/Icons'

export default function EquiposPage() {
  const [teams, setTeams] = useState<Team[]>([])
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
    fetch(`/api/teams?tournament_id=${activeTournament}`)
      .then(r => r.json()).then(data => { setTeams(data); setLoading(false) })
  }, [activeTournament])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 4, display: 'inline-flex', alignItems: 'center', gap: 10 }}><IconUsers size={24} />Equipos</h1>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Equipos participantes</p>
      </motion.div>

      {tournaments.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }}>
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

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 12 }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ height: 120, background: '#141414', borderRadius: 12, opacity: 0.5 }} />)}
        </div>
      ) : teams.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
          <div style={{ marginBottom: 12 }}><IconStadium size={40} /></div>
          <div>No hay equipos registrados</div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 12 }}
        >
          {teams.map(t => (
            <motion.div key={t.id} whileHover={{ scale: 1.02, borderColor: 'rgba(204,255,0,0.3)' }} style={{
              background: '#141414', border: '1px solid #222', borderRadius: 12,
              padding: '20px 16px', textAlign: 'center', cursor: 'pointer'
            }}>
              {t.shield_url ? (
                <img src={t.shield_url} alt={t.name} style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', marginBottom: 10 }} />
              ) : (
                <div style={{ width: 56, height: 56, background: '#222', borderRadius: 8, margin: '0 auto 10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}><IconBall size={24} /></div>
              )}
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{t.name}</div>
              <div style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 999,
                background: t.status === 'active' ? 'rgba(204,255,0,0.1)' : 'rgba(255,68,68,0.1)',
                color: t.status === 'active' ? '#CCFF00' : '#FF4444', display: 'inline-block'
              }}>{t.status === 'active' ? 'Activo' : t.status === 'suspended' ? 'Suspendido' : 'Retirado'}</div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
