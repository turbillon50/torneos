'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import type { Team, Card } from '@/types'

export default function SancionesCapitanPage() {
  const { user } = useUser()
  const [cards, setCards] = useState<Card[]>([])
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch('/api/teams').then(r => r.json()).then((teams: Team[]) => {
      const myTeam = teams.find(t => t.captain_clerk_id === user.id)
      setTeam(myTeam || null)
      if (myTeam) {
        fetch(`/api/cards?team_id=${myTeam.id}`)
          .then(r => r.json()).then(c => { setCards(c); setLoading(false) })
      } else setLoading(false)
    })
  }, [user])

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>Cargando...</div>

  const suspended = cards.filter(c => c.suspension_matches > 0)

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>🟨 Tarjetas y Sanciones</h1>
        <div style={{ color: '#888', fontSize: 13 }}>{team?.name}</div>
      </motion.div>

      {suspended.length > 0 && (
        <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)',
          borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, color: '#FF4444', marginBottom: 8 }}>🚫 Jugadores Suspendidos</div>
          {suspended.map(c => (
            <div key={c.id} style={{ fontSize: 13, color: '#ccc', padding: '4px 0', borderBottom: '1px solid #1a1a1a' }}>
              {c.player_name} — {c.suspension_matches} partido(s) suspendido(s)
            </div>
          ))}
        </div>
      )}

      {cards.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🟩</div>
          <div>Sin tarjetas registradas. ¡Juego limpio!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {cards.map(c => (
            <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: 10,
                padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 22 }}>
                {c.type === 'yellow' ? '🟨' : c.type === 'double_yellow' ? '🟨🟥' : '🟥'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{c.player_name}</div>
                {c.minute && <div style={{ fontSize: 11, color: '#888' }}>Min. {c.minute}</div>}
                {c.reason && <div style={{ fontSize: 11, color: '#666' }}>{c.reason}</div>}
              </div>
              {c.suspension_matches > 0 && (
                <div style={{ fontSize: 11, color: '#FF4444', background: 'rgba(255,68,68,0.1)',
                  padding: '3px 8px', borderRadius: 999 }}>+{c.suspension_matches} partido(s)</div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
