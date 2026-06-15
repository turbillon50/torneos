'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Payment, Team } from '@/types'

const typeLabel: Record<string, string> = { inscription: 'Inscripción', arbitration: 'Arbitraje', penalty: 'Multa' }
const statusColor: Record<string, string> = { paid: '#CCFF00', pending: '#FFAA00', overdue: '#FF4444' }
const statusLabel: Record<string, string> = { paid: 'Pagado', pending: 'Pendiente', overdue: 'Vencido' }

export default function AdminPagosPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ team_id: '', type: 'inscription', amount: '', status: 'pending', due_date: '', notes: '' })

  useEffect(() => {
    Promise.all([
      fetch('/api/payments').then(r => r.json()),
      fetch('/api/teams').then(r => r.json()),
    ]).then(([p, t]) => { setPayments(p); setTeams(t); setLoading(false) })
  }, [])

  async function addPayment() {
    const res = await fetch('/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: parseFloat(form.amount) })
    })
    const p = await res.json()
    setPayments(prev => [p, ...prev])
    setShowForm(false)
    setForm({ team_id: '', type: 'inscription', amount: '', status: 'pending', due_date: '', notes: '' })
  }

  async function markPaid(id: string) {
    // Optimistic update
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'paid', paid_at: new Date().toISOString() } : p))
  }

  const totalPending = payments.filter(p => p.status !== 'paid').reduce((s, p) => s + Number(p.amount), 0)
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900 }}>💳 Pagos</h1>
          <div style={{ color: '#888', fontSize: 13 }}>Control financiero de equipos</div>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)} style={{
          padding: '8px 16px', background: '#CCFF00', color: '#000', border: 'none',
          borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ Agregar</motion.button>
      </div>

      {/* Resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#141414', border: '1px solid rgba(255,170,0,0.2)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase' }}>Por Cobrar</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#FFAA00' }}>${totalPending.toLocaleString('es-MX')}</div>
        </div>
        <div style={{ background: '#141414', border: '1px solid rgba(204,255,0,0.2)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase' }}>Cobrado</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#CCFF00' }}>${totalPaid.toLocaleString('es-MX')}</div>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          style={{ background: '#141414', border: '1px solid rgba(204,255,0,0.3)', borderRadius: 12, padding: 16, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <select value={form.team_id} onChange={e => setForm(p => ({...p, team_id: e.target.value}))}
              style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px', color: form.team_id ? '#fff' : '#555', fontSize: 13, outline: 'none' }}>
              <option value="">Seleccionar equipo</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}
              style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, outline: 'none' }}>
              <option value="inscription">Inscripción</option>
              <option value="arbitration">Arbitraje</option>
              <option value="penalty">Multa</option>
            </select>
            <input type="number" placeholder="Monto MXN" value={form.amount} onChange={e => setForm(p => ({...p, amount: e.target.value}))}
              style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, outline: 'none' }} />
            <input type="date" value={form.due_date} onChange={e => setForm(p => ({...p, due_date: e.target.value}))}
              style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, outline: 'none' }} />
          </div>
          <input placeholder="Notas (opcional)" value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))}
            style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, outline: 'none', marginBottom: 8 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <motion.button whileTap={{ scale: 0.97 }} onClick={addPayment} disabled={!form.team_id || !form.amount}
              style={{ padding: '8px 20px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Guardar</motion.button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #333', borderRadius: 8, color: '#888', cursor: 'pointer', fontSize: 13 }}>Cancelar</button>
          </div>
        </motion.div>
      )}

      {loading ? <div style={{ color: '#555', textAlign: 'center', padding: 40 }}>Cargando...</div>
      : payments.map(p => (
        <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: 10, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{p.team_name} · {typeLabel[p.type] || p.type}</div>
            {p.due_date && <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Vence {new Date(p.due_date).toLocaleDateString('es-MX')}</div>}
            {p.notes && <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{p.notes}</div>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>${Number(p.amount).toLocaleString('es-MX')}</div>
            <div style={{ fontSize: 11, color: statusColor[p.status], background: `${statusColor[p.status]}18`,
              padding: '2px 8px', borderRadius: 999, marginTop: 4 }}>{statusLabel[p.status]}</div>
          </div>
          {p.status !== 'paid' && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => markPaid(p.id)} style={{
              padding: '6px 10px', background: 'rgba(204,255,0,0.1)', border: '1px solid rgba(204,255,0,0.3)',
              borderRadius: 6, color: '#CCFF00', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>✓ Pagar</motion.button>
          )}
        </motion.div>
      ))}
    </div>
  )
}
