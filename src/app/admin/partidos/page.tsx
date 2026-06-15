'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Match, Team, Tournament } from '@/types'

export default function AdminPartidosPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [activeTournament, setActiveTournament] = useState('')
  const [loading, setLoading] = useState(true)
  const [editMatch, setEditMatch] = useState<Match | null>(null)
  const [scoreForm, setScoreForm] = useState({ home_score: '', away_score: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/tournaments').then(r => r.json()),
      fetch('/api/teams').then(r => r.json()),
    ]).then(([t, tm]) => {
      setTournaments(t)
      setTeams(tm)
      const active = t.find((x: Tournament) => x.status === 'active')
      if (active) setActiveTournament(active.id)
    })
  }, [])

  useEffect(() => {
    if (!activeTournament) return
    setLoading(true)
    fetch(`/api/matches?tournament_id=${activeTournament}`)
      .then(r => r.json()).then(data => { setMatches(data); setLoading(false) })
  }, [activeTournament])

  async function saveResult() {
    if (!editMatch) return
    setSaving(true)
    await fetch(`/api/matches/${editMatch.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ home_score: parseInt(scoreForm.home_score), away_score: parseInt(scoreForm.away_score), status: 'finished' })
    })
    setMatches(prev => prev.map(m => m.id === editMatch.id
      ? { ...m, home_score: parseInt(scoreForm.home_score), away_score: parseInt(scoreForm.away_score), status: 'finished' }
      : m))
    setEditMatch(null)
    setSaving(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900 }}>⚽ Partidos</h1>
          <div style={{ color: '#888', fontSize: 13 }}>Gestión de resultados y rol de juegos</div>
        </div>
      </div>

      {/* Selector torneo */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {tournaments.map(t => (
          <button key={t.id} onClick={() => setActiveTournament(t.id)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
            border: '1px solid', cursor: 'pointer',
            borderColor: activeTournament === t.id ? '#CCFF00' : '#333',
            background: activeTournament === t.id ? '#CCFF00' : 'transparent',
            color: activeTournament === t.id ? '#000' : '#888',
          }}>{t.name}</button>
        ))}
      </div>

      {/* Modal resultado */}
      <AnimatePresence>
        {editMatch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
            onClick={e => { if (e.target === e.currentTarget) setEditMatch(null) }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
              style={{ background: '#141414', border: '1px solid rgba(204,255,0,0.3)', borderRadius: 16,
                padding: 28, width: '100%', maxWidth: 380 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: '#CCFF00' }}>Registrar Resultado</div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 20 }}>
                {editMatch.home_team_name} vs {editMatch.away_team_name}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 32px 1fr', gap: 8, alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{editMatch.home_team_name}</div>
                  <input type="number" min="0" value={scoreForm.home_score}
                    onChange={e => setScoreForm(p => ({...p, home_score: e.target.value}))}
                    style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: 8,
                      padding: '12px', color: '#fff', fontSize: 24, fontWeight: 900, outline: 'none', textAlign: 'center' }} />
                </div>
                <div style={{ textAlign: 'center', color: '#555', fontWeight: 700 }}>-</div>
                <div>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{editMatch.away_team_name}</div>
                  <input type="number" min="0" value={scoreForm.away_score}
                    onChange={e => setScoreForm(p => ({...p, away_score: e.target.value}))}
                    style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: 8,
                      padding: '12px', color: '#fff', fontSize: 24, fontWeight: 900, outline: 'none', textAlign: 'center' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={saveResult} disabled={saving || scoreForm.home_score === '' || scoreForm.away_score === ''} style={{
                  flex: 1, padding: '12px', background: '#CCFF00', color: '#000',
                  border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer'
                }}>{saving ? 'Guardando...' : 'Guardar Resultado'}</motion.button>
                <button onClick={() => setEditMatch(null)} style={{
                  padding: '12px 16px', background: 'transparent', border: '1px solid #333',
                  borderRadius: 8, color: '#888', cursor: 'pointer' }}>✕</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(5)].map((_, i) => <div key={i} style={{ height: 80, background: '#141414', borderRadius: 12, opacity: 0.5 }} />)}
        </div>
      ) : matches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚽</div>
          <div>No hay partidos programados en este torneo</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {matches.map(m => (
            <motion.div key={m.id} whileHover={{ borderColor: '#333' }} style={{
              background: '#141414', border: '1px solid #1e1e1e', borderRadius: 12,
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{m.home_team_name}</span>
                  <span style={{ fontWeight: 900, fontSize: 16, color: m.status === 'finished' ? '#CCFF00' : '#555', minWidth: 60, textAlign: 'center' }}>
                    {m.status === 'finished' || m.status === 'live' ? `${m.home_score} - ${m.away_score}` : 'VS'}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{m.away_team_name}</span>
                </div>
                <div style={{ fontSize: 11, color: '#555' }}>
                  {m.matchday_number && `J${m.matchday_number} · `}
                  {m.field && `${m.field} · `}
                  {m.scheduled_at && new Date(m.scheduled_at).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
                  color: m.status === 'finished' ? '#888' : m.status === 'live' ? '#000' : '#888',
                  background: m.status === 'live' ? '#CCFF00' : m.status === 'finished' ? '#1a1a1a' : '#1a1a1a'
                }}>
                  {m.status === 'finished' ? 'Final' : m.status === 'live' ? 'EN VIVO' : m.status === 'postponed' ? 'Pospuesto' : 'Pendiente'}
                </div>
                {m.status !== 'finished' && (
                  <motion.button whileTap={{ scale: 0.95 }}
                    onClick={() => { setEditMatch(m); setScoreForm({ home_score: '', away_score: '' }) }}
                    style={{ padding: '6px 12px', background: 'rgba(204,255,0,0.1)', border: '1px solid rgba(204,255,0,0.3)',
                      borderRadius: 6, color: '#CCFF00', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Resultado
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
