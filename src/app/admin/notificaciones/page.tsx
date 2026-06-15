'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Notification, Tournament } from '@/types'

const typeEmoji: Record<string, string> = { info: 'ℹ️', warning: '⚠️', result: '⚽', schedule: '📅' }

export default function AdminNotificacionesPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [activeTournament, setActiveTournament] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', type: 'info', target: 'all' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tournaments').then(r => r.json()).then(t => {
      setTournaments(t)
      const active = t.find((x: Tournament) => x.status === 'active')
      if (active) { setActiveTournament(active.id); }
    })
  }, [])

  useEffect(() => {
    if (!activeTournament) return
    fetch(`/api/notifications?tournament_id=${activeTournament}`)
      .then(r => r.json()).then(n => { setNotifications(n); setLoading(false) })
  }, [activeTournament])

  async function sendNotification() {
    const res = await fetch('/api/notifications', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournament_id: activeTournament, ...form })
    })
    const n = await res.json()
    setNotifications(prev => [n, ...prev])
    setShowForm(false)
    setForm({ title: '', body: '', type: 'info', target: 'all' })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900 }}>🔔 Notificaciones</h1>
          <div style={{ color: '#888', fontSize: 13 }}>Avisos a jugadores y capitanes</div>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)} style={{
          padding: '8px 16px', background: '#CCFF00', color: '#000', border: 'none',
          borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ Nuevo Aviso</motion.button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: '#141414', border: '1px solid rgba(204,255,0,0.3)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input placeholder="Título del aviso *" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))}
              style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, outline: 'none' }} />
            <textarea placeholder="Mensaje..." value={form.body} onChange={e => setForm(p => ({...p, body: e.target.value}))} rows={3}
              style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}
                style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, outline: 'none' }}>
                <option value="info">ℹ️ Información</option>
                <option value="warning">⚠️ Advertencia</option>
                <option value="result">⚽ Resultado</option>
                <option value="schedule">📅 Horario</option>
              </select>
              <select value={form.target} onChange={e => setForm(p => ({...p, target: e.target.value}))}
                style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, outline: 'none' }}>
                <option value="all">Todos</option>
                <option value="captains">Solo Capitanes</option>
                <option value="players">Solo Jugadores</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <motion.button whileTap={{ scale: 0.97 }} onClick={sendNotification} disabled={!form.title || !form.body}
              style={{ padding: '8px 20px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Enviar Aviso</motion.button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #333', borderRadius: 8, color: '#888', cursor: 'pointer', fontSize: 13 }}>Cancelar</button>
          </div>
        </motion.div>
      )}

      {loading ? <div style={{ color: '#555', padding: 40, textAlign: 'center' }}>Cargando...</div>
      : notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
          <div>No hay avisos enviados</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{typeEmoji[n.type] || 'ℹ️'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{n.title}</div>
                  <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.5 }}>{n.body}</div>
                  <div style={{ fontSize: 11, color: '#555', marginTop: 6 }}>
                    {new Date(n.created_at).toLocaleString('es-MX')} · Para: {n.target === 'all' ? 'Todos' : n.target === 'captains' ? 'Capitanes' : 'Jugadores'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
