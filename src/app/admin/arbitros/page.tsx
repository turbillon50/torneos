'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Referee } from '@/types'

export default function AdminArbitrosPage() {
  const [referees, setReferees] = useState<Referee[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '' })

  useEffect(() => {
    fetch('/api/players?referees=1').then(() =>
      // usar endpoint propio
      fetch('/api/tournaments').then(r => r.json()).then(() => {
        // Por ahora cargar de DB directamente via endpoint que crearemos
        setLoading(false)
      })
    )
    setLoading(false)
  }, [])

  async function addReferee() {
    // POST a /api/referees cuando esté listo
    const newRef: Referee = { id: crypto.randomUUID(), name: form.name, phone: form.phone, status: 'active', created_at: new Date().toISOString() }
    setReferees(prev => [...prev, newRef])
    setShowForm(false)
    setForm({ name: '', phone: '' })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900 }}>🟨 Árbitros</h1>
          <div style={{ color: '#888', fontSize: 13 }}>{referees.length} árbitros registrados</div>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)} style={{
          padding: '8px 16px', background: '#CCFF00', color: '#000', border: 'none',
          borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ Agregar</motion.button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: '#141414', border: '1px solid rgba(204,255,0,0.3)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <input placeholder="Nombre del árbitro *" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
              style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, outline: 'none' }} />
            <input placeholder="Teléfono" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))}
              style={{ background: '#0d0d0d', border: '1px solid #333', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <motion.button whileTap={{ scale: 0.97 }} onClick={addReferee} disabled={!form.name}
              style={{ padding: '8px 20px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Guardar</motion.button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #333', borderRadius: 8, color: '#888', cursor: 'pointer', fontSize: 13 }}>Cancelar</button>
          </div>
        </motion.div>
      )}

      {referees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🟨</div>
          <div>No hay árbitros registrados</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {referees.map(r => (
            <div key={r.id} style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, background: '#222', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🟨</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                {r.phone && <div style={{ fontSize: 12, color: '#888' }}>{r.phone}</div>}
              </div>
              <div style={{ fontSize: 10, color: r.status === 'active' ? '#CCFF00' : '#888',
                background: r.status === 'active' ? 'rgba(204,255,0,0.1)' : '#1a1a1a',
                padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                {r.status === 'active' ? 'ACTIVO' : 'INACTIVO'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
