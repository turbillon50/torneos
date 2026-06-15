'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import type { Team, Payment } from '@/types'

const typeLabel: Record<string, string> = {
  inscription: 'Inscripción', arbitration: 'Arbitraje', penalty: 'Multa'
}
const statusStyle: Record<string, { color: string; bg: string; label: string }> = {
  paid: { color: '#CCFF00', bg: 'rgba(204,255,0,0.1)', label: 'Pagado' },
  pending: { color: '#FFAA00', bg: 'rgba(255,170,0,0.1)', label: 'Pendiente' },
  overdue: { color: '#FF4444', bg: 'rgba(255,68,68,0.1)', label: 'Vencido' },
}

export default function PagosCapitanPage() {
  const { user } = useUser()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState<Team | null>(null)

  useEffect(() => {
    if (!user) return
    fetch('/api/teams').then(r => r.json()).then((teams: Team[]) => {
      const myTeam = teams.find(t => t.captain_clerk_id === user.id)
      setTeam(myTeam || null)
      if (myTeam) {
        fetch(`/api/payments?team_id=${myTeam.id}`)
          .then(r => r.json()).then(p => { setPayments(p); setLoading(false) })
      } else setLoading(false)
    })
  }, [user])

  const totalPending = payments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + Number(p.amount), 0)

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>Cargando...</div>

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>💳 Pagos</h1>
        <div style={{ color: '#888', fontSize: 13 }}>{team?.name}</div>
      </motion.div>

      {totalPending > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          style={{ background: 'rgba(255,170,0,0.1)', border: '1px solid rgba(255,170,0,0.3)',
            borderRadius: 12, padding: '16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, color: '#FFAA00' }}>⚠️ Saldo pendiente</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>Contacta al administrador para realizar el pago</div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#FFAA00' }}>
            ${totalPending.toLocaleString('es-MX')}
          </div>
        </motion.div>
      )}

      {payments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💳</div>
          <div>No hay pagos registrados</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {payments.map(p => {
            const s = statusStyle[p.status] || statusStyle.pending
            return (
              <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: 12, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{typeLabel[p.type] || p.type}</div>
                  {p.due_date && <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Vence: {new Date(p.due_date).toLocaleDateString('es-MX')}</div>}
                  {p.notes && <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{p.notes}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>${Number(p.amount).toLocaleString('es-MX')}</div>
                  <div style={{ fontSize: 11, color: s.color, background: s.bg, padding: '2px 8px', borderRadius: 999, marginTop: 4 }}>{s.label}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
