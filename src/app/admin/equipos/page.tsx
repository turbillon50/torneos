'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Team, Tournament } from '@/types'
import { IconUsers, IconBall, IconUser, IconPhone } from '@/components/Icons'

export default function AdminEquiposPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [activeTournament, setActiveTournament] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', captain_name: '', contact_phone: '' })

  useEffect(() => {
    fetch('/api/tournaments').then(r => r.json()).then(t => {
      setTournaments(t)
      const active = t.find((x: Tournament) => x.status === 'active')
      if (active) setActiveTournament(active.id)
    })
  }, [])

  useEffect(() => {
    if (!activeTournament) return
    setLoading(true)
    fetch(`/api/teams?tournament_id=${activeTournament}`)
      .then(r => r.json()).then(d => { setTeams(d); setLoading(false) })
  }, [activeTournament])

  async function addTeam() {
    const res = await fetch('/api/teams', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournament_id: activeTournament, ...form })
    })
    const t = await res.json()
    setTeams(prev => [...prev, t])
    setShowForm(false)
    setForm({ name: '', captain_name: '', contact_phone: '' })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}><IconUsers size={24} /> Equipos</h1>
          <div style={{ color: '#888', fontSize: 13 }}>{teams.length} equipos registrados</div>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)} style={{
          padding: '8px 16px', background: '#CCFF00', color: '#000', border: 'none',
          borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ Agregar Equipo</motion.button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {tournaments.map(t => (
          <button key={t.id} onClick={() => setActiveTournament(t.id)} style={{
            padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: '1px solid', cursor: 'pointer',
            borderColor: activeTournament === t.id ? '#CCFF00' : '#333',
            background: activeTournament === t.id ? '#CCFF00' : 'transparent',
            color: activeTournament === t.id ? '#000' : '#888',
          }}>{t.name}</button>
        ))}
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: '#141414', border: '1px solid rgba(204,255,0,0.3)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
            <input placeholder="Nombre del equipo *" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
              style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, outline: 'none' }} />
            <input placeholder="Nombre del capitán" value={form.captain_name} onChange={e => setForm(p => ({...p, captain_name: e.target.value}))}
              style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, outline: 'none' }} />
            <input placeholder="Teléfono" value={form.contact_phone} onChange={e => setForm(p => ({...p, contact_phone: e.target.value}))}
              style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <motion.button whileTap={{ scale: 0.97 }} onClick={addTeam} disabled={!form.name}
              style={{ padding: '8px 20px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Guardar</motion.button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #333', borderRadius: 8, color: '#888', cursor: 'pointer', fontSize: 13 }}>Cancelar</button>
          </div>
        </motion.div>
      )}

      {loading ? <div style={{ color: '#555', padding: 40, textAlign: 'center' }}>Cargando...</div>
      : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 12 }}>
          {teams.map(t => (
            <motion.div key={t.id} whileHover={{ borderColor: '#333', scale: 1.01 }} style={{
              background: '#141414', border: '1px solid #1e1e1e', borderRadius: 12, padding: 16
            }}>
              <div style={{ width: 48, height: 48, background: '#222', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, color: '#fff' }}><IconBall size={24} /></div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{t.name}</div>
              {t.captain_name && <div style={{ fontSize: 12, color: '#888', display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconUser size={12} /> {t.captain_name}</div>}
              {t.contact_phone && <div style={{ fontSize: 12, color: '#888', display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconPhone size={12} /> {t.contact_phone}</div>}
              <div style={{
                marginTop: 10, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, display: 'inline-block',
                color: t.status === 'active' ? '#000' : '#888',
                background: t.status === 'active' ? '#CCFF00' : '#222'
              }}>{t.status === 'active' ? 'ACTIVO' : t.status === 'suspended' ? 'SUSPENDIDO' : 'RETIRADO'}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
