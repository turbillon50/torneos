'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PlantillaPage() {
  const [players, setPlayers] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [teamId, setTeamId] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', number: '', position: '' })
  const [saving, setSaving] = useState(false)

  const positions = ['Portero','Defensa Central','Lateral Der','Lateral Izq','Mediocampista','Extremo','Delantero']

  useEffect(() => {
    fetch('/api/teams').then(r => r.json()).catch(() => []).then((t: any[]) => {
      if (!Array.isArray(t) || t.length === 0) { setLoading(false); return }
      setTeams(t)
      setTeamId(t[0].id)
      fetch(`/api/players?team_id=${t[0].id}`).then(r => r.json()).catch(() => []).then((p: any[]) => {
        setPlayers(Array.isArray(p) ? p : [])
        setLoading(false)
      })
    })
  }, [])

  async function addPlayer() {
    if (!teamId || !form.name.trim()) return
    setSaving(true)
    const res = await fetch('/api/players', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team_id: teamId, name: form.name, number: form.number ? parseInt(form.number) : null, position: form.position || null })
    })
    const p = await res.json()
    setPlayers(prev => [...prev, p])
    setForm({ name: '', number: '', position: '' })
    setShowForm(false)
    setSaving(false)
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>Cargando...</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900 }}>👕 Plantilla</h1>
          {teams.length > 0 && (
            <select value={teamId} onChange={e => setTeamId(e.target.value)}
              style={{ marginTop: 6, background: '#141414', border: '1px solid #333', borderRadius: 6, padding: '4px 8px', color: '#fff', fontSize: 13 }}>
              {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          )}
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)} style={{
          padding: '8px 16px', background: '#CCFF00', color: '#000', border: 'none',
          borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ Agregar</motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ background: '#141414', border: '1px solid rgba(204,255,0,0.3)', borderRadius: 12, padding: 16, marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gap: 8, marginBottom: 12 }}>
              <input placeholder="Nombre del jugador" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
                style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none' }} />
              <input placeholder="#" type="number" value={form.number} onChange={e => setForm(p => ({...p, number: e.target.value}))}
                style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px 8px', color: '#fff', fontSize: 14, outline: 'none', textAlign: 'center' }} />
              <select value={form.position} onChange={e => setForm(p => ({...p, position: e.target.value}))}
                style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px 12px', color: form.position ? '#fff' : '#555', fontSize: 14, outline: 'none' }}>
                <option value="">Posición</option>
                {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <motion.button whileTap={{ scale: 0.95 }} onClick={addPlayer} disabled={saving || !form.name} style={{
                padding: '8px 20px', background: form.name ? '#CCFF00' : '#333', color: form.name ? '#000' : '#666',
                border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: form.name ? 'pointer' : 'default'
              }}>{saving ? 'Guardando...' : 'Guardar'}</motion.button>
              <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #333', borderRadius: 8, color: '#888', fontSize: 13, cursor: 'pointer' }}>Cancelar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {players.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👕</div>
          <div>Sin jugadores aún. Conecta la base de datos para agregar.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {players.map((p: any, i: number) => (
            <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0, transition: { delay: i * 0.03 } }}
              style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, background: '#222', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#CCFF00' }}>
                {p.number || '—'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                {p.position && <div style={{ fontSize: 11, color: '#888' }}>{p.position}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                {p.yellow_cards > 0 && <span style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700', padding: '2px 8px', borderRadius: 999 }}>🟨 {p.yellow_cards}</span>}
                {p.red_cards > 0 && <span style={{ background: 'rgba(255,0,0,0.15)', color: '#FF4444', padding: '2px 8px', borderRadius: 999 }}>🟥 {p.red_cards}</span>}
                {p.goals > 0 && <span style={{ background: 'rgba(204,255,0,0.1)', color: '#CCFF00', padding: '2px 8px', borderRadius: 999 }}>⚽ {p.goals}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
